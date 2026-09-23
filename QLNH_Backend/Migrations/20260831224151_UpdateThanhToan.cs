using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QLNH.Migrations
{
    /// <inheritdoc />
    public partial class UpdateThanhToan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TrangThai",
                table: "PhieuGois",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SoDienThoai",
                table: "KhachHangs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ThoiGianTao",
                table: "HoaDonBans",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "TrangThai",
                table: "HoaDonBans",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "PhieuGois");

            migrationBuilder.DropColumn(
                name: "SoDienThoai",
                table: "KhachHangs");

            migrationBuilder.DropColumn(
                name: "ThoiGianTao",
                table: "HoaDonBans");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "HoaDonBans");
        }
    }
}
