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
    public class NhanVienService : INhanVienService
    {
        private readonly INhanVienRepository _repo;
        public NhanVienService(INhanVienRepository repo) => _repo = repo;

        private static NhanVienDTO ToDTO(NhanVien nv) => new NhanVienDTO
        {
            MaNV = nv.MaNv,
            HoTen = nv.TenDangNhap,
            VaiTro = nv.VaiTro,
            TrangThaiHoatDong = nv.TrangThaiHoatDong
        };

        public async Task<List<NhanVienDTO>> GetAllAsync() =>
            (await _repo.GetAllAsync()).Select(ToDTO).ToList();

        public async Task<NhanVienDTO> GetByIdAsync(int id)
        {
            var nv = await _repo.GetByIdAsync(id);
            return nv == null ? null : ToDTO(nv);
        }

        public async Task<NhanVienDTO> CreateAsync(NhanVienRequestDTO dto)
        {
            var nv = new NhanVien
            {
                TenDangNhap = dto.TenDangNhap,
                MatKhau = dto.MatKhau,
                HoTen = dto.HoTen,
                VaiTro = dto.VaiTro,
                TrangThaiHoatDong = dto.TrangThaiHoatDong
            };
            await _repo.AddAsync(nv);
            return ToDTO(nv);
        }

        public async Task<bool> UpdateAsync(int id, NhanVienRequestDTO dto)
        {
            var nv = await _repo.GetByIdAsync(id);
            if (nv == null) return false;
            
            nv.TenDangNhap = dto.TenDangNhap;
            if (!string.IsNullOrEmpty(dto.MatKhau))
            {
                nv.MatKhau = dto.MatKhau;
            }
            nv.HoTen = dto.HoTen;
            nv.VaiTro = dto.VaiTro;
            nv.TrangThaiHoatDong = dto.TrangThaiHoatDong;

            return await _repo.UpdateAsync(nv);
        }

        public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);
    }
}