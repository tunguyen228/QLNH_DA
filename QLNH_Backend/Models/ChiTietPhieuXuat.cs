using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class ChiTietPhieuXuat
{
    public int MaPhieuXuat { get; set; } 
    public int MaNguyenLieu { get; set; } 
    public int SoLuongXuat { get; set; } 
    
    public virtual PhieuXuat? MaPhieuXuatNavigation { get; set; }
    public virtual NguyenLieu? MaNguyenLieuNavigation { get; set; }
}