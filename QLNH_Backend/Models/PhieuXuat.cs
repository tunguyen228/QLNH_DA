using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class PhieuXuat
{
    public int MaPhieuXuat { get; set; } 
    public int MaNv { get; set; }
    public DateTime NgayXuat { get; set; }
    
    public virtual ICollection<ChiTietPhieuXuat> ChiTietPhieuXuats { get; set; } = new List<ChiTietPhieuXuat>();
    public virtual NhanVien? MaNvNavigation { get; set; }
}