using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using QLNH_Backend.DAL;      
using QLNH_Backend.DTO;      
using QLNH_Backend.Models;

namespace QLNH_Backend.BLL
{
    public interface ICheckoutService
    {
        Task<CheckoutResponseDTO> ProcessCheckoutAsync(CheckoutRequestDTO request);
        Task<object> GetCashierByIdAsync(int id);
    }
}