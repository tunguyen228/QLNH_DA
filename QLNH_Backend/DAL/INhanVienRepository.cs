using Microsoft.EntityFrameworkCore;
using QLNH_Backend.Models;
using QLNH_Backend.DTO;
using QLNH_Backend.DAL; 

namespace QLNH_Backend.DAL
{
    public interface INhanVienRepository
    {
        Task<List<NhanVien>> GetAllAsync();
        Task<NhanVien> GetByIdAsync(int id);
        Task AddAsync(NhanVien nv);
        Task<bool> UpdateAsync(NhanVien nv);
        Task<bool> DeleteAsync(int id);
    }
}