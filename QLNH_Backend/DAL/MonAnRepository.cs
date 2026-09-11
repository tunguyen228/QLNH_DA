using Microsoft.EntityFrameworkCore;
using QLNH_Backend.Models;
using QLNH_Backend.DTO;
using QLNH_Backend.DAL; // hoặc namespace chứa AppDbContext / QLNHContext

namespace QLNH_Backend.DAL
{
    public class MonAnRepository : IMonAnRepository
    {
        private readonly AppDbContext _context;
        public MonAnRepository(AppDbContext context) => _context = context;

        // Luôn Include Nhóm để tránh lặp bug thiếu field khi Select() chiếu thiếu cột
        public async Task<List<MonAn>> GetAllAsync() =>
            await _context.MonAns.Include(x => x.MaNhomNavigation).OrderBy(x => x.MaMon).ToListAsync();

        public async Task<MonAn> GetByIdAsync(int id) =>
            await _context.MonAns.Include(x => x.MaNhomNavigation).FirstOrDefaultAsync(x => x.MaMon == id);

        public async Task AddAsync(MonAn m) { _context.MonAns.Add(m); await _context.SaveChangesAsync(); }

        public async Task<bool> UpdateAsync(MonAn m)
        {
            _context.MonAns.Update(m);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var m = await GetByIdAsync(id);
            if (m == null) return false;
            _context.MonAns.Remove(m);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}