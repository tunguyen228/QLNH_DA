using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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

        [HttpGet("danhsach")]
        public async Task<IActionResult> GetDanhSachOrder()
        {
            // FIX: DateTime.Today có Kind = Local -> Npgsql ném lỗi khi cột
            // ThoiGianTao là timestamptz. Phải ép về UTC như đã làm bên HoaDon.cs.
            var today = DateTime.SpecifyKind(DateTime.UtcNow.Date, DateTimeKind.Utc);

            var orders = await _context.PhieuGois
                .Where(p => p.ThoiGianTao >= today || p.TrangThai != "Đã thanh toán")
                .OrderByDescending(p => p.MaPhieu)
                .ToListAsync();

            if (!orders.Any())
            {
                return Ok(new List<object>());
            }

            var orderIds = orders.Select(o => o.MaPhieu).ToList();

            var chiTiets = await _context.ChiTietPhieuGois
                .Where(ct => orderIds.Contains(ct.MaPhieu))
                .ToListAsync();

            var monAnIds = chiTiets.Select(ct => ct.MaMon).Distinct().ToList();

            var monAns = await _context.MonAns
                .Where(m => monAnIds.Contains(m.MaMon))
                .ToListAsync();

            var result = orders.Select(p =>
            {
                var chiTietPhieu = chiTiets
                    .Where(ct => ct.MaPhieu == p.MaPhieu)
                    .Select(ct =>
                    {
                        var mon = monAns.FirstOrDefault(m => m.MaMon == ct.MaMon);
                        return new
                        {
                            maMon = ct.MaMon,
                            tenMon = mon != null ? mon.TenMon : "Món không xác định",
                            soLuong = ct.SoLuong,
                            trangThai = ct.TrangThai,
                            ghiChu = ct.GhiChu,
                            gia = mon != null ? mon.GiaTien : 0
                        };
                    }).ToList();

                return new
                {
                    maPhieu = p.MaPhieu,
                    tenBan = p.MaBan.ToString(),
                    thoiGianTao = p.ThoiGianTao,
                    tongTien = chiTietPhieu.Sum(c => c.soLuong * c.gia),
                    chiTiet = chiTietPhieu
                };
            })
            .Where(o => o.chiTiet.Any())
            .ToList();

            return Ok(result);
        }

        [HttpPut("{phieuGoiId}/mon/{monAnId}/serve")]
        public async Task<IActionResult> ServeDish(int phieuGoiId, int monAnId)
        {
            var result = await _bepService.CapNhatTrangThaiMonAsync(phieuGoiId, monAnId, "DaPhucVu");
            if (result) return Ok(new { message = "Đã phục vụ món thành công" });

            return BadRequest("Không tìm thấy món ăn trong phiếu gọi.");
        }

        [HttpGet("table/{maBan}/checkout")]
        public async Task<IActionResult> GetCheckoutInfoByTable(int maBan)
        {
            var phieuGois = await _context.PhieuGois
                .Where(p => p.MaBan == maBan && p.TrangThai != "Đã thanh toán")
                .ToListAsync();

            if (!phieuGois.Any())
            {
                return NotFound(new { message = "Bàn chưa có phiếu gọi để thanh toán" });
            }

            var phieuGoiIds = phieuGois.Select(p => p.MaPhieu).ToList();

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

            var result = chiTietRaw
                .GroupBy(c => new { c.maMon, c.tenMon, c.gia })
                .Select(g => new
                {
                    id = g.Key.maMon,
                    name = g.Key.tenMon,
                    qty = g.Sum(c => c.soLuong),
                    price = g.Key.gia,
                    total = g.Sum(c => c.soLuong) * g.Key.gia
                }).ToList();

            return Ok(result);
        }
    }
}