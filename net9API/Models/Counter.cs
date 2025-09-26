
namespace Counter.Models;
public class Counter
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    
    public string Name { get; set; }
    public string Amount { get; set; }
}