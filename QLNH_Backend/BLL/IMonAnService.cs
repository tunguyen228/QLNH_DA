using System.Collections.Generic;
using System.Threading.Tasks;
using QLNH_Backend.DTO;

namespace QLNH_Backend.BLL
{
    public interface IMonAnService
    {
        Task<List<MonAnDTO>> GetAllAsync();
        Task<List<MonAnDTO>> GetMenuChoKhachAsync();
        bool ToggleTamHet(int id);
        Task<MonAnDTO> CreateAsync(MonAnDTO dto);
        Task<bool> UpdateAsync(int id, MonAnDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}