namespace QLNH_Backend.DTO;

public class TransactionDTO
{
    public string Id { get; set; }
    public string InvoiceId { get; set; }
    public string Time { get; set; } // Ví dụ: "14:20 - 24/10/2023"
    public string TableName { get; set; }
    public string Area { get; set; }
    public string Cashier { get; set; }
    public string PaymentMethod { get; set; } // "Cash", "Transfer", "Card", "None"
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } // "Paid", "Cancelled"
}