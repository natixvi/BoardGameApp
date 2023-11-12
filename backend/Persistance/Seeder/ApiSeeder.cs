using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Persistance.Seeder;

public class ApiSeeder
{
    private readonly AppDbContext context;

    public ApiSeeder(AppDbContext context)
    {
        this.context = context;
    }
    //Zapełnianie bazy danych wstępnymi danymi
    public void Seed()
    {
        if (context.Database.CanConnect())
        {
            var pendingMigrations = context.Database.GetPendingMigrations(); //Pobieranie listy migracji, które nie zostały jeszcze wykonane do bazy

            if (pendingMigrations != null && pendingMigrations.Any())
            {
                context.Database.Migrate(); //Jesli są jakies migracje linjka ta wykona je, zaktualizuje baze aby przygotować ją przed dalszym użyciem
            }

            if (!context.Roles.Any()) //Jeśli nie istnieją żadne rekordy w tabeli Roles to kod się wykona
            {
                context.Database.OpenConnection();
                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Roles ON");

                var roles = GetRoles();
                context.Roles.AddRange(roles);
                context.SaveChanges();

                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Roles OFF");
                context.Database.CloseConnection();

            }
        }

    }

    private IEnumerable<Role> GetRoles()
    {
        var roles = new List<Role>() {
                new Role(){
                    Id = 1,
                    Name = "Admin"
                },
                new Role(){
                    Id = 2,
                    Name = "User"
                }

            };

        return roles;
    }
}

