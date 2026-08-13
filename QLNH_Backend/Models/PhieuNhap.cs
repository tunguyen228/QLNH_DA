using System;
using System.Collections.Generic;
using System.Linq;

namespace QLNH_Backend.Models;

public class PhieuNhap
{
    public int MaPhieuNhap { get; set; } 
    public  int MaNv { get; set; }
    public decimal TongTien => ChiTietPhieuNhaps.Sum(ct => ct.SoLuongNhap * ct.DonGia);
    public DateTime NgayNhap { get; set; }
    
    public virtual ICollection<ChiTietPhieuNhap> ChiTietPhieuNhaps { get; set; } = new List<ChiTietPhieuNhap>();
    public virtual NhanVien? MaNvNavigation { get; set; }
}