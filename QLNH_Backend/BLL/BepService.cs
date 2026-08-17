using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using QLNH_Backend.DAL;
using QLNH_Backend.Models;
using QLNH_Backend.DTO;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace QLNH_Backend.BLL
{
    public class BepService : IBepService
    {
        private readonly AppDbContext _context;

        public BepService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> GuiOrderXuongBep(SendOrderRequestDTO request)
        {
            var phieuGoi = await _context.PhieuGois
                .Where(p => p.MaBan == request.TableId)
                .OrderByDescending(p => p.MaPhieu)
                .FirstOrDefaultAsync();
    
            if (phieuGoi == null)
            {
                phieuGoi = new PhieuGoi 
                { 
                    MaBan = request.TableId
                };
                _context.PhieuGois.Add(phieuGoi);
                await _context.SaveChangesAsync(); 
            }

            foreach (var item in request.Items)
            {
                var chiTiet = new ChiTietPhieuGoi
                {
                    MaPhieu = phieuGoi.MaPhieu, 
                    MaMon = item.MonAnId,
                    SoLuong = item.SoLuong,
                    GhiChu = item.GhiChu,
                    TrangThai = "ChoCheBien" 
                };
                _context.ChiTietPhieuGois.Add(chiTiet);
            }

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<MonChoCheBienDTO>> GetDanhSachMonChoCheBienAsync()
        {
            var danhSach = await _context.ChiTietPhieuGois
                .Where(c => c.TrangThai == "ChoCheBien") 
                .Select(c => new MonChoCheBienDTO
                {
                    MaPhieu = c.MaPhieu,
                    MaMon = c.MaMon,
                    SoLuong = c.SoLuong,
                    GhiChu = c.GhiChu
                })
                .ToListAsync();

            return danhSach;
        }

        public async Task<bool> CapNhatTrangThaiMonAsync(int phieuGoiId, int monAnId, string trangThaiMoi)
        {
            var chiTiet = await _context.ChiTietPhieuGois
                .FirstOrDefaultAsync(c => c.MaPhieu == phieuGoiId && c.MaMon == monAnId);

            if (chiTiet == null)
            {
                return false; 
            }

            chiTiet.TrangThai = trangThaiMoi;
            
            await _context.SaveChangesAsync();
            return true;
        }
    }
}