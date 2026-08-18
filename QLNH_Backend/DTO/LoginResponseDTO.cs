namespace QLNH_Backend.DTO
{
    public class LoginResponseDTO
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty; 
        public string Role { get; set; } = string.Empty;
        public int MaNv { get; set; }
    }
}