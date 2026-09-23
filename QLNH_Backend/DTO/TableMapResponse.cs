namespace QLNH_Backend.DTO;

public class TableMapResponse
{
    public List<AreaDTO> Areas { get; set; } = new List<AreaDTO>();
    public int TotalTables { get; set; }
    public int InUseTables { get; set; }
    public int AvailableTables { get; set; }
}