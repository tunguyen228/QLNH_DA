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
        var response = _authService.Login(request);

        if (response.IsSuccess)
        {
            return Ok(response); 
        }

        return Unauthorized(response);
    }
}