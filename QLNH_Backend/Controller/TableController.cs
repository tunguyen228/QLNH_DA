using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DTO;
using QLNH_Backend.DAL;

namespace QLNH_Backend.Controllers
{
    [ApiController]
    [Route("api/waiter/[controller]")]
    public class TableController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TableController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("map")]
        public async Task<ActionResult<TableMapResponse>> GetTableMap()
        {
            var banAnsFromDb = await _context.BanAns
                .OrderBy(b => b.MaBan)
                .ToListAsync();

            var response = new TableMapResponse();
            response.Areas = new List<AreaDTO>();

            int total = 0, inUse = 0, available = 0;

            var tableDtos = banAnsFromDb.Select(b =>
            {
                total++;
                TableStatus mappedStatus = TableStatus.Empty;

                if (b.TrangThai == "Đang sử dụng" || b.TrangThai == "Có khách") 
                {
                    mappedStatus = TableStatus.InUse;
                    inUse++;
                }
                else 
                {
                    available++;
                }

                return new TableDTO
                {
                    Id = b.MaBan,
                    Status = mappedStatus,
                    Capacity = b.SoGhe,
                    Floor = b.Tang
                };
            }).ToList();

            var defaultArea = new AreaDTO
            {
                Id = 1,
                Name = "Khu vực chung",
                Tables = tableDtos
            };

            response.Areas.Add(defaultArea);
            response.TotalTables = total;
            response.InUseTables = inUse;
            response.AvailableTables = available;

            return Ok(response);
        }
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveTables()
        {
            var tables = await _context.BanAns
                .Where(b => b.TrangThai == "Đang sử dụng") // Kiểm tra kỹ string trạng thái này trong DB
                .Select(b => new 
                {
                    id = b.MaBan,      
                    name = "Bàn " + b.MaBan   
                })
                .ToListAsync();

            return Ok(tables);
        }
    }
}