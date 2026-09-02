using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using QLNH_Backend.DAL;
using QLNH_Backend.DTO;

namespace QLNH_Backend.BLL
{
    public class AuthService : IAuthService
    {
        private readonly UserDAL _userDal;
        private readonly string _secretKey = "Day_La_Chuoi_Khoa_Bao_Mat_Du_Dai_Cho_JWT_Token_QLNH"; 

        public AuthService(UserDAL userDal)
        {
            _userDal = userDal;
        }

        public LoginResponseDTO Login(LoginRequestDTO request)
        {
            var user = _userDal.GetUserByCredentials(request.Username, request.Password);
            
            // ĐÃ SỬA: Thay vì return null, hãy trả về DTO với IsSuccess = false
            if (user == null) 
            {
                return new LoginResponseDTO
                {
                    IsSuccess = false,
                    Message = "Tên đăng nhập hoặc mật khẩu không chính xác."
                };
            }
            
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] 
                {
                    new Claim(ClaimTypes.Name, user.TenDangNhap),
                    new Claim(ClaimTypes.Role, user.VaiTro)
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new LoginResponseDTO
            {
                IsSuccess = true,
                Message = "Đăng nhập thành công",
                Token = tokenHandler.WriteToken(token),
                HoTen = user.HoTen,   
                Role = user.VaiTro,
                MaNv = user.MaNv
            };
        }
    }
}