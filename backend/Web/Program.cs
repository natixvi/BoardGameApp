using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Persistance.Data;
using Persistance.Seeder;
using Services.Interfaces;
using Services.Mappers;
using Services.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//Utowrzenie obiektu jwtSetting, pobranie danych jwt z pliku konfiguracyjnego app i przypisuje je do obiektu jwtSettings
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

builder.Services.AddScoped<ApiSeeder>(); //Ka�de ��danie korzysta z tej samej instancji ApiSeeder w ramach jednego zasi�gu scope
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BoardGameAppDbContext") ?? throw new InvalidOperationException("Connection string 'BoardGameAppDbContext' not found.")));


builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
