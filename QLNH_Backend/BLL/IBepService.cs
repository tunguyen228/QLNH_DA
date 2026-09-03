using QLNH_Backend.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QLNH_Backend.BLL
{
    public interface IBepService
    {
        Task<IEnumerable<MonChoCheBienDTO>> GetDanhSachMonChoCheBienAsync();
        Task<IEnumerable<MonChoCheBienDTO>> GetDanhSachMonDangCheBienAsync();
        Task<bool> GuiOrderXuongBep(SendOrderRequestDTO request);
        Task<bool> CapNhatTrangThaiMonAsync(int maPhieu, int maMon, string trangThaiMoi);
        // Thêm thư viện nếu chưa có: using System.Collections.Generic;
        Task<IEnumerable<NhanVienBepDTO>> GetKitchenStaffAsync();
    }
}