using System;
using System.Collections.Generic;
using System.Linq;

namespace QLNH_Backend.Models;

public class HoaDon
{
    public int MaHoaDon { get; set; }
    public int MaNv { get; set; }
    public int? MaKh { get; set; }
    public DateTime ThoiGianVao { get; set; }
    public DateTime ThoiGianRa { get; set; }
    public decimal TienKhachDua { get; set; }
    public decimal TienThua { get; set; }
    public string PhuongThucTt { get; set; } = "Tiền mặt";
    public decimal GiamGia { get; set; }
    public decimal Vat { get; set; }
    public decimal TongTienMon => ChiTietHoaDons.Sum(ct => ct.SoLuong * ct.DonGia);
    public decimal TongThanhToan => TongTienMon + Vat - GiamGia;
    
    public virtual ICollection<ChiTietHoaDon> ChiTietHoaDons { get; set; } = new List<ChiTietHoaDon>();
    public virtual NhanVien? MaNvNavigation { get; set; }
    public virtual ICollection<PhieuGoi> PhieuGois { get; set; } = new List<PhieuGoi>();
    public virtual KhachHang? MaKhNavigation { get; set; }
    public virtual ICollection<HoaDonBan> HoaDonBans { get; set; } = new List<HoaDonBan>();
}