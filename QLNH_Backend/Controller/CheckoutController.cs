using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using QLNH_Backend.BLL;
using QLNH_Backend.DTO;
using Microsoft.AspNetCore.SignalR;
using QLNH_Backend.Hubs;

namespace QLNH_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly ICheckoutService _checkoutService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public CheckoutController(ICheckoutService checkoutService, IHubContext<NotificationHub> hubContext)
        {
            _checkoutService = checkoutService;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> ProcessCheckout([FromBody] CheckoutRequestDTO request)
        {
            var result = await _checkoutService.ProcessCheckoutAsync(request);
            
            if (result.Success)
            {
                await _hubContext.Clients.All.SendAsync("ThanhToanThanhCong");
                return Ok(result); // Trả về HTTP 200 kèm DTO
            }
            
            return BadRequest(result); // Trả về HTTP 400 kèm câu thông báo lỗi
        }
        [HttpGet("thungan/{id}")]
        public async Task<IActionResult> GetCashierInfo(int id)
        {
            try
            {
                var cashier = await _checkoutService.GetCashierByIdAsync(id);
                if (cashier == null) return NotFound(new { message = "Không tìm thấy thu ngân" });
        
                return Ok(cashier);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}