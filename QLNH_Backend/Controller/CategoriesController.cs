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
        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _context.NhomMons
                    .Select(n => new 
                    {
                        MaNhom = n.MaNhom,
                        TenNhom = n.TenNhom
                    })
                    .ToListAsync();

                if (categories == null || categories.Count == 0)
                {
                    return NotFound("Không tìm thấy nhóm món nào.");
                }

                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}