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
    public class BepService : IBepService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public BepService(AppDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<bool> GuiOrderXuongBep(SendOrderRequestDTO request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Luôn tạo phiếu gọi MỚI cho mỗi lần bấm "Gửi order",
                // KHÔNG tìm và tái sử dụng phiếu gọi cũ của bàn nữa.
                // => 1 bàn gọi nhiều lần sẽ có nhiều PhieuGoi riêng biệt.
                var phieuGoi = new PhieuGoi
                {
                    MaBan = request.TableId,
                    MaNv = request.MaNv,
                };
                _context.PhieuGois.Add(phieuGoi);
                await _context.SaveChangesAsync(); // Lưu để sinh MaPhieu (khóa chính tự tăng) trước khi tạo ChiTietPhieuGoi

                // Gộp món trùng nhau TRONG CÙNG 1 request (phòng trường hợp payload có 2 dòng cùng món),
                // không còn liên quan gì tới các phiếu gọi cũ nữa.
                var chiTietMoiList = new List<ChiTietPhieuGoi>();

                foreach (var item in request.Items)
                {
                    var daCoTrongRequest = chiTietMoiList.FirstOrDefault(ct => ct.MaMon == item.MonAnId);

                    if (daCoTrongRequest != null)
                    {
                        daCoTrongRequest.SoLuong += item.SoLuong;

                        if (!string.IsNullOrWhiteSpace(item.GhiChu))
                        {
                            daCoTrongRequest.GhiChu = string.IsNullOrWhiteSpace(daCoTrongRequest.GhiChu)
                                ? item.GhiChu
                                : daCoTrongRequest.GhiChu + " | " + item.GhiChu;
                        }
                    }
                    else
                    {
                        var chiTietMoi = new ChiTietPhieuGoi
                        {
                            MaPhieu = phieuGoi.MaPhieu,
                            MaMon = item.MonAnId,
                            SoLuong = item.SoLuong,
                            GhiChu = item.GhiChu,
                            TrangThai = "ChoCheBien"
                        };
                        _context.ChiTietPhieuGois.Add(chiTietMoi);
                        chiTietMoiList.Add(chiTietMoi);
                    }
                }

                // Cập nhật trạng thái bàn sang "Đang sử dụng" khi có phiếu gọi (chỉ set nếu chưa ở trạng thái đó).
                var ban = await _context.BanAns.FirstOrDefaultAsync(b => b.MaBan == request.TableId);
                if (ban != null && ban.TrangThai != "Đang sử dụng" && ban.TrangThai != "Có khách")
                {
                    ban.TrangThai = "Đang sử dụng";
                }

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
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
                    GhiChu = c.GhiChu,
                    TenMon = _context.MonAns.FirstOrDefault(m => m.MaMon == c.MaMon).TenMon,
                    TenBan = _context.PhieuGois.FirstOrDefault(p => p.MaPhieu == c.MaPhieu).MaBan.ToString()
                })
                .ToListAsync();

            return danhSach;
        }

        public async Task<IEnumerable<MonChoCheBienDTO>> GetDanhSachMonDangCheBienAsync()
        {
            var danhSach = await _context.ChiTietPhieuGois
                .Where(c => c.TrangThai == "DangCheBien")
                .Select(c => new MonChoCheBienDTO
                {
                    MaPhieu = c.MaPhieu,
                    MaMon = c.MaMon,
                    SoLuong = c.SoLuong,
                    GhiChu = c.GhiChu,
                    TenMon = _context.MonAns.FirstOrDefault(m => m.MaMon == c.MaMon).TenMon,
                    TenBan = _context.PhieuGois.FirstOrDefault(p => p.MaPhieu == c.MaPhieu).MaBan.ToString()
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

            if (trangThaiMoi == "DaXong")
            {
                await _hubContext.Clients.All.SendAsync("DishStatusUpdated", new
                {
                    MaPhieu = phieuGoiId,
                    MaMon = monAnId,
                    TrangThai = trangThaiMoi
                });
            }

            return true;
        }
    }
}