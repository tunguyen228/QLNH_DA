using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.Models;

namespace QLNH_Backend.DAL
{
    public interface ITableRepository
    {
        Task<List<BanAn>> GetAllAsync();
        Task<BanAn?> GetByIdAsync(int id);
        Task AddAsync(BanAn table);
        Task<bool> UpdateAsync(BanAn table);
        Task<bool> DeleteAsync(int id);
    }
}