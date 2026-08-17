using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DTO;
using QLNH_Backend.DAL;
using QLNH_Backend.BLL;
using QLNH_Backend.Models; 

namespace QLNH_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly AppDbContext _context;
		private readonly IBepService _bepService;
        public MenuController(AppDbContext context, IBepService bepService)
        {
            _context = context; 
			_bepService = bepService;
        }

        [HttpGet]
        public async Task<IActionResult> MonAns()
        {
            var monAns = await _context.MonAns
                .Where(m => m.DangKinhDoanh == true)
                .Select(m => new MonAnDTO
                {
                    MaMon = m.MaMon,
                    TenMon = m.TenMon,
                    DonVi = m.DonVi,
                    GiaTien = m.GiaTien,
                    HinhAnh = m.HinhAnh,
                    DangKinhDoanh = m.DangKinhDoanh,
                    MaNhom = m.MaNhom,
                    TenNhom = m.MaNhomNavigation != null ? m.MaNhomNavigation.TenNhom : "Chưa phân loại"
                })
                .ToListAsync();

            return Ok(monAns);
        }

		[HttpPost("SendOrder")]
        public async Task<IActionResult> SendOrder([FromBody] SendOrderRequestDTO request)
        {
            try
            {
                if (request == null || request.Items == null || request.Items.Count == 0)
                    return BadRequest("Dữ liệu order không hợp lệ.");

                var result = await _bepService.GuiOrderXuongBep(request);
                
                if (result)
                    return Ok(new { message = "Đã gửi order xuống bếp thành công" });
                    
                return StatusCode(500, "Lỗi hệ thống khi gửi order.");
            }
            catch (System.Exception ex)
            {
                // TODO: Log lỗi thực tế
                return StatusCode(500, ex.Message);
            }
        }
    }
}