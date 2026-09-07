using Microsoft.AspNetCore.Mvc;
using QLNH_Backend.BLL;
using QLNH_Backend.DTO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using QLNH_Backend.Hubs;

namespace QLNH_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class KitchenController : ControllerBase
    {
        private readonly IBepService _bepService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public KitchenController(IBepService bepService, IHubContext<NotificationHub> hubContext)
        {
            _bepService = bepService;
            _hubContext = hubContext;
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] string status)
        {
            try
            {
                if (status == "pending") 
                {
                    var pendingOrders = await _bepService.GetDanhSachMonChoCheBienAsync();
                    return Ok(pendingOrders);
                }
                else if (status == "cooking") 
                {
                    var cookingOrders = await _bepService.GetDanhSachMonDangCheBienAsync();
                    return Ok(cookingOrders);
                }

                return BadRequest(new { message = "Trạng thái không hợp lệ." });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("mon-cho-che-bien")]
        public async Task<IActionResult> GetDanhSachMon()
        {
            var danhSach = await _bepService.GetDanhSachMonChoCheBienAsync();
            return Ok(danhSach);
        }

        [HttpPut("CapNhatTrangThai")]
        public async Task<IActionResult> CapNhatTrangThaiMon([FromBody] UpdateStatusRequest request)
        {
            var result = await _bepService.CapNhatTrangThaiMonAsync(request.PhieuGoiId, request.MonAnId, request.TrangThai);
            if (result)
            {
                await _hubContext.Clients.All.SendAsync("CapNhatTrangThaiMon");
                return Ok(new { message = "Cập nhật thành công!" });
            }
            return BadRequest("Không tìm thấy món ăn trong phiếu này.");
        }
        public class UpdateStatusRequest
        {
            public int PhieuGoiId { get; set; }
            public int MonAnId { get; set; }
            public string TrangThai { get; set; }
        }
        [HttpGet("staff")]
        public async Task<IActionResult> GetKitchenStaff()
        {
            try
            {
                // Gọi hàm từ tầng BLL (Service)
                var staffList = await _bepService.GetKitchenStaffAsync();
                return Ok(staffList);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}