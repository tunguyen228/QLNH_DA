using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using QLNH_Backend.BLL;
using QLNH_Backend.DTO;
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
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Dữ liệu gửi lên không hợp lệ." });
            }
            try
            {
                var result = await _checkoutService.ProcessCheckoutAsync(request);
                if (result.Success)
                {
                    await _hubContext.Clients.All.SendAsync("ThanhToanThanhCong", request.MaBan);
                    return Ok(result);
                }
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("thungan/{id}")]
        public async Task<IActionResult> GetCashierInfo(int id)
        {
            try
            {
                var cashier = await _checkoutService.GetCashierByIdAsync(id);
                if (cashier == null) 
                    return NotFound(new { message = "Không tìm thấy thu ngân" });
                return Ok(cashier);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}