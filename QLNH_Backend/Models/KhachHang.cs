using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class KhachHang
{
    public int? MaKh { get; set; }
    public string? TenKhachHang { get; set; }
    public int DiemTichLuy { get; set; }

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>(); 
}