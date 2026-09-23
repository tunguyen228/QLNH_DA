using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using QLNH_Backend.DAL;
using QLNH_Backend.DTO;

namespace QLNH_Backend.BLL
{
    public class AuthService : IAuthService
    {
        private readonly UserDAL _userDal;
        private readonly IConfiguration _configuration;

        public AuthService(
            UserDAL userDal,
            IConfiguration configuration)
        {
            _userDal = userDal;
            _configuration = configuration;
        }

        public LoginResponseDTO Login(LoginRequestDTO request)
        {
            var user = _userDal.GetUserByCredentials(
                request.Username,
                request.Password
            );

            if (user == null)
            {
                return new LoginResponseDTO
                {
                    IsSuccess = false,
                    Message = "Tên đăng nhập hoặc mật khẩu không chính xác."
                };
            }

            var tokenHandler = new JwtSecurityTokenHandler();

            var secretKey = _configuration["Jwt:Key"];
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];

            var key = Encoding.UTF8.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.TenDangNhap),
                    new Claim(ClaimTypes.Role, user.VaiTro)
                }),

                Issuer = issuer,
                Audience = audience,

                Expires = DateTime.UtcNow.AddMinutes(
                    _configuration.GetValue<int>("Jwt:ExpireMinutes")
                ),

                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
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