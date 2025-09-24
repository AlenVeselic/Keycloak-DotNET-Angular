
using Microsoft.EntityFrameworkCore;


namespace User.Models;

public class UserContext : DbContext
{
    public DbSet<User> Users { get; set; }

    public UserContext(DbContextOptions options) : base(options) {}

}
public class User
{
    public Guid Id { get; set; }
    public string Bio { get; set; }
}