using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using QLNH_Backend.DAL; // Import AppDbContext từ DAL

namespace QLNH_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Tiêm DbContext vào để gọi Database
        public InvoiceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("next-invoice-code")]
        public async Task<IActionResult> GetNextInvoiceCode()
        {
            // Lấy Mã Hóa Đơn lớn nhất hiện tại, nếu chưa có thì gán là 0
            var maxId = await _context.HoaDons.MaxAsync(h => (int?)h.MaHoaDon) ?? 0;
            
            // Tăng lên 1 cho hóa đơn tiếp theo
            var nextId = maxId + 1;

            // Format thành chuỗi (Ví dụ: INV-00001, INV-00002)
            var formattedCode = $"INV-{nextId:D5}";

            return Ok(new 
            { 
                nextId = nextId,
                invoiceCode = formattedCode 
            });
        }
    }
}