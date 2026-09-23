using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QLNH_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context)
        {
            _context = context;
        }
        private (DateTime start, DateTime end) GetDateRange(DateTime? from, DateTime? to)
        {
            var f = from ?? DateTime.UtcNow.AddDays(-6);
            var t = to ?? DateTime.UtcNow;
            var startUtc = DateTime.SpecifyKind(new DateTime(f.Year, f.Month, f.Day, 0, 0, 0, DateTimeKind.Utc), DateTimeKind.Utc);
            var endUtc = DateTime.SpecifyKind(new DateTime(t.Year, t.Month, t.Day, 23, 59, 59, 999, DateTimeKind.Utc), DateTimeKind.Utc);
            return (startUtc, endUtc);
        }
        
        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueStats([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            try
            {
                var (startDate, endDate) = GetDateRange(from, to);
                int totalOrders = await _context.HoaDons
                    .Where(h => h.ThoiGianRa >= startDate && h.ThoiGianRa <= endDate)
                    .CountAsync();
                var billsInRange = await _context.HoaDons
                    .Where(h => h.ThoiGianRa >= startDate && h.ThoiGianRa <= endDate)
                    .Select(h => new
                    {
                        h.ThoiGianRa,
                        DoanhThuDon = h.ChiTietHoaDons.Sum(ct => (decimal?)ct.SoLuong * ct.DonGia) ?? 0m
                    })
                    .ToListAsync();
                decimal totalRevenue = billsInRange.Sum(b => b.DoanhThuDon);
                var weeklyDict = new Dictionary<DayOfWeek, decimal>
                {
                    { DayOfWeek.Monday, 0m },
                    { DayOfWeek.Tuesday, 0m },
                    { DayOfWeek.Wednesday, 0m },
                    { DayOfWeek.Thursday, 0m },
                    { DayOfWeek.Friday, 0m },
                    { DayOfWeek.Saturday, 0m },
                    { DayOfWeek.Sunday, 0m }
                };
                foreach (var bill in billsInRange)
                {
                    var day = bill.ThoiGianRa.DayOfWeek;
                    if (weeklyDict.ContainsKey(day))
                    {
                        weeklyDict[day] += bill.DoanhThuDon;
                    }
                }
                var dayNameMapping = new Dictionary<DayOfWeek, string>
                {
                    { DayOfWeek.Monday, "Thứ 2" },
                    { DayOfWeek.Tuesday, "Thứ 3" },
                    { DayOfWeek.Wednesday, "Thứ 4" },
                    { DayOfWeek.Thursday, "Thứ 5" },
                    { DayOfWeek.Friday, "Thứ 6" },
                    { DayOfWeek.Saturday, "Thứ 7" },
                    { DayOfWeek.Sunday, "Chủ nhật" }
                };
                decimal maxWeekVal = weeklyDict.Values.DefaultIfEmpty(1m).Max();
                if (maxWeekVal <= 0) maxWeekVal = 1m;
                var todayDayOfWeek = DateTime.Today.DayOfWeek;
                var weeklyData = new List<object>();
                foreach (var kv in weeklyDict)
                {
                    int percentVal = (int)((kv.Value / maxWeekVal) * 100);
                    if (percentVal < 15) percentVal = 15;
                    string formattedLabel = kv.Value >= 1000000
                        ? $"{kv.Value / 1000000m:0.#}M"
                        : $"{kv.Value:N0}đ";
                    weeklyData.Add(new
                    {
                        day = dayNameMapping[kv.Key],
                        val = percentVal,
                        label = formattedLabel,
                        active = kv.Key == todayDayOfWeek
                    });
                }
                return Ok(new
                {
                    tongDoanhThu = totalRevenue,
                    soDonHang = totalOrders,
                    doanhThuTuan = weeklyData
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Revenue Error]: {ex.Message}");
                return StatusCode(500, new { message = ex.Message, detail = ex.InnerException?.Message });
            }
        }
        
        [HttpGet("top-dishes")]
        public async Task<IActionResult> GetTopDishes([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            try
            {
                var (startDate, endDate) = GetDateRange(from, to);
                var rawItems = await _context.ChiTietHoaDons
                    .Where(ct => ct.MaHoaDonNavigation != null 
                              && ct.MaHoaDonNavigation.ThoiGianRa >= startDate 
                              && ct.MaHoaDonNavigation.ThoiGianRa <= endDate)
                    .Select(ct => new
                    {
                        ct.MaMon,
                        TenMon = ct.MaMonNavigation != null ? ct.MaMonNavigation.TenMon : "Món " + ct.MaMon,
                        DangKinhDoanh = ct.MaMonNavigation != null && ct.MaMonNavigation.DangKinhDoanh,
                        ct.SoLuong,
                        ct.DonGia
                    })
                    .ToListAsync();
                var topDishes = new List<object>();
                if (rawItems.Any())
                {
                    var grouped = rawItems
                        .GroupBy(x => new { x.MaMon, x.TenMon, x.DangKinhDoanh })
                        .Select(g => new
                        {
                            g.Key.TenMon,
                            g.Key.DangKinhDoanh,
                            TongSoLuong = g.Sum(x => x.SoLuong),
                            TongTien = g.Sum(x => (decimal)x.SoLuong * x.DonGia)
                        })
                        .OrderByDescending(x => x.TongTien)
                        .Take(5)
                        .ToList();
                    int stt = 1;
                    foreach (var item in grouped)
                    {
                        string revString = item.TongTien >= 1000000
                            ? $"{item.TongTien / 1000000m:0.##}M"
                            : $"{item.TongTien:N0}đ";
                        topDishes.Add(new
                        {
                            id = stt < 10 ? $"0{stt}" : stt.ToString(),
                            name = item.TenMon,
                            qty = item.TongSoLuong.ToString("N0"),
                            revenue = revString,
                            status = item.DangKinhDoanh ? "Còn món" : "Ngừng bán",
                            dangKinhDoanh = item.DangKinhDoanh
                        });
                        stt++;
                    }
                }
                if (topDishes.Count == 0 && _context.MonAns != null)
                {
                    var fallbackDishes = await _context.MonAns.Take(5).ToListAsync();
                    int stt = 1;
                    foreach (var m in fallbackDishes)
                    {
                        topDishes.Add(new
                        {
                            id = stt < 10 ? $"0{stt}" : stt.ToString(),
                            name = m.TenMon,
                            qty = "0",
                            revenue = "0đ",
                            status = m.DangKinhDoanh ? "Còn món" : "Ngừng bán",
                            dangKinhDoanh = m.DangKinhDoanh
                        });
                        stt++;
                    }
                }
                return Ok(topDishes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TopDishes Error]: {ex.Message}");
                return StatusCode(500, new { message = ex.Message, detail = ex.InnerException?.Message });
            }
        }
        
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var revResult = await GetRevenueStats(null, null) as OkObjectResult;
            var topResult = await GetTopDishes(null, null) as OkObjectResult;
            dynamic revData = revResult?.Value;
            var topDishes = topResult?.Value;
            return Ok(new
            {
                tongDoanhThu = revData?.tongDoanhThu ?? 0,
                soDonHang = revData?.soDonHang ?? 0,
                doanhThuTuan = revData?.doanhThuTuan ?? new List<object>(),
                topMonAn = topDishes
            });
        }
    }
}