using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using QLNH_Backend.DAL;
using QLNH_Backend.Models;
using QLNH_Backend.DTO;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using QLNH_Backend.Hubs;

namespace QLNH_Backend.BLL
{
    // File: BLL/Services/MonAnService.cs
    public interface IMonAnService
    {
        Task<List<MonAnDTO>> GetAllAsync();
        Task<MonAnDTO> CreateAsync(MonAnRequestDTO dto);
        Task<bool> UpdateAsync(int id, MonAnRequestDTO dto);
        Task<bool> DeleteAsync(int id);
    }

    public class MonAnService : IMonAnService
    {
        private readonly IMonAnRepository _repo;
        public MonAnService(IMonAnRepository repo) => _repo = repo;

        private static MonAnDTO ToDTO(MonAn m) => new MonAnDTO
        {
            MaMon = m.MaMon,
            TenMon = m.TenMon,
            MaNhom = m.MaNhom,
            TenNhom = m.MaNhomNavigation?.TenNhom,   // lấy đúng field, tránh bug maNhom trả về 0
            GiaTien = m.GiaTien,
            HinhAnh = m.HinhAnh,
            DangKinhDoanh = m.DangKinhDoanh
        };

        public async Task<List<MonAnDTO>> GetAllAsync() => (await _repo.GetAllAsync()).Select(ToDTO).ToList();

        public async Task<MonAnDTO> CreateAsync(MonAnRequestDTO dto)
        {
            var m = new MonAn
            {
                TenMon = dto.TenMon, 
                MaNhom = dto.MaNhom, 
                GiaTien = dto.GiaTien,
                HinhAnh = dto.HinhAnh, 
                DangKinhDoanh = dto.DangKinhDoanh
            };
            await _repo.AddAsync(m);
            return ToDTO(await _repo.GetByIdAsync(m.MaMon));
        }

        public async Task<bool> UpdateAsync(int id, MonAnRequestDTO dto)
        {
            var m = await _repo.GetByIdAsync(id);
            if (m == null) return false;
            m.TenMon = dto.TenMon; 
            m.MaNhom = dto.MaNhom; 
            m.GiaTien = dto.GiaTien;
            m.HinhAnh = dto.HinhAnh;
            m.DangKinhDoanh = dto.DangKinhDoanh;
            return await _repo.UpdateAsync(m);
        }

        public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);
    }
}