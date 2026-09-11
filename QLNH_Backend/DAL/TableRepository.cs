using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.Models;

namespace QLNH_Backend.DAL
{
    public class TableRepository : ITableRepository
    {
        private readonly AppDbContext _context;

        public TableRepository(AppDbContext context) => _context = context;

        public async Task<List<BanAn>> GetAllAsync() => 
            await _context.BanAns.OrderBy(x => x.MaBan).ToListAsync();

        public async Task<BanAn?> GetByIdAsync(int id) => 
            await _context.BanAns.FirstOrDefaultAsync(x => x.MaBan == id);

        public async Task AddAsync(BanAn table) 
        { 
            _context.BanAns.Add(table); 
            await _context.SaveChangesAsync(); 
        }

        public async Task<bool> UpdateAsync(BanAn table) 
        { 
            _context.BanAns.Update(table); 
            return await _context.SaveChangesAsync() > 0; 
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var table = await GetByIdAsync(id);
            if (table == null) return false;
            _context.BanAns.Remove(table);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}