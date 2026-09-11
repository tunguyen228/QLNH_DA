using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QLNH_Backend.DAL;
using QLNH_Backend.DTO;
using QLNH_Backend.Models;

namespace QLNH_Backend.BLL
{
    public interface ITableService
    {
        Task<List<TableDTO>> GetAllAsync();
        Task<TableDTO> CreateAsync(TableRequestDTO dto);
        Task<bool> UpdateAsync(int id, TableRequestDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}