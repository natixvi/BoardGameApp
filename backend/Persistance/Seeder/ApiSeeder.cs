using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Persistance.Data;
using System;
using System.Data;
using System.Resources;

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
                Description = "The Lost Island of Arnak is a game combining the mechanics of deck building and worker deployment."+
                "Participants will explore successive corners of the board and discover unknown territories, " +
                "skilfully managing the resources they have gathered. In addition to the classic effects, " +
                "the available cards will also be used to deploy workers, and as more parts of the island are" + 
                " discovered, there will be completely new actions that we can perform. Some of these will require specific" +
                " resources, so building a solid base will be key.",
                Players = "1-4",
                Time = "30-120 Min",
                Age = 12,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2000997/rebel-zaginiona-wyspa-Arnak_box3d_PL.png"
            },
            new BoardGame()
            {
                Name = "Scythe",
                Publisher = "Phalanx",
                Description = "Representatives of five factions have come together in a small but highly desirable area." + 
                "Who will gain glory and fortune by creating their empire as the leader of Eastern Europe? " +
                "Scythe is a strategic board game for one to five players, in which you will take on the role of" +
                " leader of one of the nations of Eastern Europe in an alternative reality of the 1920s. " + 
                "You will explore and conquer more territories.You will recruit new recruits and gather resources. " +
                "Eventually, you'll send fearsome combat mechs into battle to crush other players. And all this for glory," + 
                " fame and money. The winner of the game will be the player with the most coins accumulated. The more coins you collect,"+ 
                " the more popular you become, the more developed your army becomes, and the more land and resources you control.",
                Players = "1-5",
                Time = "90-120 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/1065/5759/_2005100/scythe.jpg"
            },
            new BoardGame()
            {
                Name = "Everdell",
                Publisher = "Rebel",
                Description = "In the lovely Everdell Valley, under the branches of tall trees, among mossy boulders, a civilisation" +
                " of forest animals is developing. Many years have passed since its beginnings and it is finally time to explore new lands" +
                " and establish brand new cities. When you sit down to play the game, you will take on the role of leader of a group of creatures" +
                " that set out to conquer the unknown. You'll need to build lots of buildings, meet new creatures and let yourself be carried" +
                " away by the upcoming events. It's going to be a busy year! Everdell is a dynamic game based on worker assignment mechanics." +
                " It seduces with its beautiful execution and offers many paths to victory, making it a real pleasure to explore.",
                Players = "1-4",
                Time = "60-120 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/303/_109580/rebel-gra-ekonomiczna-everdell-box3d.png"
            },
            new BoardGame()
            {
                Name = "7 Wonders Duel",
                Publisher = "Rebel",
                Description = "Lead your civilisation to greatness by nurturing its military and scientific development and constructing extraordinary" +
                " Buildings and Wonders. 7 Wonders of the World: Duel is a 2-player game that builds on some of the core concepts of" +
                " the bestselling 7 Wonders of the World, but also offers new challenges specifically tailored for 2-player play. " +
                "The game introduces an innovative way of picking cards before the game - we arrange them according to a given pattern, " +
                "and we are only allowed to pick cards that are not covered by other cards. By choosing one card, we discover another, making" +
                " it available to my opponent, which leads to difficult choices and dilemmas during the game.)",
                Players = "2",
                Time = "30-45 Min",
                Age = 10,
                ImageUrl = "https://files.rebel.pl/products/100/1281/_98221/pojedynek_3d.jpg"
            },
            new BoardGame()
            {
                Name = "Cascadia",
                Publisher = "Lucky Duck Games",
                Description = "Throw yourself into a picturesque land in North America and create a vibrant Cascadia environment." +
                " On your turn, choose a pair of tiles and a token and add them to your expanding ecosystem. Lay out as large an area of" +
                " mountains, rivers or prairie as possible and deploy animals in scoring layouts. Despite the very simple 'pick" +
                " and place' rules, the game offers interesting decisions and great depth of gameplay." +
                " Thanks to the modular board and variable objectives, each game will be different and will also appeal to advanced players." +
                " Cascadia includes several game modes including a solo and family variant, making it easily adaptable to the age, sophistication" +
                " and number of players. Thanks to the achievement system and scenarios, each successive game will be just as interesting, " +
                "presenting new challenges for players.",
                Players = "1-4",
                Time = "30-45 Min",
                Age = 10,
                ImageUrl = "https://files.rebel.pl/products/1065/5759/_2006299/Cascadia_3Dbox_PL.png"
            },
            new BoardGame()
            {
                Name = "Spirit Island",
                Publisher = "Lacerta",
                Description = "Since time immemorial, powerful spirits have lived on an isolated island." +
                " They are an integral part of the natural world, as well as something above it." +
                " The Dahans - the island's indigenous inhabitants - live in harmony with the spirits and respect them, but approach their actions" +
                " with a certain amount of caution. Unfortunately, invaders from distant lands have appeared on the island and are upsetting the" +
                " natural balance, destroying the spirits' presence and everything else in their path. As spirits, you must join forces and drive" +
                " the invaders off the island... before it's too late! Spirit Island is a co-operative title for advanced players." +
                " Players work together to save the island from invaders using the abilities and special powers of the spirits they play as." +
                " The basic game includes eight ghosts to choose from. Each is characterised by a different level of complexity, has differen" +
                "t powers and requires different playing styles from players. In addition, the game allows the difficulty level to be increased" +
                " by using one of the four available scenarios or selecting a specific opponent.",
                Players = "1-4",
                Time = "90-120 Min",
                Age = 13,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2000658/spirit_island_3d.jpg"
            },
            new BoardGame()
            {
                Name = "Ankh: Gods of Egypt",
                Publisher = "Portal Games",
                Description = "There used to be many gods reigning in Egypt. But those days are gone. There cannot be enough glory for everyone." +
                " The figures of those whose names are spoken rarely dwindle and fall into oblivion. Only a few remain in the Egyptian pantheon." +
                " They are the ones who will stand up to fight for power over the multitude of souls. Ankh: Gods of Egypt is an advanced," +
                " strategic board game by the brilliant Eric M. Lang (Cthulhu: Death May Die, Blodboorne), and is the conclusion of his ancient trilogy" +
                ", which also includes Blood Rage and Rising Sun. After Viking Scandinavia and feudal Japan, it's time for ancient Egypt! " +
                "Take on the role of one of the five Egyptian gods and lead a dedicated army to ultimate rule in the land on the Nile. " +
                "Develop your character, gain valuable allies and fight for more followers. Only they can ensure your survival and make your name immortal." +
                " When the battle dust settles, only one god will be remembered in Egypt.",
                Players = "2-5",
                Time = "90 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/371/_2007597/Ankh-bogowie-egiptu-pudelko.jpg"
            },
            new BoardGame()
            {
                Name = "Root",
                Publisher = "Portal Games",
                Description = "The wicked Marquise de Kot rules the great forest with a firm hand. Under her rule, " +
                "the forest creatures form factions, gather resources and prepare to overthrow his rule. In the midst of " +
                "the forest glades, the scent of rebellion is palpable, a war against the oppressor that could break out at the " +
                "most unexpected moment. The stage is ready, the actors know their roles. The time has now come to decide the " +
                "fate of the Forest Polan. It is up to you to decide which group will ultimately take root in Forest Garden for ever." +
                " Root is a dynamic game telling the story of the war for influence in the Great Forest. Players take control of one " +
                "of four factions vying to seize power and prove that its representatives are the rightful rulers of the vast Forest.",
                Players = "2-4",
                Time = "60-90 Min",
                Age = 10,
                ImageUrl = "https://files.rebel.pl/products/100/302/_110788/www.portalgames.pl-root-1625.png"
            },
            new BoardGame()
            {
                Name = "Witchstone",
                Publisher = "Rebel",
                Description = "Once every 100 years, prominent witches and accomplished wizards gather in a remote corner of the world," +
                " the location of which is a closely guarded secret. They meet to renew the web of energy produced by the legendary Witch Rock." +
                " Secret spells and rituals allow them to preserve and enhance their own powers, and whoever demonstrates the greatest proficiency" +
                " in magic will secure immense energy and prestige for the next 100 years until the next gathering. Witch Rock is a board game in which" +
                " you take on the role of learned guild masters gathered around an ancient sacred stone. Each person occupies 1 of the 4 towers and " +
                "starts the game from there. Prepare spells in your cauldrons and create a network of magical energy around the Witch Rock. Send out " +
                "your witches, fish out magic crystals from your cauldrons and make good use of your pentagram and magic wands. However, don't forget " +
                "your predictions if you want to ensure victory! Not all opportunities are always available, so you have to use the opportunities that " +
                "come your way wisely. After 11 rounds, the one of you who accumulates the most victory points will win the game and become the Chosen " +
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
                Description = "Robinson Crusoe: Adventure on a Cursed Island is Portal's big game. This time you are kidnapped to a " +
                "deserted island and thrown into a whirlwind of extraordinary adventures that will happen to a group of castaways! " +
                "You will build a shawl, a palisade, weapons, you will create items, you will try to do your best to... to survive. " +
                "You will search for food, fight beasts, protect yourself from bad weather.... " +
                "Take on the role of one of the four members of the ship's crew (cook, carpenter, explorer or soldier) and face the adventure. " +
                "Use your abilities to help your companions, discuss a plan of action and put it into action! " +
                "Search for treasures. Discover the secrets of the island. Achieve the objectives of one of six exciting scenarios. " +
                "Start by building and setting fire to a woodpile to summon help, then move on to more adventures. " +
                "Become exorcists on a cursed island. Become treasure hunters on an island of volcanoes. " +
                "Take on the role of rescuers and rescue a beautiful lady who is stranded on a lonely rock far from shore....",
                Players = "1-4",
                Time = "60-120 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/1379/_24428/portal-games-kooperacyjna-robinson-crusoe-nowa-edycja-box-.png"
            }

        };

        return boardGames;
    }
}

