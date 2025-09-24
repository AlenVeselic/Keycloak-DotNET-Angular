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
    private readonly User.Models.UserContext _dbContext;

    public UserController(ILogger<WeatherForecastController> logger, User.Models.UserContext dbContext)
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
