namespace QLNH_Backend.DTO
{
    public class CheckoutRequestDTO
    {
        public int MaBan { get; set; }
        public string? SoDienThoai { get; set; }
        public string? MaKhuyenMai { get; set; }
        public string PhuongThucTt { get; set; } // "CASH", "QR", "CARD"
    }

// DTO/CheckoutResponseDTO.cs
    public class CheckoutResponseDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public decimal FinalTotal { get; set; }
        public int EarnedPoints { get; set; }
    }
}

