using System;
using System.ComponentModel.DataAnnotations;

namespace QLNH_Backend.DTO
{
    public class NhanVienDTO
    {
        public int MaNV { get; set; }
        public string HoTen { get; set; }
        public string VaiTro { get; set; } 
        public string TrangThaiHoatDong { get; set; } // "Đang làm" | "Nghỉ việc"
    }

    public class NhanVienRequestDTO
    {
        [Required(ErrorMessage = "Tên đăng nhập không được để trống")]
        public string TenDangNhap { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string MatKhau { get; set; }

        [Required(ErrorMessage = "Họ tên không được để trống")]
        public string HoTen { get; set; }

        [Required(ErrorMessage = "Vai trò không được để trống")]
        public string VaiTro { get; set; }

        public string TrangThaiHoatDong { get; set; } = "Làm việc";
    }
}