using QLNH_Backend.BLL;
using QLNH_Backend.DTO;
using Microsoft.AspNetCore.Mvc;

namespace QLNH_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonAnController : ControllerBase
    {
        private readonly IMonAnService _service;
        public MonAnController(IMonAnService service) => _service = service;

        // Dành cho trang Quản lý: Lấy tất cả món (bao gồm cả món ngừng kinh doanh và tạm hết)
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        // Dành cho Menu khách / Phục vụ: Chỉ lấy những món đang kinh doanh (DangKinhDoanh == true)
        [HttpGet("menu-khach")]
        public async Task<IActionResult> GetMenuKhach() => Ok(await _service.GetMenuChoKhachAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MonAnDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            return Ok(await _service.CreateAsync(dto));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMonAn(int id, [FromBody] MonAnDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try 
            {
                var result = await _service.UpdateAsync(id, dto);
                if (!result) return NotFound(new { message = $"Không tìm thấy món ăn có ID {id}" });
                return Ok(new { message = "Cập nhật món ăn thành công" });
            } 
            catch (Exception ex) 
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Bật / Tắt trạng thái tạm hết trên RAM
        [HttpPatch("{id}/tam-het")]
        public IActionResult ToggleTamHet(int id)
        {
            bool isTamHet = _service.ToggleTamHet(id);
            return Ok(new { maMon = id, tamHet = isTamHet });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}