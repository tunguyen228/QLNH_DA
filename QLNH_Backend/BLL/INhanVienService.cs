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
    public interface INhanVienService
    {
        Task<List<NhanVienDTO>> GetAllAsync();
        Task<NhanVienDTO> GetByIdAsync(int id);
        Task<NhanVienDTO> CreateAsync(NhanVienRequestDTO dto);
        Task<bool> UpdateAsync(int id, NhanVienRequestDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}