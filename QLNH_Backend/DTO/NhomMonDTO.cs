using System;
using System.ComponentModel.DataAnnotations;

namespace QLNH_Backend.DTO
{
    public class NhomMonDTO
    {
        public int MaNhom { get; set; } 
        public string TenNhom { get; set; } = string.Empty;
    }

    public class NhomMonRequestDTO
    {
        [Required] public string TenNhom { get; set; }
    }
}

