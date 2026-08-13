using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class NguyenLieu
{
    public int MaNguyenLieu { get; set; } 
    public string TenNguyenLieu { get; set; }
    public string? DonViTinh { get; set; } 
    public decimal DonGia { get; set; } 
    public double SoLuongTon { get; set; } 
    
    public virtual ICollection<ChiTietPhieuNhap> ChiTietPhieuNhaps { get; set; } = new List<ChiTietPhieuNhap>();
    public virtual ICollection<ChiTietPhieuXuat> ChiTietPhieuXuats { get; set; } = new List<ChiTietPhieuXuat>();
    public virtual ICollection<DinhLuong> DinhLuongs { get; set; } = new List<DinhLuong>();
}