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

        // Các trạng thái được coi là "đã chế biến xong"
        private static readonly string[] DoneStatuses = { "DaXong", "HoanThanh" };

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
                var phieuGoi = new PhieuGoi
                {
                    MaBan = request.TableId,
                    MaNv = request.MaNv,
                    TrangThai = "ChoCheBien" // FIX: was missing, caused NOT NULL violation on insert
                };
                _context.PhieuGois.Add(phieuGoi);
                await _context.SaveChangesAsync();

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

            // Sửa: nhận cả "DaXong" lẫn "HoanThanh" (tên thật bếp đang gửi), thay vì chỉ check "DaXong"
            if (DoneStatuses.Contains(trangThaiMoi))
            {
                var tenMon = await _context.MonAns
                    .Where(m => m.MaMon == monAnId)
                    .Select(m => m.TenMon)
                    .FirstOrDefaultAsync();

                var maBan = await _context.PhieuGois
                    .Where(p => p.MaPhieu == phieuGoiId)
                    .Select(p => p.MaBan)
                    .FirstOrDefaultAsync();

                await _hubContext.Clients.All.SendAsync("DishStatusUpdated", new
                {
                    MaPhieu = phieuGoiId,
                    MaMon = monAnId,
                    TrangThai = trangThaiMoi,
                    TenMon = tenMon,
                    MaBan = maBan
                });
            }

            return true;
        }
    }
}