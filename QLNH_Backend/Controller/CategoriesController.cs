using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using QLNH_Backend.DTO;
using QLNH_Backend.BLL;
using QLNH_Backend.DAL;

namespace QLNH_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Tiêm DbContext vào Controller
        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                // Lấy dữ liệu từ bảng NhomMon
                // Chỉ Select ra MaNhom và TenNhom để tối ưu dữ liệu trả về
                var categories = await _context.NhomMons
                    .Select(n => new 
                    {
                        MaNhom = n.MaNhom,
                        TenNhom = n.TenNhom
                    })
                    .ToListAsync();

                // Kiểm tra nếu danh sách trống
                if (categories == null || categories.Count == 0)
                {
                    return NotFound("Không tìm thấy nhóm món nào.");
                }

                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                // Xử lý lỗi và trả về HTTP 500
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}