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
            // 1. Tìm phiếu gọi gần nhất của bàn này
            var phieuGoi = await _context.PhieuGois
                .Where(p => p.MaBan == request.TableId)
                .OrderByDescending(p => p.MaPhieu)
                .FirstOrDefaultAsync();
    
            if (phieuGoi == null)
            {
                phieuGoi = new PhieuGoi 
                { 
                    MaBan = request.TableId,
                    MaNv = request.MaNv,
                };
                _context.PhieuGois.Add(phieuGoi);
                await _context.SaveChangesAsync(); 
            }

            // 2. Lấy toàn bộ chi tiết món ăn ĐÃ CÓ trong phiếu gọi này lên trước (để tối ưu DB)
            var chiTietDaCoList = await _context.ChiTietPhieuGois
                .Where(ct => ct.MaPhieu == phieuGoi.MaPhieu)
                .ToListAsync();

            // 3. Duyệt qua từng món khách vừa order
            foreach (var item in request.Items)
            {
                // Tìm xem món này đã có trong phiếu chưa
                var chiTietDaCo = chiTietDaCoList.FirstOrDefault(ct => ct.MaMon == item.MonAnId);

                if (chiTietDaCo != null)
                {
                    // NẾU ĐÃ CÓ: Cộng dồn số lượng
                    chiTietDaCo.SoLuong += item.SoLuong;
                    
                    // Nối thêm ghi chú (nếu có)
                    if (!string.IsNullOrWhiteSpace(item.GhiChu))
                    {
                        chiTietDaCo.GhiChu = string.IsNullOrWhiteSpace(chiTietDaCo.GhiChu) 
                            ? item.GhiChu 
                            : chiTietDaCo.GhiChu + " | " + item.GhiChu;
                    }

                    // Đổi lại trạng thái thành chờ chế biến để báo cho bếp biết có thêm đồ
                    chiTietDaCo.TrangThai = "ChoCheBien"; 
                }
                else
                {
                    // NẾU CHƯA CÓ: Thêm mới hoàn toàn
                    var chiTietMoi = new ChiTietPhieuGoi
                    {
                        MaPhieu = phieuGoi.MaPhieu, 
                        MaMon = item.MonAnId,
                        SoLuong = item.SoLuong,
                        GhiChu = item.GhiChu,
                        TrangThai = "ChoCheBien" 
                    };
                    _context.ChiTietPhieuGois.Add(chiTietMoi);
                    
                    // Thêm vào list local để đề phòng trong cùng 1 request gửi lên có 2 món trùng ID
                    chiTietDaCoList.Add(chiTietMoi);
                }
            }

            // 4. Lưu tất cả thay đổi xuống Database
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