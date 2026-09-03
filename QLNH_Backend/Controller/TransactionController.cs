using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DTO; 
using QLNH_Backend.DAL; // Thêm dòng này để gọi được ApplicationDbContext

namespace QLNH_Backend.Controllers
{
    // Đã xóa class dư thừa bao bọc bên ngoài
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Tiêm (Inject) DbContext vào Controller
        public TransactionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetTransactionHistory()
        {
            // Lấy toàn bộ dữ liệu từ bảng Transactions trong Database (Bất đồng bộ)
            var transactions = await _context.Transactions.ToListAsync();

            if (transactions == null || !transactions.Any())
            {
                return NotFound(new { message = "Không có dữ liệu giao dịch nào." });
            }

            return Ok(transactions);
        }
    }
}