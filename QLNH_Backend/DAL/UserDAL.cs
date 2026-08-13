using System.Linq;
using QLNH_Backend.Models;
using BCrypt.Net; 

namespace QLNH_Backend.DAL
{
    public class UserDAL
    {
        private readonly AppDbContext _context;

        public UserDAL(AppDbContext context)
        {
            _context = context;
        }

        public NhanVien GetUserByCredentials(string username, string password)
        { 
         var user = _context.NhanViens.FirstOrDefault(nv => nv.TenDangNhap == username);

            if (user == null)
            {
                return null;
            }
           
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.MatKhau);

            if (isPasswordValid)
            {
                return user; 
            }
            return null; 
        }
    }
}