using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class BanAn
{
    public int MaBan { get; set; }
    public string TrangThai { get; set; } = "Trống";
    public int Tang { get; set; }
    public int SoGhe { get; set; }
    
    public virtual ICollection<PhieuGoi> PhieuGois { get; set; } = new List<PhieuGoi>();
    public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();
    public virtual ICollection<HoaDonBan> HoaDonBans { get; set; } = new List<HoaDonBan>();
}