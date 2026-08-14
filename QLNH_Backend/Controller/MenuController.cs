using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DTO;
using QLNH_Backend.DAL;
using QLNH_Backend.Models; 

namespace QLNH_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MenuController(AppDbContext context)
        {
            _context = context; 
        }

        [HttpGet]
        public async Task<IActionResult> MonAns()
        {
            // Truy vấn và map thẳng sang DTO
            var monAns = await _context.MonAns
                .Where(m => m.DangKinhDoanh == true)
                .Select(m => new MonAnDTO
                {
                    MaMon = m.MaMon,
                    TenMon = m.TenMon,
                    DonVi = m.DonVi,
                    GiaTien = m.GiaTien,
                    HinhAnh = m.HinhAnh,
                    // Lấy Tên Nhóm từ Navigation property. 
                    // EF Core tự động xử lý JOIN SQL ở đoạn này.
                    TenNhom = m.MaNhomNavigation != null ? m.MaNhomNavigation.TenNhom : "Chưa phân loại"
                })
                .ToListAsync();

            return Ok(monAns);
        }
    }
}