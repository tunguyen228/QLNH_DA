using Microsoft.EntityFrameworkCore;
using QLNH_Backend.Models;
using QLNH_Backend.DTO;
using QLNH_Backend.DAL; // hoặc namespace chứa AppDbContext / QLNHContext

namespace QLNH_Backend.DAL
{
    // File: DAL/Repositories/MonAnRepository.cs
    public interface IMonAnRepository
    {
        Task<List<MonAn>> GetAllAsync();
        Task<MonAn> GetByIdAsync(int id);
        Task AddAsync(MonAn m);
        Task<bool> UpdateAsync(MonAn m);
        Task<bool> DeleteAsync(int id);
    }
}