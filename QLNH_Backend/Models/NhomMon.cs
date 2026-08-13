using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class NhomMon
{
    public int MaNhom { get; set; }
    public string TenNhom { get; set; } = null!;
    
    public virtual ICollection<MonAn> MonAns { get; set; } = new List<MonAn>();
}