using System;
using System.ComponentModel.DataAnnotations;

namespace QLNH_Backend.DTO
{
    public class TableDTO
    {
        public int Id { get; set; }
        public int Capacity { get; set; }
        public int Floor { get; set; }
        public TableStatus Status { get; set; }
    }
    public class TableRequestDTO
    {
        [Range(1, 50)] 
        public int Capacity { get; set; }
        public int Floor { get; set; }
        public string TrangThai { get; set; } = "Trống";
    }
}