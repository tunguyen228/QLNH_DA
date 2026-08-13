using System;
using System.Collections.Generic;

namespace QLNH_Backend.Models;

public class ThongBao
{
    public int MaTb { get; set; }
    public int MaBan { get; set; }
    public string NoiDung { get; set; } = null!;
    public bool? DaXem { get; set; }
    public DateTime? ThoiGian { get; set; }
    
    public virtual BanAn? MaBanNavigation { get; set; }
}