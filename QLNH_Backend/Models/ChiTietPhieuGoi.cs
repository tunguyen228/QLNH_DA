using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class ChiTietPhieuGoi
{
    public int MaPhieu { get; set; }
    public int MaMon { get; set; }
    public int SoLuong { get; set; }
    public string? GhiChu { get; set; }
    public string? TrangThai { get; set; }

    public virtual MonAn? MaMonNavigation { get; set; }
    public virtual PhieuGoi? MaPhieuNavigation { get; set; }
}