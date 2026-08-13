namespace QLNH_Backend.DTO;

public class AreaDTO
{
    public int Id { get; set; }
    public string Name { get; set; } 
    public List<TableDTO> Tables { get; set; } = new List<TableDTO>();
}