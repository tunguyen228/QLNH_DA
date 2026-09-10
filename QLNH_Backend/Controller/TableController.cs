using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.BLL;
using QLNH_Backend.DAL;
using QLNH_Backend.DTO;

namespace QLNH_Backend.Controllers
{
    [ApiController]
    [Route("api/waiter/[controller]")]
    public class TableController : ControllerBase
    {
        private readonly ITableService _service;
        private readonly AppDbContext _context;

        public TableController(ITableService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpGet("map")]
        public async Task<ActionResult<TableMapResponse>> GetTableMap()
        {
            var banAnsFromDb = await _context.BanAns
                .OrderBy(b => b.MaBan)
                .ToListAsync();

            var response = new TableMapResponse
            {
                Areas = new List<AreaDTO>()
            };

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
                .Where(b => b.TrangThai == "Đang sử dụng")
                .Select(b => new
                {
                    id = b.MaBan,
                    name = "Bàn " + b.MaBan
                })
                .ToListAsync();

            return Ok(tables);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TableRequestDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            return Ok(await _service.CreateAsync(dto));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TableRequestDTO dto) =>
            await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}