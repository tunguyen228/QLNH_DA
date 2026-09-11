using Microsoft.EntityFrameworkCore;
using QLNH_Backend.Models;
using QLNH_Backend.DTO;
using QLNH_Backend.DAL; // hoặc namespace chứa AppDbContext / QLNHContext

namespace QLNH_Backend.DAL
{
    public class NhanVienRepository : INhanVienRepository
    {
        private readonly AppDbContext _context;
        public NhanVienRepository(AppDbContext context) => _context = context;

        public async Task<List<NhanVien>> GetAllAsync() =>
            await _context.NhanViens.OrderBy(x => x.MaNv).ToListAsync();

        public async Task<NhanVien> GetByIdAsync(int id) =>
            await _context.NhanViens.FirstOrDefaultAsync(x => x.MaNv == id);

        public async Task AddAsync(NhanVien nv)
        {
            _context.NhanViens.Add(nv);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync(NhanVien nv)
        {
            _context.NhanViens.Update(nv);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var nv = await GetByIdAsync(id);
            if (nv == null) return false;
            _context.NhanViens.Remove(nv);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}