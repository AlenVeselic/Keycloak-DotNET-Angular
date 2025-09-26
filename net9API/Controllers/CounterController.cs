using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace net9API.Controllers;

public class UpdateAmountResponse
{
    public string amount { get; set; }
}

public class CreateCounterRequest
{
    public string name { get; set; }
}

public class UpdateAmountRequest
{
    public string amount { get; set; }
}
[ApiController]
[Route("[controller]")]
[Authorize]
public class CounterController : ControllerBase
{

    private readonly ILogger<WeatherForecastController> _logger;
    private readonly DBContext.AppDBContext _dbContext;

    public CounterController(ILogger<WeatherForecastController> logger, DBContext.AppDBContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet("counters", Name = "GetAllUserCounters")]
    public List<Counter.Models.Counter> Get()
    {

        var userId = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return null;
        return _dbContext.Counters.AsEnumerable().Select(c => c).Where(c => c.UserId.ToString() == userId).ToList();
    }

    [HttpPost("create", Name = "CreateCounter")]
    public ActionResult<Counter.Models.Counter> Post([FromBody] CreateCounterRequest request)
    {
        var name = request?.name;
        if (string.IsNullOrEmpty(name)) name = "Default Counter Name";

        // Get user ID from token
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

    [HttpPut("{id}", Name = "UpdateCounterAmount")]
    public ActionResult<UpdateAmountResponse> Put()
    {
        var id = Request.RouteValues["id"]?.ToString();
        if (string.IsNullOrEmpty(id)) return BadRequest("ID cannot be null or empty.");
        var request = Request.ReadFromJsonAsync<UpdateAmountRequest>();
        if (request == null) return BadRequest("Request body cannot be null.");
        var amount = request.Result?.amount;
        if (amount == null) return BadRequest("Amount cannot be null.");
    
        var userId = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var counter = _dbContext.Counters.Find(Guid.Parse(id));
        if (counter == null || counter.UserId.ToString() != userId) return NotFound();

        if (string.IsNullOrEmpty(amount)) return BadRequest("Amount cannot be null or empty. Value: " + amount);
        if (!int.TryParse(amount, out _)) return BadRequest("Amount must be a valid integer.");
        if (int.Parse(amount) < 0) return BadRequest("Amount cannot be negative.");
        if (int.Abs(int.Parse(amount)) - int.Abs(int.Parse(counter.Amount)) > 1) return BadRequest("Amount can only be incremented or decremented by 1.");

        counter.Amount = amount;
        _dbContext.SaveChanges();
        return Ok(new UpdateAmountResponse { amount = counter.Amount });
    }
}
