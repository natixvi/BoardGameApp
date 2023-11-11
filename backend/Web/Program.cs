using Microsoft.EntityFrameworkCore;
using Persistance.Data;
using Persistance.Seeder;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddScoped<ApiSeeder>(); //Ka�de ��danie korzysta z tej samej instancji ApiSeeder w ramach jednego zasi�gu scope
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BoardGameAppDbContext") ?? throw new InvalidOperationException("Connection string 'BoardGameAppDbContext' not found.")));

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

app.UseAuthorization();

app.MapControllers();

app.Run();
