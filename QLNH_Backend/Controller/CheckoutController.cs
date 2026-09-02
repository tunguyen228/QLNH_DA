using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using QLNH_Backend.BLL;
using QLNH_Backend.DTO;

namespace QLNH_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly ICheckoutService _checkoutService;

        public CheckoutController(ICheckoutService checkoutService)
        {
            _checkoutService = checkoutService;
        }

        [HttpPost]
        public async Task<IActionResult> ProcessCheckout([FromBody] CheckoutRequestDTO request)
        {
            var result = await _checkoutService.ProcessCheckoutAsync(request);
            
            if (result.Success)
            {
                return Ok(result); // Trả về HTTP 200 kèm DTO
            }
            
            return BadRequest(result); // Trả về HTTP 400 kèm câu thông báo lỗi
        }
    }
}