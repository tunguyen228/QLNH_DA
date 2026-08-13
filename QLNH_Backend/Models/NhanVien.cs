using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class NhanVien
{
    public int MaNv { get; set; }
    public string TenDangNhap { get; set; } = null!;
    public string MatKhau { get; set; } = null!;
    public string HoTen { get; set; } = null!;
    public string VaiTro { get; set; } = null!;
    public DateTime? NgayTao { get; set; }
    public string? Avatar { get; set; }
    public string TrangThaiHoatDong { get; set; } = "Làm việc";
    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();
    public virtual ICollection<PhieuXuat>  PhieuXuats { get; set; } = new List<PhieuXuat>();
    public virtual ICollection<PhieuNhap>  PhieuNhaps { get; set; } = new List<PhieuNhap>();
    public virtual ICollection<PhieuGoi>  PhieuGois { get; set; } = new List<PhieuGoi>();
}