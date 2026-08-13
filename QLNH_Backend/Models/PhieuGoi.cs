using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class PhieuGoi
{
    public int MaPhieu { get; set; }
    public int MaBan { get; set; }
    public int MaNv { get; set; }
    public int MaHoaDon { get; set; }
    public DateTime? ThoiGianTao { get; set; }

    public virtual ICollection<ChiTietPhieuGoi> ChiTietPhieuGois { get; set; } = new List<ChiTietPhieuGoi>();
    public virtual HoaDon? MaHoaDonNavigation { get; set; }
    public virtual NhanVien? MaNvNavigation { get; set; }
    public virtual BanAn? MaBanNavigation { get; set; }
}