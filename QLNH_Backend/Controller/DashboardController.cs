using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DAL;

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

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                // 1. Tổng số đơn hàng từ bảng HoaDon
                int totalOrders = 0;
                if (_context.HoaDons != null)
                {
                    totalOrders = await _context.HoaDons.CountAsync();
                }

                // 2. Tính tổng doanh thu từ ChiTietHoaDon join MonAn (SoLuong * GiaTien)
                decimal totalRevenue = 0;
                if (_context.ChiTietHoaDons != null && _context.MonAns != null)
                {
                    totalRevenue = await _context.ChiTietHoaDons
                        .Join(_context.MonAns,
                              ct => ct.MaMon,
                              m => m.MaMon,
                              (ct, m) => ct.SoLuong * m.GiaTien)
                        .SumAsync();
                }

                // 3. Doanh thu theo tuần
                var weeklyDict = new Dictionary<string, decimal>
                {
                    { "Thứ 2", 0 }, { "Thứ 3", 0 }, { "Thứ 4", 0 }, 
                    { "Thứ 5", 0 }, { "Thứ 6", 0 }, { "Thứ 7", 0 }, { "Chủ nhật", 0 }
                };

                var weeklyData = new List<object>();
                decimal maxWeekVal = weeklyDict.Values.DefaultIfEmpty(1m).Max();
                if (maxWeekVal == 0) maxWeekVal = 1m;

                foreach (var kv in weeklyDict)
                {
                    int percentVal = (int)((kv.Value / maxWeekVal) * 100);
                    if (percentVal < 15) percentVal = 15;

                    string formattedLabel = kv.Value >= 1000000 ? $"{kv.Value / 1000000m:0.#}M" : $"{kv.Value:N0}đ";
                    bool isActive = kv.Key.Equals("Thứ 6", StringComparison.OrdinalIgnoreCase);

                    weeklyData.Add(new
                    {
                        day = kv.Key,
                        val = percentVal,
                        label = formattedLabel,
                        active = isActive
                    });
                }

                // 4. Lấy Top món ăn bán chạy nhất từ Database và đồng bộ trạng thái DangKinhDoanh
                var topDishes = new List<object>();
                
                if (_context.ChiTietHoaDons != null && _context.MonAns != null)
                {
                    var queryTop = await _context.ChiTietHoaDons
                        .Join(_context.MonAns,
                              ct => ct.MaMon,
                              m => m.MaMon,
                              (ct, m) => new { ct.MaMon, ct.SoLuong, m.GiaTien, m.TenMon, m.DonVi, m.DangKinhDoanh })
                        .GroupBy(x => new { x.MaMon, x.TenMon, x.DonVi, x.DangKinhDoanh })
                        .Select(g => new
                        {
                            g.Key.TenMon,
                            g.Key.DonVi,
                            g.Key.DangKinhDoanh,
                            TongSoLuong = g.Sum(x => x.SoLuong),
                            TongTienMon = g.Sum(x => x.SoLuong * x.GiaTien)
                        })
                        .OrderByDescending(x => x.TongSoLuong)
                        .Take(5)
                        .ToListAsync();

                    int stt = 1;
                    foreach (var item in queryTop)
                    {
                        // Hiển thị định dạng tiền thông minh: >= 1 triệu thì hiện chữ M, nhỏ hơn thì hiện đầy đủ số tiền
                        string revString = item.TongTienMon >= 1000000 
                            ? $"{item.TongTienMon / 1000000m:0.##}M" 
                            : $"{item.TongTienMon:N0}đ";

                        topDishes.Add(new
                        {
                            id = stt < 10 ? $"0{stt}" : stt.ToString(),
                            name = item.TenMon,
                            qty = item.TongSoLuong.ToString("N0"),
                            revenue = revString,
                            // Lấy trực tiếp trạng thái kinh doanh từ CSDL (true = Còn món, false = Ngừng bán)
                            status = item.DangKinhDoanh ? "Còn món" : "Ngừng bán",
                            dangKinhDoanh = item.DangKinhDoanh 
                        });
                        stt++;
                    }
                }

                // Nếu chưa có lịch sử giao dịch bán hàng, lấy danh sách thực đơn trực tiếp từ bảng MonAns
                if (topDishes.Count == 0 && _context.MonAns != null)
                {
                    var allMon = await _context.MonAns.Take(5).ToListAsync();
                    int stt = 1;
                    foreach (var m in allMon)
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

                return Ok(new
                {
                    tongDoanhThu = totalRevenue,
                    soDonHang = totalOrders,
                    doanhThuTuan = weeklyData,
                    topMonAn = topDishes
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}