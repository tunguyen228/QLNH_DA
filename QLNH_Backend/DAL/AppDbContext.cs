using Microsoft.EntityFrameworkCore;
using QLNH_Backend.Models;
using QLNH_Backend.DTO;

namespace QLNH_Backend.DAL;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
    
    public virtual DbSet<BanAn> BanAns { get; set; }
    public virtual DbSet<ChiTietHoaDon> ChiTietHoaDons { get; set; }
    public virtual DbSet<ChiTietPhieuGoi> ChiTietPhieuGois { get; set; }
    public virtual DbSet<ChiTietPhieuNhap>  ChiTietPhieuNhaps { get; set; }
    public virtual DbSet<ChiTietPhieuXuat>  ChiTietPhieuXuats { get; set; }
    public virtual DbSet<DinhLuong>  DinhLuongs { get; set; }
    public virtual DbSet<HoaDon> HoaDons { get; set; }
    public virtual DbSet<HoaDonBan>  HoaDonBans { get; set; }
    public virtual DbSet<KhachHang> KhachHangs { get; set; }
    public virtual DbSet<MonAn> MonAns { get; set; }
    public virtual DbSet<NguyenLieu> NguyenLieus { get; set; }
    public virtual DbSet<NhanVien> NhanViens { get; set; }
    public virtual DbSet<NhomMon> NhomMons { get; set; }
    public virtual DbSet<PhieuGoi> PhieuGois { get; set; }
    public virtual DbSet<PhieuNhap>  PhieuNhaps { get; set; }
    public virtual DbSet<PhieuXuat> PhieuXuats { get; set; }
    public virtual DbSet<ThongBao> ThongBaos { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<BanAn>(entity =>
        {
            entity.HasKey(e => e.MaBan);
            entity.Property(e => e.TrangThai)
                .HasDefaultValue("Trống")
                .HasMaxLength(50);
            entity.HasMany(e => e.ThongBaos)
                .WithOne(t => t.MaBanNavigation)
                .HasForeignKey(t => t.MaBan)
                .OnDelete(DeleteBehavior.SetNull);
            entity.HasMany(e => e.PhieuGois)
                .WithOne(p => p.MaBanNavigation)
                .HasForeignKey(t=> t.MaBan);
            entity.HasData(
                new BanAn { MaBan = 101, TrangThai = "Trống", Tang = 1, SoGhe = 2 },
                new BanAn { MaBan = 102, TrangThai = "Trống", Tang = 1, SoGhe = 2 },
                new BanAn { MaBan = 103, TrangThai = "Trống", Tang = 1, SoGhe = 4 },
                new BanAn { MaBan = 104, TrangThai = "Trống", Tang = 1, SoGhe = 4 },
                new BanAn { MaBan = 204, TrangThai = "Trống", Tang = 2, SoGhe = 4 },
                new BanAn { MaBan = 205, TrangThai = "Trống", Tang = 2, SoGhe = 8 },
                new BanAn { MaBan = 206, TrangThai = "Trống", Tang = 2, SoGhe = 8 },
                new BanAn { MaBan = 207, TrangThai = "Trống", Tang = 2, SoGhe = 12 }
            );
        });
        
        modelBuilder.Entity<KhachHang>(entity =>
        {
            entity.HasKey(e => e.MaKh);
            entity.HasMany(e => e.HoaDons)
                .WithOne(t=>t.MaKhNavigation)
                .HasForeignKey(t=> t.MaKh);
        });
        
        modelBuilder.Entity<NhanVien>(entity =>
        {
            entity.HasKey(e => e.MaNv);
            entity.Property(e => e.TenDangNhap).IsRequired().HasMaxLength(50);
            entity.Property(e => e.MatKhau).IsRequired().HasMaxLength(255);
            entity.Property(e => e.HoTen).IsRequired().HasMaxLength(100);
            entity.Property(e => e.VaiTro).IsRequired().HasMaxLength(50);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasMany(e => e.HoaDons)
                .WithOne(h => h.MaNvNavigation)
                .HasForeignKey(h => h.MaNv)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e => e.PhieuXuats)
                .WithOne(p => p.MaNvNavigation)
                .HasForeignKey(p=>p.MaNv)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e => e.PhieuNhaps)
                .WithOne(p => p.MaNvNavigation)
                .HasForeignKey(p=>p.MaNv)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e => e.PhieuGois)
                .WithOne(p => p.MaNvNavigation)
                .HasForeignKey(p=>p.MaNv)
                .OnDelete(DeleteBehavior.Restrict);

            string defaultHashedPassword = "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa";
            var seedDate = new DateTime(2026, 8, 5, 0, 0, 0, DateTimeKind.Utc);
            
            entity.HasData(
                new NhanVien { MaNv = 001, TenDangNhap = "pv1", MatKhau = defaultHashedPassword, HoTen = "Phục Vụ 1", VaiTro = "Phục vụ", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 002, TenDangNhap = "pv2", MatKhau = defaultHashedPassword, HoTen = "Phục Vụ 2", VaiTro = "Phục vụ", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 003, TenDangNhap = "pv3", MatKhau = defaultHashedPassword, HoTen = "Phục Vụ 3", VaiTro = "Phục vụ", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 004, TenDangNhap = "pv4", MatKhau = defaultHashedPassword, HoTen = "Phục Vụ 4", VaiTro = "Phục vụ", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 005, TenDangNhap = "pv5", MatKhau = defaultHashedPassword, HoTen = "Phục Vụ 5", VaiTro = "Phục vụ", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 006, TenDangNhap = "bep1", MatKhau = defaultHashedPassword, HoTen = "Bếp 1", VaiTro = "Bếp", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 007, TenDangNhap = "bep2", MatKhau = defaultHashedPassword, HoTen = "Bếp 2", VaiTro = "Bếp", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 008, TenDangNhap = "bep3", MatKhau = defaultHashedPassword, HoTen = "Bếp 3", VaiTro = "Bếp", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 009, TenDangNhap = "tn1", MatKhau = defaultHashedPassword, HoTen = "Thu Ngân 1", VaiTro = "Thu ngân", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 010, TenDangNhap = "tn2", MatKhau = defaultHashedPassword, HoTen = "Thu Ngân 2", VaiTro = "Thu ngân", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" },
                new NhanVien { MaNv = 011, TenDangNhap = "ql1", MatKhau = defaultHashedPassword, HoTen = "Quản Lý", VaiTro = "Quản lý", NgayTao = seedDate, Avatar = null, TrangThaiHoatDong = "Làm việc" }
            );
        });

        modelBuilder.Entity<HoaDon>(entity =>
        {
            entity.HasKey(e => e.MaHoaDon);
            entity.Ignore(e => e.TongTienMon);
            entity.Ignore(e => e.TongThanhToan);
            entity.Property(e => e.PhuongThucTt)
                .HasDefaultValue("Tiền mặt")
                .HasMaxLength(50);
            entity.HasOne(e => e.MaNvNavigation)
                  .WithMany(n => n.HoaDons)
                  .HasForeignKey(e => e.MaNv)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.MaKhNavigation)
                .WithMany(k => k.HoaDons)
                .HasForeignKey(e => e.MaKh)
                .OnDelete(DeleteBehavior.SetNull);
            entity.HasMany(e => e.ChiTietHoaDons)
                .WithOne(c => c.MaHoaDonNavigation)
                .HasForeignKey(c => c.MaHoaDon)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(e => e.PhieuGois)
                .WithOne(p => p.MaHoaDonNavigation)
                .HasForeignKey(p=>p.MaHoaDon)
                .OnDelete(DeleteBehavior.SetNull);
        });
        
        modelBuilder.Entity<HoaDonBan>(entity =>
        {
            entity.HasKey(e => new { e.MaHoaDon, e.MaBan });
            entity.HasOne(e => e.MaHoaDonNavigation)
                  .WithMany(h => h.HoaDonBans)
                  .HasForeignKey(e => e.MaHoaDon);
            entity.HasOne(e => e.MaBanNavigation)
                  .WithMany(b => b.HoaDonBans)
                  .HasForeignKey(e => e.MaBan);
        });
        
        modelBuilder.Entity<NhomMon>(entity =>
        {
            entity.HasKey(e => e.MaNhom);
            entity.HasMany(m=>m.MonAns)
                .WithOne(n=>n.MaNhomNavigation)
                .HasForeignKey(m=>m.MaNhom)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<MonAn>(entity =>
        {
            entity.HasKey(e => e.MaMon);
            entity.Property(e => e.TenMon)
                .IsRequired()
                .HasMaxLength(255);
            entity.Property(e => e.DangKinhDoanh)
                .HasDefaultValue(true);
            entity.HasOne(e => e.MaNhomNavigation)
                  .WithMany(n => n.MonAns)
                  .HasForeignKey(e => e.MaNhom)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasMany(e => e.ChiTietHoaDons)
                .WithOne(c => c.MaMonNavigation)
                .HasForeignKey(c => c.MaMon)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e => e.ChiTietPhieuGois)
                .WithOne(c => c.MaMonNavigation)
                .HasForeignKey(c => c.MaMon)
                .OnDelete(DeleteBehavior.SetNull);
            entity.HasMany(e => e.DinhLuongs)
                .WithOne(d => d.MaMonNavigation)
                .HasForeignKey(d => d.MaMon)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<NguyenLieu>(entity =>
        {
            entity.HasKey(e => e.MaNguyenLieu);
            entity.Property(e => e.TenNguyenLieu)
                .IsRequired() 
                .HasMaxLength(255);
            entity.HasMany(e => e.ChiTietPhieuNhaps)
                .WithOne(ct => ct.MaNguyenLieuNavigation)
                .HasForeignKey(ct => ct.MaNguyenLieu)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e => e.ChiTietPhieuXuats)
                .WithOne(ct => ct.MaNguyenLieuNavigation)
                .HasForeignKey(ct => ct.MaNguyenLieu)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e => e.DinhLuongs)
                .WithOne(d => d.MaNguyenLieuNavigation)
                .HasForeignKey(d => d.MaNguyenLieu)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<DinhLuong>(entity =>
        {
            entity.HasKey(e => new { e.MaMon, e.MaNguyenLieu });
            entity.HasOne(e => e.MaMonNavigation)
                  .WithMany(m => m.DinhLuongs)
                  .HasForeignKey(e => e.MaMon);
            entity.HasOne(e => e.MaNguyenLieuNavigation)
                  .WithMany(nl => nl.DinhLuongs)
                  .HasForeignKey(e => e.MaNguyenLieu);
        });
        
        modelBuilder.Entity<PhieuGoi>(entity =>
        {
            entity.HasKey(e => e.MaPhieu);
            entity.Property(e => e.ThoiGianTao)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasOne(e => e.MaHoaDonNavigation)
                  .WithMany(h => h.PhieuGois)
                  .HasForeignKey(p=>p.MaHoaDon)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.MaNvNavigation)
                  .WithMany(n => n.PhieuGois)
                  .HasForeignKey(p=>p.MaNv)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.MaBanNavigation)
                .WithMany(b => b.PhieuGois)
                .HasForeignKey(p => p.MaBan)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e=>e.ChiTietPhieuGois)
                .WithOne(p=>p.MaPhieuNavigation)
                .HasForeignKey(p=>p.MaPhieu)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ChiTietPhieuGoi>(entity =>
        {
            entity.HasKey(e => new { e.MaPhieu, e.MaMon });
            entity.Property(e => e.GhiChu)
                .HasMaxLength(255);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("Chờ xử lý");
            entity.HasOne(e => e.MaPhieuNavigation)
                  .WithMany(p => p.ChiTietPhieuGois)
                  .HasForeignKey(e => e.MaPhieu)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.MaMonNavigation)
                  .WithMany(m => m.ChiTietPhieuGois)
                  .HasForeignKey(e => e.MaMon)
                  .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<ChiTietHoaDon>(entity =>
        {
            entity.HasKey(e => new { e.MaHoaDon, e.MaMon });
            entity.HasOne(e => e.MaHoaDonNavigation)
                  .WithMany(h => h.ChiTietHoaDons)
                  .HasForeignKey(e => e.MaHoaDon);
            entity.HasOne(e => e.MaMonNavigation)
                  .WithMany(m => m.ChiTietHoaDons)
                  .HasForeignKey(e => e.MaMon);
        });
        
        modelBuilder.Entity<PhieuNhap>(entity =>
        {
            entity.HasKey(e => e.MaPhieuNhap);
            entity.Ignore(e => e.TongTien); 
            entity.Property(e => e.NgayNhap)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.HasOne(e => e.MaNvNavigation)
                  .WithMany(n => n.PhieuNhaps)
                  .HasForeignKey(p=>p.MaNv)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e => e.ChiTietPhieuNhaps)
                .WithOne(c => c.MaPhieuNhapNavigation)
                .HasForeignKey(c => c.MaPhieuNhap)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ChiTietPhieuNhap>(entity =>
        {
            entity.HasKey(e => new { e.MaPhieuNhap, e.MaNguyenLieu });
            entity.HasOne(e => e.MaPhieuNhapNavigation)
                  .WithMany(p => p.ChiTietPhieuNhaps)
                  .HasForeignKey(e => e.MaPhieuNhap);
            entity.HasOne(e => e.MaNguyenLieuNavigation)
                  .WithMany(nl => nl.ChiTietPhieuNhaps)
                  .HasForeignKey(e => e.MaNguyenLieu);
        });

        modelBuilder.Entity<PhieuXuat>(entity =>
        {
            entity.HasKey(e => e.MaPhieuXuat);
            entity.HasOne(e => e.MaNvNavigation)
                .WithMany(n => n.PhieuXuats)
                .HasForeignKey(n => n.MaNv)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(e => e.ChiTietPhieuXuats)
                .WithOne(p => p.MaPhieuXuatNavigation)
                .HasForeignKey(p => p.MaPhieuXuat)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<ChiTietPhieuXuat>(entity =>
        {
            entity.HasKey(e => new { e.MaPhieuXuat, e.MaNguyenLieu });
            entity.HasOne(e => e.MaPhieuXuatNavigation)
                  .WithMany(p => p.ChiTietPhieuXuats)
                  .HasForeignKey(e => e.MaPhieuXuat);
            entity.HasOne(e => e.MaNguyenLieuNavigation)
                  .WithMany(nl => nl.ChiTietPhieuXuats)
                  .HasForeignKey(e => e.MaNguyenLieu);
        });
        
        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.MaTb);
            entity.HasOne(e => e.MaBanNavigation)
                  .WithMany(b => b.ThongBaos)
                  .HasForeignKey(e => e.MaBan)
                  .OnDelete(DeleteBehavior.SetNull);
        });
        
    }
}