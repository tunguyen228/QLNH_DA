using Microsoft.AspNetCore.Mvc;
using QLNH_Backend.DTO;
using QLNH_Backend.BLL;

namespace QLNH_Backend.Controller;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestDTO request)
    {
        // 1. Chặn lỗi payload đầu vào từ Frontend
        if (request == null || string.IsNullOrEmpty(request.Username))
        {
            return BadRequest(new { Message = "Vui lòng nhập đầy đủ tên đăng nhập." });
        }

        var response = _authService.Login(request);

        // 2. Chặn lỗi NullReferenceException (Fix cho dòng 23 cũ)
        if (response == null)
        {
            return Unauthorized(new { Message = "Tài khoản không tồn tại hoặc thông tin đăng nhập sai." });
        }

        if (response.IsSuccess)
        {
            return Ok(response); 
        }

        return Unauthorized(response);
    }
}