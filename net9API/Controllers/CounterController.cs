using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace net9API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class CounterController : ControllerBase
{

    private readonly ILogger<WeatherForecastController> _logger;
    private readonly Counter.Models.CounterContext _dbContext;

    public CounterController(ILogger<WeatherForecastController> logger, Counter.Models.CounterContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet(Name = "GetAllUserCounters")]
    public List<Counter.Models.Counter> Get()
    {

        var userId = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return null;
        return _dbContext.Counters.AsEnumerable().Select(c => c).Where(c => c.UserId.ToString() == userId).ToList();
    }

    [HttpPost(Name = "CreateCounter")]
    public ActionResult<Counter.Models.Counter> Post(string name)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var counter = new Counter.Models.Counter();

        counter.UserId = Guid.Parse(userId);
        counter.Id = Guid.NewGuid();
        counter.Name = name ?? "Default Counter Name";
        counter.Amount = "0";
        _dbContext.Counters.Add(counter);
        _dbContext.SaveChanges();
        return CreatedAtAction(nameof(Get), new { id = counter.Id }, counter);
    }

    [HttpPut("{id}")]
    public IActionResult Put(Guid id, string amount)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var counter = _dbContext.Counters.Find(id);
        if (counter == null || counter.UserId.ToString() != userId) return NotFound();

        counter.Amount = amount;
        _dbContext.SaveChanges();
        return NoContent();
    }
}
