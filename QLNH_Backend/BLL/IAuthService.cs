using QLNH_Backend.DTO;
namespace QLNH_Backend.BLL;

public interface IAuthService
{
    LoginResponseDTO Login(LoginRequestDTO request);
}