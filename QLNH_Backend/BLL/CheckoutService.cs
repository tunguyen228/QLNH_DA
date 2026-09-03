using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DAL;
using QLNH_Backend.DTO;
using QLNH_Backend.Models;

namespace QLNH_Backend.BLL
{
    public class CheckoutService : ICheckoutService
    {
        private readonly AppDbContext _context;

        public CheckoutService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CheckoutResponseDTO> ProcessCheckoutAsync(CheckoutRequestDTO request)
        {
            try
            {
                var table = await _context.BanAns.FindAsync(request.MaBan);

                var phieuGois = await _context.PhieuGois
                    .Include(p => p.ChiTietPhieuGois)
                    .ThenInclude(c => c.MaMonNavigation)
                    .Where(p => p.MaBan == request.MaBan && p.TrangThai != "Đã thanh toán")
                    .ToListAsync();

                if (!phieuGois.Any())
                    return new CheckoutResponseDTO { Success = false, Message = "Bàn chưa có phiếu gọi để thanh toán" };

                KhachHang khachHang = null;
                if (!string.IsNullOrEmpty(request.SoDienThoai))
                {
                    khachHang = await _context.KhachHangs.FirstOrDefaultAsync(k => k.SoDienThoai == request.SoDienThoai);
                }

                decimal tamTinh = 0;
                foreach (var p in phieuGois)
                {
                    tamTinh += p.ChiTietPhieuGois.Sum(c => c.SoLuong * (c.MaMonNavigation?.GiaTien ?? 0));
                }

                decimal vat = tamTinh * 0.10m;       // 10%
                decimal giamGia = 0m;
                decimal tongThanhToan = tamTinh + vat - giamGia; // Không có phí phục vụ

                var now = DateTime.UtcNow;

                var hoaDon = new HoaDon
                {
                    MaNv = 1,
                    MaKh = khachHang?.MaKh,
                    ThoiGianVao = now,
                    ThoiGianRa = now,
                    PhuongThucTt = request.PhuongThucTt,
                    Vat = vat,
                    GiamGia = giamGia,
                    TienKhachDua = 0m,
                    TienThua = 0m
                };

                var groupedDetails = phieuGois
                    .SelectMany(p => p.ChiTietPhieuGois)
                    .GroupBy(ct => new { ct.MaMon, GiaTien = ct.MaMonNavigation?.GiaTien ?? 0 })
                    .Select(g => new ChiTietHoaDon
                    {
                        MaMon = g.Key.MaMon,
                        SoLuong = g.Sum(x => x.SoLuong),
                        DonGia = g.Key.GiaTien
                    });

                foreach (var item in groupedDetails)
                {
                    hoaDon.ChiTietHoaDons.Add(item);
                }

                foreach (var p in phieuGois)
                {
                    p.TrangThai = "Đã thanh toán";
                    hoaDon.PhieuGois.Add(p);
                }

                _context.HoaDons.Add(hoaDon);

                var hoaDonBan = new HoaDonBan
                {
                    MaHoaDonNavigation = hoaDon,
                    MaBan = request.MaBan,
                    ThoiGianTao = now,
                    TrangThai = "Đã thanh toán"
                };
                _context.HoaDonBans.Add(hoaDonBan);

                int diemCong = 0;
                if (khachHang != null)
                {
                    diemCong = (int)Math.Floor(tongThanhToan / 100000);
                    khachHang.DiemTichLuy += diemCong;
                }

                if (table != null) table.TrangThai = "Trống";

                await _context.SaveChangesAsync();

                return new CheckoutResponseDTO
                {
                    Success = true,
                    Message = "Thanh toán thành công",
                    FinalTotal = tongThanhToan,
                    EarnedPoints = diemCong
                };
            }
            catch (Exception ex)
            {
                var detail = ex.InnerException?.Message ?? ex.Message;
                return new CheckoutResponseDTO
                {
                    Success = false,
                    Message = "Lỗi hệ thống khi thanh toán: " + detail
                };
            }
        }
        public async Task<object> GetCashierByIdAsync(int id)
        {
            // Truy vấn vào bảng NhanVien dựa theo model của bạn
            var cashier = await _context.NhanViens
                .Where(nv => nv.MaNv == id && nv.TrangThaiHoatDong == "Làm việc")
                .Select(nv => new 
                {
                    HoTen = nv.HoTen,
                    VaiTro = nv.VaiTro
                })
                .FirstOrDefaultAsync();

            return cashier;
        }
    }
}