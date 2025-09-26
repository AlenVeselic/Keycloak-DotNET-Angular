using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using System.Security.Claims;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // KeyCloak
    c.CustomSchemaIds(type => type.ToString());
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "KEYCLOAK",
        Type = SecuritySchemeType.OAuth2,
        In = ParameterLocation.Header,
        BearerFormat = "JWT",
        Scheme = "bearer",
        Flows = new OpenApiOAuthFlows
        {
            AuthorizationCode = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri(builder.Configuration["Jwt:AuthorizationUrl"]),
                TokenUrl = new Uri(builder.Configuration["Jwt:TokenUrl"]),
                Scopes = new Dictionary<string, string> { }
            }
        },
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    c.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
                                                {securityScheme, new string[] { }}
                                            });
});

// KeyCloak
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(o =>
{
    o.Authority = builder.Configuration["Jwt:Authority"];
    o.Audience = builder.Configuration["Jwt:Audience"];
    o.SaveToken = true;
    o.RequireHttpsMetadata = false;
    o.Events = new JwtBearerEvents()
    {
        OnTokenValidated = c =>
        {
            DBContext.AppDBContext dbContext = c.HttpContext.RequestServices.GetRequiredService<DBContext.AppDBContext>();
            var jwtUserIdentifier = c.Principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier).Value;
            var _user = dbContext.Users.ToList().FirstOrDefault(u => u.Id.ToString() == jwtUserIdentifier);
            if (_user == null)
            {
                Console.WriteLine("New user detected. Adding to database.");

                dbContext.Users.Add(new User.Models.User
                {
                    Id = Guid.Parse(jwtUserIdentifier),
                    Bio = "The new user has no bio yet."
                });

                dbContext.SaveChanges();
            }
            // If you want to add some logic on successful authentication, add here.
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = c =>
        {
            c.NoResult();

            c.Response.StatusCode = 500;
            c.Response.ContentType = "text/plain";

            // Debug only for security reasons
            // return c.Response.WriteAsync(c.Exception.ToString());

            return c.Response.WriteAsync("An error occured processing your authentication.");
        }
    };
});

// Cross-Origin 
builder.Services
    .AddCors(options =>
    {
        options.AddPolicy("AllowOrigin",
            builder => builder.WithOrigins("http://localhost:4200")
                              .AllowAnyHeader()
                              .AllowAnyMethod());
    });

builder.Services.AddOpenApi();
builder.Services.AddDbContext<DBContext.AppDBContext>(o => o.UseNpgsql(builder.Configuration.GetConnectionString("DBConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
        app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MyAppAPI");
        c.OAuthClientId(builder.Configuration["Jwt:ClientId"]);
        c.OAuthClientSecret(builder.Configuration["Jwt:ClientSecret"]);
        c.OAuthRealm(builder.Configuration["Jwt:Realm"]);
        c.OAuthAppName("KEYCLOAK");
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

