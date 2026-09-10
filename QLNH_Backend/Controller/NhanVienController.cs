using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using QLNH_Backend.DAL;
using QLNH_Backend.Models;
using QLNH_Backend.BLL;
using QLNH_Backend.DTO;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using QLNH_Backend.Hubs;
using Microsoft.AspNetCore.Mvc;

namespace QLNH_Backend.Controller;

// File: Controllers/NhanVienController.cs
[ApiController]
[Route("api/[controller]")]
public class NhanVienController : ControllerBase
{
    private readonly INhanVienService _service;
    public NhanVienController(INhanVienService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var nv = await _service.GetByIdAsync(id);
        return nv == null ? NotFound() : Ok(nv);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NhanVienRequestDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.MaNV }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] NhanVienRequestDTO dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var ok = await _service.UpdateAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}