using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using QLNH_Backend.BLL;
using QLNH_Backend.DAL; 

namespace QLNH_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IBepService _bepService;
        private readonly AppDbContext _context;

        public OrderController(IBepService bepService, AppDbContext context)
        {
            _bepService = bepService;
            _context = context;
        }

        // Endpoint mới trả về danh sách cho màn hình phục vụ
        [HttpGet("danhsach")]
        public async Task<IActionResult> GetDanhSachOrder()
        {
            var orders = await _context.PhieuGois
                .OrderByDescending(p => p.MaPhieu) // Phiếu mới nhất (MaPhieu lớn nhất) lên đầu
                .Select(p => new 
                {
                    maPhieu = p.MaPhieu,
                    tenBan = p.MaBan.ToString(),
                    thoiGianTao = p.ThoiGianTao, 
                    chiTiet = _context.ChiTietPhieuGois
                        .Where(ct => ct.MaPhieu == p.MaPhieu)
                        .Select(ct => new 
                        {
                            maMon = ct.MaMon,
                            tenMon = _context.MonAns.FirstOrDefault(m => m.MaMon == ct.MaMon).TenMon,
                            soLuong = ct.SoLuong,
                            trangThai = ct.TrangThai,
                            ghiChu = ct.GhiChu,
                            gia = _context.MonAns.FirstOrDefault(m => m.MaMon == ct.MaMon).GiaTien 
                        }).ToList()
                })
                .Where(p => p.chiTiet.Any())
                .ToListAsync();

            var result = orders.Select(o => new 
            {
                o.maPhieu,
                o.tenBan,
                o.thoiGianTao,
                tongTien = o.chiTiet.Sum(c => c.soLuong * c.gia),
                o.chiTiet
            });

            return Ok(result);
        }

        [HttpPut("{phieuGoiId}/mon/{monAnId}/serve")]
        public async Task<IActionResult> ServeDish(int phieuGoiId, int monAnId)
        {
            var result = await _bepService.CapNhatTrangThaiMonAsync(phieuGoiId, monAnId, "DaPhucVu");
            if (result) return Ok(new { message = "Đã phục vụ món thành công" });
            
            return BadRequest("Không tìm thấy món ăn trong phiếu gọi.");
        }
        
        // Trong OrderController.cs

        [HttpGet("table/{maBan}/checkout")]
        public async Task<IActionResult> GetCheckoutInfoByTable(int maBan)
        {
            // Bước 1: Tìm các Phiếu gọi của Bàn này chưa được thanh toán. 
            // Tùy vào thiết kế CSDL của bạn, hãy sửa lại điều kiện Where cho đúng.
            // Ví dụ: p.TrangThai == "ChuaThanhToan"
            var phieuGois = await _context.PhieuGois
                .Where(p => p.MaBan == maBan && p.TrangThai != "Đã thanh toán") // <--- Xóa comment và thêm điều kiện này
                .ToListAsync();

            if (!phieuGois.Any()) 
            {
                return NotFound(new { message = "Bàn chưa có phiếu gọi để thanh toán" });
            }

            // Lấy danh sách Mã phiếu gọi
            var phieuGoiIds = phieuGois.Select(p => p.MaPhieu).ToList();

            // Bước 2: Lấy TẤT CẢ chi tiết món ăn thuộc về các phiếu gọi trên
            var chiTietRaw = await _context.ChiTietPhieuGois
                .Where(ct => phieuGoiIds.Contains(ct.MaPhieu))
                .Select(ct => new 
                {
                    maMon = ct.MaMon,
                    soLuong = ct.SoLuong,
                    tenMon = _context.MonAns.FirstOrDefault(m => m.MaMon == ct.MaMon).TenMon,
                    gia = _context.MonAns.FirstOrDefault(m => m.MaMon == ct.MaMon).GiaTien
                })
                .ToListAsync();

            // Bước 3: THỰC HIỆN GỘP MÓN (Chỉ gộp lúc tính tiền)
            var result = chiTietRaw
                .GroupBy(c => new { c.maMon, c.tenMon, c.gia })
                .Select(g => new 
                {
                    id = g.Key.maMon,         // Trả về id cho khớp map(item => item.id) bên React
                    name = g.Key.tenMon,      // Trả về name
                    qty = g.Sum(c => c.soLuong), // Tổng hợp số lượng các lần gọi
                    price = g.Key.gia,
                    total = g.Sum(c => c.soLuong) * g.Key.gia // Thành tiền
                }).ToList();

            return Ok(result);
        }
    }
}