using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using QLNH_Backend.DAL;

namespace QLNH_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly AppDbContext _context;
        public InvoiceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("next-invoice-code")]
        public async Task<IActionResult> GetNextInvoiceCode()
        {
            var maxId = await _context.HoaDons.MaxAsync(h => (int?)h.MaHoaDon) ?? 0;
            var nextId = maxId + 1;
            var formattedCode = $"INV-{nextId:D5}";
            return Ok(new 
            { 
                nextId = nextId,
                invoiceCode = formattedCode 
            });
        }
    }
}