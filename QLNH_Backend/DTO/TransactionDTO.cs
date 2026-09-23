namespace QLNH_Backend.DTO;

public class TransactionDTO
{
    public string Id { get; set; }
    public string InvoiceId { get; set; }
    public string Time { get; set; } 
    public string TableName { get; set; }
    public string Area { get; set; }
    public string Cashier { get; set; }
    public string PaymentMethod { get; set; } 
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } 
}