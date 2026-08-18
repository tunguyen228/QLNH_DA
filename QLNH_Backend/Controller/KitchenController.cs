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

        // 1. API mới để phục vụ hàm getPendingOrders và getCookingOrders trong kitchenService.js
        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] string status)
        {
            try
            {
                if (status == "pending") // Trạng thái chờ nấu
                {
                    var pendingOrders = await _bepService.GetDanhSachMonChoCheBienAsync();
                    return Ok(pendingOrders);
                }
                else if (status == "cooking") // Trạng thái đang nấu
                {
                    // Tạm thời trả về mảng rỗng (Sau này bạn có thể viết thêm hàm GetDanhSachMonDangNauAsync trong IBepService)
                    return Ok(new object[] { }); 
                }

                return BadRequest(new { message = "Trạng thái không hợp lệ." });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // 2. API cũ (Giữ lại dự phòng nếu bạn có dùng ở chỗ khác)
        [HttpGet("mon-cho-che-bien")]
        public async Task<IActionResult> GetDanhSachMon()
        {
            var danhSach = await _bepService.GetDanhSachMonChoCheBienAsync();
            return Ok(danhSach);
        }

        // 3. PUT: api/kitchen/cap-nhat-trang-thai/{maPhieu}/{maMon}
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