using Microsoft.EntityFrameworkCore;

namespace DBContext;
public class AppDBContext : DbContext
{
    public DbSet<User.Models.User> Users { get; set; }
    public DbSet<Counter.Models.Counter> Counters { get; set; }

    public AppDBContext(DbContextOptions options) : base(options) { }

}