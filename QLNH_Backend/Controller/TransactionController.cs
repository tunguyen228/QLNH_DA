using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DAL;
using QLNH_Backend.DTO;

namespace QLNH_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TransactionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetTransactionHistory()
        {
            try
            {
                var hoaDons = await _context.HoaDons
                    .Include(h => h.MaNvNavigation)
                    .Include(h => h.MaKhNavigation)
                    .Include(h => h.HoaDonBans)
                    .Include(h => h.ChiTietHoaDons)
                    .OrderByDescending(h => h.ThoiGianRa) 
                    .ToListAsync();
                var result = hoaDons.Select(h => new TransactionDTO
                {
                    Id = h.MaHoaDon.ToString(),
                    InvoiceId = $"#HD-{h.MaHoaDon:D4}", 
                    Time = h.ThoiGianRa.ToString("HH:mm - dd/MM/yyyy"), 
                    TableName = h.HoaDonBans.Any() ? string.Join(", ", h.HoaDonBans.Select(hb => $"Bàn {hb.MaBan}")) : "Mang đi",
                    Cashier = h.MaNvNavigation != null ? h.MaNvNavigation.HoTen : "Thu Ngân",
                    PaymentMethod = GetPaymentMethodCode(h.PhuongThucTt),
                    TotalAmount = h.TongThanhToan,
                    Status = "Paid"
                }).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new { message = ex.Message });
            }
        }
        private string GetPaymentMethodCode(string phuongThuc)
        {
            if (string.IsNullOrEmpty(phuongThuc)) return "None";
            if (phuongThuc.Contains("Tiền mặt", StringComparison.OrdinalIgnoreCase)) return "Cash";
            if (phuongThuc.Contains("Chuyển khoản", StringComparison.OrdinalIgnoreCase)) return "Transfer";
            if (phuongThuc.Contains("thẻ", StringComparison.OrdinalIgnoreCase)) return "Card";
            return "None";
        }
    }
}