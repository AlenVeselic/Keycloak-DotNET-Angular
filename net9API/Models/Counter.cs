
using Microsoft.EntityFrameworkCore;


namespace Counter.Models;

public class CounterContext : DbContext
{
    public DbSet<Counter> Counters { get; set; }

    public CounterContext(DbContextOptions options) : base(options) {}

}
public class Counter
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    
    public string Name { get; set; }
    public string Amount { get; set; }
}