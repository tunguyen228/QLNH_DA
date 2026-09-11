using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QLNH_Backend.DAL;
using QLNH_Backend.DTO;
using QLNH_Backend.Models;

namespace QLNH_Backend.BLL
{
    public class TableService : ITableService
    {
        private readonly ITableRepository _repo;

        public TableService(ITableRepository repo) => _repo = repo;

        private static TableDTO ToDTO(BanAn b)
        {
            TableStatus mappedStatus = TableStatus.Empty;
            if (b.TrangThai == "Đang sử dụng" || b.TrangThai == "Có khách")
            {
                mappedStatus = TableStatus.InUse;
            }

            return new TableDTO
            {
                Id = b.MaBan,
                Capacity = b.SoGhe,
                Floor = b.Tang,
                Status = mappedStatus
            };
        }

        public async Task<List<TableDTO>> GetAllAsync() =>
            (await _repo.GetAllAsync()).Select(ToDTO).ToList();

        public async Task<TableDTO> CreateAsync(TableRequestDTO dto)
        {
            var b = new BanAn
            {
                SoGhe = dto.Capacity,
                Tang = dto.Floor,
                TrangThai = dto.TrangThai
            };

            await _repo.AddAsync(b);
            return ToDTO(b);
        }

        public async Task<bool> UpdateAsync(int id, TableRequestDTO dto)
        {
            var b = await _repo.GetByIdAsync(id);
            if (b == null) return false;

            b.SoGhe = dto.Capacity;
            b.Tang = dto.Floor;
            b.TrangThai = dto.TrangThai;

            return await _repo.UpdateAsync(b);
        }

        public Task<bool> DeleteAsync(int id) => _repo.DeleteAsync(id);
    }
}