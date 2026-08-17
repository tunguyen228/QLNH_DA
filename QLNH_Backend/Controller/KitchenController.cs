using Microsoft.AspNetCore.Mvc;
using QLNH_Backend.BLL;
using QLNH_Backend.DTO;
using System.Threading.Tasks;

namespace QLNH_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class KitchenController : ControllerBase
    {
        private readonly IBepService _bepService;

        public KitchenController(IBepService bepService)
        {
            _bepService = bepService;
        }

        // GET: api/bep/mon-cho-che-bien
        [HttpGet("mon-cho-che-bien")]
        public async Task<IActionResult> GetDanhSachMon()
        {
            var danhSach = await _bepService.GetDanhSachMonChoCheBienAsync();
            return Ok(danhSach);
        }

        // PUT: api/bep/cap-nhat-trang-thai/5
        // Thay đổi route của hàm PUT để nhận 2 tham số {maPhieu}/{maMon}
        [HttpPut("cap-nhat-trang-thai/{maPhieu}/{maMon}")]
        public async Task<IActionResult> CapNhatTrangThai(int maPhieu, int maMon, [FromBody] UpdateTrangThaiMonDTO request)
        {
            if (string.IsNullOrEmpty(request.TrangThaiMoi))
            {
                return BadRequest(new { message = "Trạng thái không được để trống." });
            }

            // Truyền 2 tham số vào hàm Update
            var result = await _bepService.CapNhatTrangThaiMonAsync(maPhieu, maMon, request.TrangThaiMoi);

            if (!result)
            {
                return NotFound(new { message = "Không tìm thấy món ăn này trong phiếu gọi." });
            }

            return Ok(new { message = "Cập nhật trạng thái thành công." });
        }
    }
}