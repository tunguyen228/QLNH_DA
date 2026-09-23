using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DAL;
using QLNH_Backend.Models;
using QLNH_Backend.DTO;

namespace QLNH_Backend.BLL
{
    public class MonAnService : IMonAnService
    {
        private readonly IMonAnRepository _repo;
        public MonAnService(IMonAnRepository repo) => _repo = repo;
        public static readonly HashSet<int> DanhSachTamHet = new HashSet<int>();
        private static MonAnDTO ToDTO(MonAn m) => new MonAnDTO
        {
            MaMon = m.MaMon,
            TenMon = m.TenMon,
            MaNhom = m.MaNhom,
            TenNhom = m.MaNhomNavigation?.TenNhom,
            GiaTien = m.GiaTien,
            HinhAnh = m.HinhAnh,
            DangKinhDoanh = m.DangKinhDoanh,
            TamHet = DanhSachTamHet.Contains(m.MaMon)
        };
        public async Task<List<MonAnDTO>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(ToDTO).ToList();
        }
        public async Task<List<MonAnDTO>> GetMenuChoKhachAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Where(m => m.DangKinhDoanh == true)
                       .Select(ToDTO)
                       .ToList();
        }
        public bool ToggleTamHet(int id)
        {
            if (DanhSachTamHet.Contains(id))
                DanhSachTamHet.Remove(id);
            else
                DanhSachTamHet.Add(id);
            return DanhSachTamHet.Contains(id);
        }
        public async Task<MonAnDTO> CreateAsync(MonAnDTO dto)
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
            var created = await _repo.GetByIdAsync(m.MaMon);
            return ToDTO(created ?? m);
        }
        public async Task<bool> UpdateAsync(int id, MonAnDTO dto)
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
        public async Task<bool> DeleteAsync(int id)
        {
            DanhSachTamHet.Remove(id);
            return await _repo.DeleteAsync(id);
        }
    }
}