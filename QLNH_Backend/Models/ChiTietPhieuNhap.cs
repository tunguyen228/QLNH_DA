using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class ChiTietPhieuNhap
{
    public int MaPhieuNhap { get; set; } 
    public int MaNguyenLieu { get; set; } 
    public decimal DonGia { get; set; }
    public int SoLuongNhap { get; set; } 
    
    public virtual PhieuNhap? MaPhieuNhapNavigation { get; set; }
    public virtual NguyenLieu? MaNguyenLieuNavigation { get; set; }
}