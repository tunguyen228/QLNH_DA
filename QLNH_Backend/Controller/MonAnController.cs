using QLNH_Backend.BLL; // nếu chứa Interface Service (IMonAnService, INhanVienService)
using QLNH_Backend.DTO; // nếu chứa DTO (MonAnRequestDTO, BanRequestDTO)
using QLNH_Backend.DAL;
using Microsoft.AspNetCore.Mvc;

namespace QLNH_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonAnController : ControllerBase
    {
        private readonly IMonAnService _service;
        public MonAnController(IMonAnService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MonAnRequestDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            return Ok(await _service.CreateAsync(dto));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MonAnRequestDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            return await _service.UpdateAsync(id, dto) ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
