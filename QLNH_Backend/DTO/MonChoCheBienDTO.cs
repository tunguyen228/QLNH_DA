using System;

namespace QLNH_Backend.DTO
{
    public class MonChoCheBienDTO
    {
        public int MaPhieu { get; set; }  
        public int MaMon { get; set; }    
        public string TenBan { get; set; }
        public string TenMon { get; set; }
        public int SoLuong { get; set; }
        public string? GhiChu { get; set; }
        public DateTime? ThoiGianGoi { get; set; } 
        public string? TrangThai { get; set; } 
    }
    
    public class UpdateTrangThaiMonDTO
    {
        public string TrangThaiMoi { get; set; }
    }
}