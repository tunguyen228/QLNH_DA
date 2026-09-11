using System;
using System.ComponentModel.DataAnnotations;

namespace QLNH_Backend.DTO
{
    public class MonAnDTO
    {
        public int MaMon { get; set; }
        public string TenMon { get; set; } = string.Empty;
        public string DonVi { get; set; } = string.Empty;
        public decimal GiaTien { get; set; }
        public string HinhAnh { get; set; }
        public bool DangKinhDoanh { get; set; }
        public bool TamHet { get; set; }
    
        public int MaNhom { get; set; }
        public string TenNhom { get; set; } = string.Empty;
    }

    public class MonAnRequestDTO
    {
        [Required] public string TenMon { get; set; }
        [Required] public int MaNhom { get; set; }
        [Range(0, double.MaxValue)] public decimal GiaTien { get; set; }
        public string HinhAnh { get; set; }
        public string MoTa { get; set; }
        public bool DangKinhDoanh { get; set; } = true;
    }
}

