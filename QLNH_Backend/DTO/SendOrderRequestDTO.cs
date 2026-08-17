namespace QLNH_Backend.DTO
{
    public class SendOrderRequestDTO
    {
        public int TableId { get; set; }
        public List<OrderItemDTO> Items { get; set; }
    }

    public class OrderItemDTO
    {
        public int MonAnId { get; set; }
        public int SoLuong { get; set; }
        public string GhiChu { get; set; }
    }
}