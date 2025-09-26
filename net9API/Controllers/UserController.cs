using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace net9API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class UserController : ControllerBase
{

    private readonly ILogger<WeatherForecastController> _logger;
    private readonly DBContext.AppDBContext _dbContext;

    public UserController(ILogger<WeatherForecastController> logger, DBContext.AppDBContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet(Name = "GetProfile")]
    public User.Models.User Get()
    {
        
        return _dbContext.Users.ToList().FirstOrDefault(u => u.Id.ToString() == User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
    }
}
