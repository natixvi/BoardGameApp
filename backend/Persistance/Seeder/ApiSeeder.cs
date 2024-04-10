using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistance.Data;

namespace Persistance.Seeder;

public class ApiSeeder
{
    private readonly AppDbContext context;
    private readonly IPasswordHasher<User> passwordHasher;

    public ApiSeeder(AppDbContext context, IPasswordHasher<User> passwordHasher)
    {
        this.context = context;
        this.passwordHasher = passwordHasher;
    }
    public void Seed()
    {
        if (context.Database.CanConnect())
        {
            var pendingMigrations = context.Database.GetPendingMigrations(); 

            if (pendingMigrations != null && pendingMigrations.Any())
            {
                context.Database.Migrate();
            }

            if (!context.Roles.Any()) 
            {
                context.Database.OpenConnection();
                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Roles ON");

                var roles = GetRoles();
                context.Roles.AddRange(roles);
                context.SaveChanges();

                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Roles OFF");
                context.Database.CloseConnection();

            }
            if (!context.Users.Any()) 
            {
                var users = GetUsers();
                context.Users.AddRange(users);
                context.SaveChanges();
            }
            if (!context.BoardGames.Any())
            {
                var boardGames = GetBoardGames();
                context.BoardGames.AddRange(boardGames);
                context.SaveChanges();
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

    private IEnumerable<User> GetUsers()
    {
        var users = new List<User>() {

                new User(){
                    NickName = "admin",
                    Password = passwordHasher.HashPassword(null, password: "adminadmin"),
                    Email = "admin@example.com",
                    RoleId = 1
                },
                new User(){
                    NickName = "user",
                    Password = passwordHasher.HashPassword(null, password: "useruser"),
                    Email = "user@example.com",
                    RoleId = 2
                }
        };
               

        return users;
    }

    private IEnumerable<BoardGame> GetBoardGames()
    {
        var boardGames = new List<BoardGame>()
        {
            new BoardGame()
            {
                Name = "Lost Ruins of Arnak",
                Publisher = "Rebel",
                Description = "Lost Ruins of Arnak - an adventure game in which " +
                "you play the role of explorers who want to explore the uninhabited island of " +
                "Arnak. As it turns out, this island has traces of a great civilization - " +
                "explore all the undiscovered corners of the island, find the lost artifacts, " +
                "face the guards defending the island and learn the great mystery of " +
                "Arnak Island.",
                Players = "1-4",
                Time = "30-120 Min",
                Age = 12,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2000997/rebel-zaginiona-wyspa-Arnak_box3d_PL.png"
            },
            new BoardGame()
            {
                Name = "Scythe",
                Publisher = "Phalanx",
                Description = "The ashes of the Great War still shroud the snow in " +
                "1920's Europia. The capitalist city-state known simply as \"The Factory,\" " +
                "which had been a driving force in the war thanks to the mechs it produced, " +
                "slammed its doors, attracting the attention of several nearby countries...." +
                "Representatives of five factions have gathered in a small but highly desirable" +
                " area. Who will gain glory and fortune by establishing their empire as the leader " +
                "of Eastern Europe?",
                Players = "1-5",
                Time = "90-120 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/1065/5759/_2005100/scythe.jpg"
            },
            new BoardGame()
            {
                Name = "Everdell",
                Publisher = "Rebel",
                Description = "In the charming valley of Everdell, under the branches of tall trees, among mossy boulders, a " +
                "civilization of forest animals is developing. Many years have passed since its beginnings and the time has " +
                "finally come to explore new territories and establish brand new cities. When you sit down to play the game, " +
                "you will take on the role of the leader of a group of creatures that set out to conquer the unknown. You'll" +
                " have to build a lot of buildings, learn about new creatures and get carried away with the upcoming events. " +
                "It's going to be a busy year! Everdell is a dynamic game based on assignment mechanics. It seduces with " +
                "its beautiful execution and offers many paths to victory, making it a real pleasure to explore.",
                Players = "1-4",
                Time = "60-120 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/303/_109580/rebel-gra-ekonomiczna-everdell-box3d.png"
            },
            new BoardGame()
            {
                Name = "7 Wonders Duel",
                Publisher = "Rebel",
                Description = "Lead your civilization to greatness by nurturing its military and scientific development" +
                " and constructing extraordinary Buildings and Wonders. 7 Wonders of the World: Duel is a 2-player" +
                " game that uses some of the main concepts of the bestseller 7 Wonders of the World, but also offers new " +
                "challenges, specially tailored for 2-player play",
                Players = "2",
                Time = "30-45 Min",
                Age = 10,
                ImageUrl = "https://files.rebel.pl/products/100/1281/_98221/pojedynek_3d.jpg"
            },
            new BoardGame()
            {
                Name = "Cascadia",
                Publisher = "Lucky Duck Games",
                Description = "In the charming valley of Everdell, under the branches of tall trees, among mossy boulders, a " +
                "civilization of forest animals is developing. Many years have passed since its beginnings and the time has " +
                "finally come to explore new territories and establish brand new cities. When you sit down to play the game, " +
                "you will take on the role of the leader of a group of creatures that set out to conquer the unknown. You'll" +
                " have to build a lot of buildings, learn about new creatures and get carried away with the upcoming events. " +
                "It's going to be a busy year! Everdell is a dynamic game based on assignment mechanics. It seduces with " +
                "its beautiful execution and offers many paths to victory, making it a real pleasure to explore.",
                Players = "1-4",
                Time = "30-45 Min",
                Age = 10,
                ImageUrl = "https://files.rebel.pl/products/1065/5759/_2006299/Cascadia_3Dbox_PL.png"
            },
            new BoardGame()
            {
                Name = "Spirit Island",
                Publisher = "Lacerta",
                Description = "Spirit Island is a cooperative title for advanced players. Players work together to save the island from " +
                "invaders using the abilities and special powers of the spirits they play as. The basic game includes eight ghosts to choose " +
                "from. Each is characterized by a different level of complexity, has different powers and requires different styles of play from " +
                "players. In addition, the game allows you to increase the difficulty level by using one of the four available scenarios or selecting " +
                "a specific opponent.",
                Players = "1-4",
                Time = "90-120 Min",
                Age = 13,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2000658/spirit_island_3d.jpg"
            },
            new BoardGame()
            {
                Name = "Ankh: Gods of Egypt",
                Publisher = "Portal Games",
                Description = "Ankh: Gods of Egypt is an advanced strategy board game by the brilliant Eric M. Lang (Cthulhu: Death May Die, Blodboorne)," +
                " closing his ancient trilogy, which also includes Blood Rage and Rising Sun. After Viking Scandinavia and feudal Japan comes ancient Egypt!" +
                "Take on the role of one of the five Egyptian gods and lead a dedicated army to ultimate rule in the land on the Nile. " +
                "Develop your character, gain valuable allies and fight for more followers. Only they can ensure your survival and make your name " +
                "immortal. When the battle dust settles, only one god will be remembered in Egypt.",
                Players = "2-5",
                Time = "90 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/371/_2007597/Ankh-bogowie-egiptu-pudelko.jpg"
            },
            new BoardGame()
            {
                Name = "Root",
                Publisher = "Portal Games",
                Description = "Root is a dynamic game telling the story of the war for influence in the Great Forest. " +
                "Players take control of one of four factions vying to seize power and prove that its representatives are " +
                "the rightful rulers of the vast Woodland.",
                Players = "2-4",
                Time = "60-90 Min",
                Age = 10,
                ImageUrl = "https://files.rebel.pl/products/100/302/_110788/www.portalgames.pl-root-1625.png"
            },
            new BoardGame()
            {
                Name = "Witchstone",
                Publisher = "Rebel",
                Description = "Witch Rock is a board game in which you take on the role of learned guild masters gathered around " +
                "an ancient sacred stone. Each person occupies 1 of the 4 towers and starts the game from there. Prepare spells in " +
                "your cauldrons and create a network of magical energy around the Witch Rock. Send out your witches, fish out magic " +
                "crystals from your cauldrons and make good use of your pentagram and magic wands. However, don't forget about predictions " +
                "if you want to ensure victory! Not all opportunities are always available, so you have to use the opportunities that come your " +
                "way wisely. After 11 rounds, the one of you who accumulates the most victory points will win the game and become the Chosen " +
                "One of the Witch's Rock.",
                Players = "2-4",
                Time = "60-90 Min",
                Age = 12,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2002325/rebel-gra-strategiczna-wiedzmia-skala-box3d.png"
            },
            new BoardGame()
            {
                Name = "Robinson Crusoe: Adventures on the Cursed Island",
                Publisher = "Portal Games",
                Description = "Robinson Crusoe: Adventure on the Cursed Island is a great game by Portal. This time you are kidnapped " +
                "to a deserted island and thrown into a vortex of extraordinary adventures that will happen to a group of castaways! " +
                "You will build a shawl, a palisade, weapons, you will create items, you will try to do your best to... to survive. " +
                "You will search for food, fight with beasts, protect yourselves from bad weather....",
                Players = "1-4",
                Time = "60-120 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/1379/_24428/portal-games-kooperacyjna-robinson-crusoe-nowa-edycja-box-.png"
            }

        };

        return boardGames;
    }
}

