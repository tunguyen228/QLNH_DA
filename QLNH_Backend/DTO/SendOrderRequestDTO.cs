using System.ComponentModel.DataAnnotations;

namespace QLNH_Backend.DTO
{
    public class SendOrderRequestDTO
    {
        public int TableId { get; set; }
        public int MaNv { get; set; }
        public List<OrderItemDTO> Items { get; set; }
    }

    public class OrderItemDTO
    {
        public int MonAnId { get; set; }
        public int SoLuong { get; set; }
        [MaxLength(255, ErrorMessage = "Độ dài ghi chú không được vượt quá 255 ký tự")]
        public string GhiChu { get; set; }
    }
    
    public class QRClientOrderRequestDTO
    {
        public int MaBan { get; set; }
        public List<QRClientOrderItemDTO> Items { get; set; }
    }

    public class QRClientOrderItemDTO
    {
        public int MaMon { get; set; }
        public int SoLuong { get; set; }
        [MaxLength(255, ErrorMessage = "Độ dài ghi chú không được vượt quá 255 ký tự")]
        public string GhiChu { get; set; }
    }
}