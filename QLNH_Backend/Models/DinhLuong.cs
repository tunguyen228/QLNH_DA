using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class DinhLuong
{
    public int MaMon { get; set; }
    public int MaNguyenLieu { get; set; }
    public double SoLuongDung { get; set; }
    
    public virtual MonAn? MaMonNavigation { get; set; }
    public virtual NguyenLieu? MaNguyenLieuNavigation { get; set; }
}