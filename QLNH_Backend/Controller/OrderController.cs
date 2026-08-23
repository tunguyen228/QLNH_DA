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
    }
}