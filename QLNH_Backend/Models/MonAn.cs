using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class MonAn
{
    public int MaMon { get; set; }
    public int MaNhom { get; set; }
    public string TenMon { get; set; } = string.Empty;
    public string DonVi { get; set; } = string.Empty;
    public decimal GiaTien { get; set; }
    public string? HinhAnh { get; set; }
    public bool DangKinhDoanh { get; set; }

    public virtual ICollection<ChiTietHoaDon> ChiTietHoaDons { get; set; } = new List<ChiTietHoaDon>();
    public virtual ICollection<ChiTietPhieuGoi> ChiTietPhieuGois { get; set; } = new List<ChiTietPhieuGoi>();
    public virtual NhomMon? MaNhomNavigation { get; set; }
    public virtual ICollection<DinhLuong> DinhLuongs { get; set; } = new List<DinhLuong>();
}