namespace QLNH_Backend.Models;

public class MonAnDTO
{
    public int MaMon { get; set; }
    public string TenMon { get; set; } = string.Empty;
    public string DonVi { get; set; } = string.Empty;
    public decimal GiaTien { get; set; }
    public string? HinhAnh { get; set; }
        
    public string TenNhom { get; set; } = string.Empty;
}