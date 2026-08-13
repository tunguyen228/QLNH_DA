using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QLNH.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BanAns",
                columns: table => new
                {
                    MaBan = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TrangThai = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Trống"),
                    Tang = table.Column<int>(type: "integer", nullable: false),
                    SoGhe = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BanAns", x => x.MaBan);
                });

            migrationBuilder.CreateTable(
                name: "KhachHangs",
                columns: table => new
                {
                    MaKh = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenKhachHang = table.Column<string>(type: "text", nullable: true),
                    DiemTichLuy = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhachHangs", x => x.MaKh);
                });

            migrationBuilder.CreateTable(
                name: "NguyenLieus",
                columns: table => new
                {
                    MaNguyenLieu = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenNguyenLieu = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    DonViTinh = table.Column<string>(type: "text", nullable: true),
                    DonGia = table.Column<decimal>(type: "numeric", nullable: false),
                    SoLuongTon = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguyenLieus", x => x.MaNguyenLieu);
                });

            migrationBuilder.CreateTable(
                name: "NhanViens",
                columns: table => new
                {
                    MaNv = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenDangNhap = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MatKhau = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    HoTen = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    VaiTro = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    NgayTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    Avatar = table.Column<string>(type: "text", nullable: true),
                    TrangThaiHoatDong = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhanViens", x => x.MaNv);
                });

            migrationBuilder.CreateTable(
                name: "NhomMons",
                columns: table => new
                {
                    MaNhom = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenNhom = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhomMons", x => x.MaNhom);
                });

            migrationBuilder.CreateTable(
                name: "ThongBaos",
                columns: table => new
                {
                    MaTb = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaBan = table.Column<int>(type: "integer", nullable: false),
                    NoiDung = table.Column<string>(type: "text", nullable: false),
                    DaXem = table.Column<bool>(type: "boolean", nullable: true),
                    ThoiGian = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongBaos", x => x.MaTb);
                    table.ForeignKey(
                        name: "FK_ThongBaos_BanAns_MaBan",
                        column: x => x.MaBan,
                        principalTable: "BanAns",
                        principalColumn: "MaBan",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "HoaDons",
                columns: table => new
                {
                    MaHoaDon = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNv = table.Column<int>(type: "integer", nullable: false),
                    MaKh = table.Column<int>(type: "integer", nullable: false),
                    ThoiGianVao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ThoiGianRa = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TienKhachDua = table.Column<decimal>(type: "numeric", nullable: false),
                    TienThua = table.Column<decimal>(type: "numeric", nullable: false),
                    PhuongThucTt = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Tiền mặt"),
                    GiamGia = table.Column<decimal>(type: "numeric", nullable: false),
                    Vat = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDons", x => x.MaHoaDon);
                    table.ForeignKey(
                        name: "FK_HoaDons_KhachHangs_MaKh",
                        column: x => x.MaKh,
                        principalTable: "KhachHangs",
                        principalColumn: "MaKh",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_HoaDons_NhanViens_MaNv",
                        column: x => x.MaNv,
                        principalTable: "NhanViens",
                        principalColumn: "MaNv",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PhieuNhaps",
                columns: table => new
                {
                    MaPhieuNhap = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNv = table.Column<int>(type: "integer", nullable: false),
                    NgayNhap = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuNhaps", x => x.MaPhieuNhap);
                    table.ForeignKey(
                        name: "FK_PhieuNhaps_NhanViens_MaNv",
                        column: x => x.MaNv,
                        principalTable: "NhanViens",
                        principalColumn: "MaNv",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PhieuXuats",
                columns: table => new
                {
                    MaPhieuXuat = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNv = table.Column<int>(type: "integer", nullable: false),
                    NgayXuat = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuXuats", x => x.MaPhieuXuat);
                    table.ForeignKey(
                        name: "FK_PhieuXuats_NhanViens_MaNv",
                        column: x => x.MaNv,
                        principalTable: "NhanViens",
                        principalColumn: "MaNv",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MonAns",
                columns: table => new
                {
                    MaMon = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaNhom = table.Column<int>(type: "integer", nullable: false),
                    TenMon = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    DonVi = table.Column<string>(type: "text", nullable: false),
                    GiaTien = table.Column<decimal>(type: "numeric", nullable: false),
                    HinhAnh = table.Column<string>(type: "text", nullable: true),
                    DangKinhDoanh = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonAns", x => x.MaMon);
                    table.ForeignKey(
                        name: "FK_MonAns_NhomMons_MaNhom",
                        column: x => x.MaNhom,
                        principalTable: "NhomMons",
                        principalColumn: "MaNhom",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "HoaDonBans",
                columns: table => new
                {
                    MaHoaDon = table.Column<int>(type: "integer", nullable: false),
                    MaBan = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDonBans", x => new { x.MaHoaDon, x.MaBan });
                    table.ForeignKey(
                        name: "FK_HoaDonBans_BanAns_MaBan",
                        column: x => x.MaBan,
                        principalTable: "BanAns",
                        principalColumn: "MaBan",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HoaDonBans_HoaDons_MaHoaDon",
                        column: x => x.MaHoaDon,
                        principalTable: "HoaDons",
                        principalColumn: "MaHoaDon",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuGois",
                columns: table => new
                {
                    MaPhieu = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MaBan = table.Column<int>(type: "integer", nullable: false),
                    MaNv = table.Column<int>(type: "integer", nullable: false),
                    MaHoaDon = table.Column<int>(type: "integer", nullable: false),
                    ThoiGianTao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuGois", x => x.MaPhieu);
                    table.ForeignKey(
                        name: "FK_PhieuGois_BanAns_MaBan",
                        column: x => x.MaBan,
                        principalTable: "BanAns",
                        principalColumn: "MaBan",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PhieuGois_HoaDons_MaHoaDon",
                        column: x => x.MaHoaDon,
                        principalTable: "HoaDons",
                        principalColumn: "MaHoaDon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PhieuGois_NhanViens_MaNv",
                        column: x => x.MaNv,
                        principalTable: "NhanViens",
                        principalColumn: "MaNv",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuNhaps",
                columns: table => new
                {
                    MaPhieuNhap = table.Column<int>(type: "integer", nullable: false),
                    MaNguyenLieu = table.Column<int>(type: "integer", nullable: false),
                    DonGia = table.Column<decimal>(type: "numeric", nullable: false),
                    SoLuongNhap = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuNhaps", x => new { x.MaPhieuNhap, x.MaNguyenLieu });
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhaps_NguyenLieus_MaNguyenLieu",
                        column: x => x.MaNguyenLieu,
                        principalTable: "NguyenLieus",
                        principalColumn: "MaNguyenLieu",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuNhaps_PhieuNhaps_MaPhieuNhap",
                        column: x => x.MaPhieuNhap,
                        principalTable: "PhieuNhaps",
                        principalColumn: "MaPhieuNhap",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuXuats",
                columns: table => new
                {
                    MaPhieuXuat = table.Column<int>(type: "integer", nullable: false),
                    MaNguyenLieu = table.Column<int>(type: "integer", nullable: false),
                    SoLuongXuat = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuXuats", x => new { x.MaPhieuXuat, x.MaNguyenLieu });
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuXuats_NguyenLieus_MaNguyenLieu",
                        column: x => x.MaNguyenLieu,
                        principalTable: "NguyenLieus",
                        principalColumn: "MaNguyenLieu",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuXuats_PhieuXuats_MaPhieuXuat",
                        column: x => x.MaPhieuXuat,
                        principalTable: "PhieuXuats",
                        principalColumn: "MaPhieuXuat",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietHoaDons",
                columns: table => new
                {
                    MaMon = table.Column<int>(type: "integer", nullable: false),
                    MaHoaDon = table.Column<int>(type: "integer", nullable: false),
                    SoLuong = table.Column<int>(type: "integer", nullable: false),
                    DonGia = table.Column<decimal>(type: "numeric", nullable: false),
                    ThoiGianGoi = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietHoaDons", x => new { x.MaHoaDon, x.MaMon });
                    table.ForeignKey(
                        name: "FK_ChiTietHoaDons_HoaDons_MaHoaDon",
                        column: x => x.MaHoaDon,
                        principalTable: "HoaDons",
                        principalColumn: "MaHoaDon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietHoaDons_MonAns_MaMon",
                        column: x => x.MaMon,
                        principalTable: "MonAns",
                        principalColumn: "MaMon",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DinhLuongs",
                columns: table => new
                {
                    MaMon = table.Column<int>(type: "integer", nullable: false),
                    MaNguyenLieu = table.Column<int>(type: "integer", nullable: false),
                    SoLuongDung = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DinhLuongs", x => new { x.MaMon, x.MaNguyenLieu });
                    table.ForeignKey(
                        name: "FK_DinhLuongs_MonAns_MaMon",
                        column: x => x.MaMon,
                        principalTable: "MonAns",
                        principalColumn: "MaMon",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DinhLuongs_NguyenLieus_MaNguyenLieu",
                        column: x => x.MaNguyenLieu,
                        principalTable: "NguyenLieus",
                        principalColumn: "MaNguyenLieu",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuGois",
                columns: table => new
                {
                    MaPhieu = table.Column<int>(type: "integer", nullable: false),
                    MaMon = table.Column<int>(type: "integer", nullable: false),
                    SoLuong = table.Column<int>(type: "integer", nullable: false),
                    GhiChu = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    TrangThai = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true, defaultValue: "Chờ xử lý")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuGois", x => new { x.MaPhieu, x.MaMon });
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuGois_MonAns_MaMon",
                        column: x => x.MaMon,
                        principalTable: "MonAns",
                        principalColumn: "MaMon",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuGois_PhieuGois_MaPhieu",
                        column: x => x.MaPhieu,
                        principalTable: "PhieuGois",
                        principalColumn: "MaPhieu",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "BanAns",
                columns: new[] { "MaBan", "SoGhe", "Tang", "TrangThai" },
                values: new object[,]
                {
                    { 101, 2, 1, "Trống" },
                    { 102, 2, 1, "Trống" },
                    { 103, 4, 1, "Trống" },
                    { 104, 4, 1, "Trống" },
                    { 204, 4, 2, "Trống" },
                    { 205, 8, 2, "Trống" },
                    { 206, 8, 2, "Trống" },
                    { 207, 12, 2, "Trống" }
                });

            migrationBuilder.InsertData(
                table: "NhanViens",
                columns: new[] { "MaNv", "Avatar", "HoTen", "MatKhau", "NgayTao", "TenDangNhap", "TrangThaiHoatDong", "VaiTro" },
                values: new object[,]
                {
                    { 1, null, "Phục Vụ 1", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "pv1", "Làm việc", "Phục vụ" },
                    { 2, null, "Phục Vụ 2", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "pv2", "Làm việc", "Phục vụ" },
                    { 3, null, "Phục Vụ 3", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "pv3", "Làm việc", "Phục vụ" },
                    { 4, null, "Phục Vụ 4", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "pv4", "Làm việc", "Phục vụ" },
                    { 5, null, "Phục Vụ 5", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "pv5", "Làm việc", "Phục vụ" },
                    { 6, null, "Bếp 1", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "bep1", "Làm việc", "Bếp" },
                    { 7, null, "Bếp 2", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "bep2", "Làm việc", "Bếp" },
                    { 8, null, "Bếp 3", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "bep3", "Làm việc", "Bếp" },
                    { 9, null, "Thu Ngân 1", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "tn1", "Làm việc", "Thu ngân" },
                    { 10, null, "Thu Ngân 2", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "tn2", "Làm việc", "Thu ngân" },
                    { 11, null, "Quản Lý", "$2a$11$oOycLqRaWyE8r.VGoAY3x.dWpSopPJ47qJqdKAOxoPMDHcNkQPhJa", new DateTime(2026, 8, 5, 0, 0, 0, 0, DateTimeKind.Utc), "ql1", "Làm việc", "Quản lý" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietHoaDons_MaMon",
                table: "ChiTietHoaDons",
                column: "MaMon");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuGois_MaMon",
                table: "ChiTietPhieuGois",
                column: "MaMon");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhaps_MaNguyenLieu",
                table: "ChiTietPhieuNhaps",
                column: "MaNguyenLieu");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuXuats_MaNguyenLieu",
                table: "ChiTietPhieuXuats",
                column: "MaNguyenLieu");

            migrationBuilder.CreateIndex(
                name: "IX_DinhLuongs_MaNguyenLieu",
                table: "DinhLuongs",
                column: "MaNguyenLieu");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDonBans_MaBan",
                table: "HoaDonBans",
                column: "MaBan");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_MaKh",
                table: "HoaDons",
                column: "MaKh");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_MaNv",
                table: "HoaDons",
                column: "MaNv");

            migrationBuilder.CreateIndex(
                name: "IX_MonAns_MaNhom",
                table: "MonAns",
                column: "MaNhom");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuGois_MaBan",
                table: "PhieuGois",
                column: "MaBan");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuGois_MaHoaDon",
                table: "PhieuGois",
                column: "MaHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuGois_MaNv",
                table: "PhieuGois",
                column: "MaNv");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhaps_MaNv",
                table: "PhieuNhaps",
                column: "MaNv");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuats_MaNv",
                table: "PhieuXuats",
                column: "MaNv");

            migrationBuilder.CreateIndex(
                name: "IX_ThongBaos_MaBan",
                table: "ThongBaos",
                column: "MaBan");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietHoaDons");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuGois");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuNhaps");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuXuats");

            migrationBuilder.DropTable(
                name: "DinhLuongs");

            migrationBuilder.DropTable(
                name: "HoaDonBans");

            migrationBuilder.DropTable(
                name: "ThongBaos");

            migrationBuilder.DropTable(
                name: "PhieuGois");

            migrationBuilder.DropTable(
                name: "PhieuNhaps");

            migrationBuilder.DropTable(
                name: "PhieuXuats");

            migrationBuilder.DropTable(
                name: "MonAns");

            migrationBuilder.DropTable(
                name: "NguyenLieus");

            migrationBuilder.DropTable(
                name: "BanAns");

            migrationBuilder.DropTable(
                name: "HoaDons");

            migrationBuilder.DropTable(
                name: "NhomMons");

            migrationBuilder.DropTable(
                name: "KhachHangs");

            migrationBuilder.DropTable(
                name: "NhanViens");
        }
    }
}
