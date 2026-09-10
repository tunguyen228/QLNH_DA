using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using QLNH_Backend.DAL;
using QLNH_Backend.Models;
using QLNH_Backend.DTO;
using QLNH_Backend.BLL;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using QLNH_Backend.Hubs;
using Microsoft.AspNetCore.Mvc;


namespace QLNH_Backend.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class NhomMonController : ControllerBase
    {
        private readonly AppDbContext _context;
        public NhomMonController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.NhomMons.Select(x => new NhomMonDTO { MaNhom = x.MaNhom, TenNhom = x.TenNhom }).ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] NhomMonRequestDTO dto)
        {
            var nhom = new NhomMon { TenNhom = dto.TenNhom };
            _context.NhomMons.Add(nhom);
            await _context.SaveChangesAsync();
            return Ok(new NhomMonDTO { MaNhom = nhom.MaNhom, TenNhom = nhom.TenNhom });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var nhom = await _context.NhomMons.FindAsync(id);
            if (nhom == null) return NotFound();
            // kiểm tra còn món ăn thuộc nhóm này không trước khi xóa
            var conMon = await _context.MonAns.AnyAsync(m => m.MaNhom == id);
            if (conMon) return BadRequest(new { message = "Nhóm còn món ăn, không thể xóa" });
            _context.NhomMons.Remove(nhom);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }   
}
