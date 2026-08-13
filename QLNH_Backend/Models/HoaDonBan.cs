using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class HoaDonBan
{
    public int MaHoaDon { get; set; }
    public int MaBan { get; set; }
    
    public virtual HoaDon? MaHoaDonNavigation { get; set; }
    public virtual BanAn? MaBanNavigation { get; set; }
}