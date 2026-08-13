using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class ChiTietHoaDon
{
    public int MaMon { get; set; }
    public int MaHoaDon { get; set; }
    public int SoLuong { get; set; }
    public decimal DonGia { get; set; }
    public DateTime? ThoiGianGoi { get; set; }
    
    public virtual HoaDon? MaHoaDonNavigation { get; set; }
    public virtual MonAn? MaMonNavigation { get; set; }
}