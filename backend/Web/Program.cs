using Domain.Entities;
using Domain.IRepositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Persistance.Data;
using Persistance.Repositories;
using Persistance.Seeder;
using Services.Interfaces;
using Services.Mappers;
using Services.Services;
using System.Text;
using Web.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
                      builder =>
                      {
                          builder.WithOrigins("http://localhost:4200")
                         .AllowAnyHeader()
                         .AllowAnyMethod()
                         .AllowCredentials();
                      });
});

//Utworzenie obiektu jwtSetting, pobranie danych jwt z pliku konfiguracyjnego app i przypisuje je do obiektu jwtSettings
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

//Wstrzykni�cie jwtSetting do kontenera zale�no�ci
builder.Services.AddSingleton<IJwtSettings>(jwtSettings);

//Konfiguracja us�ug uwierzytelniania w aplikacji, paramenrty jwt jakie s� weryfikowane i inne opcje
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,    
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.JwtIssuer,
            ValidAudience = jwtSettings.JwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.JwtKey))
        };
    });


// Add services to the container.

builder.Services.AddTransient<IAccountService, AccountService>();
builder.Services.AddTransient<IAccountRepository, AccountRepository>();
builder.Services.AddTransient<IBoardGameService, BoardGameService>();
builder.Services.AddTransient<IBoardGameRepository, BoardGameRepository>();
builder.Services.AddTransient<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<ErrorHandlingMiddleware>();
builder.Services.AddScoped<IUserContextService, UserContextService>();

builder.Services.AddScoped<ApiSeeder>(); //Ka�de ��danie korzysta z tej samej instancji ApiSeeder w ramach jednego zasi�gu scope
builder.Services.AddHttpContextAccessor();

/*builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BoardGameAppDbContext") ?? throw new InvalidOperationException("Connection string 'BoardGameAppDbContext' not found."), b => b.MigrationsAssembly("Persistance")));
*/

builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("BoardGameAppDbContext"), b => b.MigrationsAssembly("Persistance")));

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddControllers();



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(/*c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Board Game API",
        Description = "Aplikacja dla mi�o�nik�w gier planszowych",
        Version = "v1"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Jwt token",
        Type = SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
   {
     new OpenApiSecurityScheme
     {
       Reference = new OpenApiReference
       {
         Type = ReferenceType.SecurityScheme,
         Id = "Bearer",
       },
      },
      new string[] {  }
    }
  });
}*/);

var app = builder.Build();

var scope = app.Services.CreateScope(); //tworzy nowy zasi�g, w celu zarz�dania cyklem �ycia us�ug, towrozy loklany zasi�g kt�ry ucy� do pobrania us�ug z kontenera
var seeder = scope.ServiceProvider.GetService<ApiSeeder>(); // Tutaj w obr�bie stworoznego zasi�gu, pobieramy us�ug� Api seeder i otrzymujemy jej instancj� z zasi�gu aplikacji

if(seeder != null)
{
   seeder.Seed();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
