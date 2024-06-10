using Domain.Entities;
using Microsoft.AspNetCore.Identity;
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
            /*var pendingMigrations = context.Database.GetPendingMigrations(); 

            if (pendingMigrations != null && pendingMigrations.Any())
            {
                context.Database.Migrate();
            }
*/
            if (!context.Roles.Any()) 
            {
               /* context.Database.OpenConnection();
                context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Roles ON");*/

                var roles = GetRoles();
                context.Roles.AddRange(roles);
                context.SaveChanges();

          /*      context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Roles OFF");
                context.Database.CloseConnection();*/

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
            },
            new BoardGame()
            {
                Name = "Splendor",
                Publisher = "Rebel",
                Description = "Splendor is a dynamic and almost addictive game of collecting tokens and cards that create player resources " +
                "for further development. Players take on the role of Renaissance merchants trying to acquire gem mines, means of transport, " +
                "shops - all with the aim of gaining as much prestige as possible. Once you are rich enough, you may be honoured with a visit " +
                "from a representative of the nobility, which will further increase your prestige in the eyes of the competition. ",
                Players = "2-4",
                Time = "30 Min",
                Age = 10,
                ImageUrl = "https://files.rebel.pl/products/100/606/_28615/rebel_gra_rodzinna_splendor_new_3d_okladka.png"
            },
             new BoardGame()
            {
                Name = "Nucleum",
                Publisher = "Rebel",
                Description = "Nucleum is a complex game of industrial network expansion that requires planning " +
                "and reacting to the dynamically changing situation on the map. Each turn a player plays an action tile on " +
                "their board or map, or carries out a recharge. Combine cities to erect and power buildings using nucleum and" +
                " uranium from the mines you build. Complete contracts and invent new technologies, leading your unique faction " +
                "to success and satisfying the king's ambitions. Become the best industrialist in the new era!",
                Players = "1-4",
                Time = "60-150 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2017799/rebel-gra-strategiczna-nucleum-box3d.png"
            },
            new BoardGame()
            {
                Name = "Terraforming Mars",
                Publisher = "Rebel",
                Description = "In Terraformation of Mars, the player will take control of one corporation and, as its board of directors, " +
                "will buy and play cards describing various investment projects." +
                "Typically, the projects will directly or indirectly contribute to the terraforming process, " +
                "but they may also be business ventures of other types. To win, a player must achieve a high Terraformation Factor " +
                "(WT) and earn a lot of Victory Points (VPs). A player's WT increases each time he raises one of the Global Indicators " +
                "(Temperature, Oxygen level or number of Oceans). The player's base income depends on the WT, as well as his base score. " +
                "As the terraforming process progresses, players will be able to complete more and more projects. Additional VPs " +
                "can be earned for anything that contributes to humanity's dominion over the Solar System, such as establishing cities, " +
                "building infrastructure or protecting the environment.",
                Players = "1-5",
                Time = "90-120 Min",
                Age = 12,
                ImageUrl = "https://files.rebel.pl/products/108/5438/_99856/box_3d_TerraformacjaMarsa_podstawka.jpg"
            },
            new BoardGame()
            {
                Name = "Frostpunk: The Board Game",
                Publisher = "Rebel",
                Description = "Frostpunk is a strategy board game in which one to four players take on the role of " +
                "leaders of the last colony of survivors in a post-apocalyptic, ice-covered world. Our role is to " +
                "manage both the infrastructure of the last city and its inhabitants, and to continually juggle between " +
                "the prospect of icy destruction and rebellion. Our citizens are not just mute pawns on the board: they will " +
                "make demands and react according to the prevailing mood. The actions and decisions of the players will have " +
                "significant consequences for the gameplay, each time creating a unique, mature story.",
                Players = "1-4",
                Time = "120-150 Min",
                Age = 18,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2001392/rebel-gra-strategiczna-frostpunk-box-3d-pl.png"
            },
            new BoardGame()
            {
                Name = "Abyss",
                Publisher = "Rebel",
                Description = "In Abyss, players try to take control of strategic areas of an underwater city. " +
                "To achieve this, players must progress in three ways. Firstly, they must gather allies, then use them to" +
                " recruit Lords of the Abyss, which will give them access to different areas of the city. Players gain ally" +
                " cards by purchasing them during Exploring the Deep in each player's turn. Gaining the considerations of each " +
                "Lord requires a specific set of cards.",
                Players = "2-4",
                Time = "45 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/303/_29526/abyss_3d.jpg"
            },
            new BoardGame()
            {
                Name = "Tiletum",
                Publisher = "Rebel",
                Description = "Take on the role of a wealthy merchant who wants to multiply his wealth and gain influence and recognition. " +
                "To achieve this, you will travel across the continent, and in the cities you visit, you will build trading posts and take " +
                "part in the construction of magnificent cathedrals. You will meet influential personalities and win their favour, and the " +
                "abilities they represent will give you an edge over your competitors. Tiletum is a strategic board game based on the mechanics " +
                "of managing dice, which have a double function: they provide goods and allow you to perform actions. It perfectly combines " +
                "simplicity of rules and depth of planning, and the number of variables makes successive games a new and interesting challenge.",
                Players = "1-4",
                Time = "60-100 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2009480/rebel-gra-strategiczna-tiletum-box3d.jpg"
            },
              new BoardGame()
            {
                Name = "Through the Ages: A New Story of Civilization (2015)",
                Publisher = "Rebel",
                Description = "Civilisation: Through the Ages is the latest edition of the worldwide hit, a game that has made" +
                " its way into the world of board games. It is a board game with strong references to the legendary computer game" +
                " Sid Meier's Civilization. Fans of this title as well as fans of good, strategic board games will find here everything" +
                " they are looking for in a game about the development of civilisation.",
                Players = "2-4",
                Time = "180-240 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/302/_98546/rebel-gra-strategiczna-cywilizacja-poprzez-wieki-box.jpg"
            },
            new BoardGame()
            {
                Name = "Paris: La Cité de la Lumière",
                Publisher = "Lacerta",
                Description = "Paris, 1889: the World Exhibition is a great opportunity to enchant the world with the power of " +
                "electricity. Since the beginning of the century, Paris had already been known as the 'city of lights', thanks to " +
                "its well-functioning network of gas lamps. The arrival of electric street lighting in the city, however, will bring " +
                "the world to its senses. In the game, you will take on the role of one of the most prominent people in the city. To " +
                "guarantee your success, you must ensure that the buildings you erect are bathed in as much street light as possible." +
                "Inspire artists and surprise Parisians and visitors alike with the beauty and magic of the new city lights!",
                Players = "2",
                Time = "30 Min",
                Age = 8,
                ImageUrl = "https://files.rebel.pl/products/1065/5755/_116423/paryz-miasto-swiatel-3d.jpg"
            },
            new BoardGame()
            {
                Name = "Dungeon Lords",
                Publisher = "Lacerta",
                Description = "Lords of the Underworld is a re-release of the cult strategy game full of humour and wicked ploys. " +
                "Participants take on the role of young stewards who apply for an official licence granted by the Ministry of the Underworld. " +
                "During their probationary period, they will be digging tunnels, mining gold, hiring monsters, creating traps and dealing with " +
                "all the things that are needed in a decent underworld. It's not an easy task, as the competition doesn't sleep and the heroes " +
                "are just waiting to get in our way.",
                Players = "2-4",
                Time = "90 Min",
                Age = 12,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2012618/gra_rebel_wladcypodziemi_box_3d.png"
            },
            new BoardGame()
            {
                Name = "Anno 1800",
                Publisher = "Galakta",
                Description = "Develop your home island and give it access to new industries. However, you'll have to plan your every move in advance" +
                " - the competition doesn't sleep! Will you be able to obtain the necessary raw materials, unlock the secrets of the Old World and " +
                "embark on more than one expedition to discover the islands of the New World? Acquire farmers, workers, craftsmen, engineers and " +
                "even investors to make your island a real powerhouse! In Anno 1800 - the board game, players expand their own islands, " +
                "where they construct new buildings and ships and develop trade opportunities. At the same time, they must meet the needs of " +
                "the island's population and complete important missions. The one with the most influence points at the end of the game will be the winner!",
                Players = "2-4",
                Time = "120 Min",
                Age = 12,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2003242/anno_1800-box.png"
            },
            new BoardGame()
            {
                Name = "Caylus 1303",
                Publisher = "Rebel",
                Description = "1303. The war with England is over, but the province of Guyenne is still under English rule. " +
                "Located right on the border, Caylus Castle is in need of fortification and modernisation. You, as the master builder, are " +
                "responsible for supplying materials, food and manpower so that the construction brings the best results in the shortest possible " +
                "time. To achieve your goal, you will construct buildings and recruit skilled workers, as well as manage them to be as efficient " +
                "as possible. Their work can bring you glory and prestige! Caylus 1303 is a classic board game based on the mechanics of allocating " +
                "workers. During the game, you take on the role of builders who compete for the king's favour by developing individual provinces. " +
                "In a series of 9 rounds, players will accumulate prestige points, received for developing a city and supporting the construction " +
                "of a Caylus castle. Whoever earns the most of these wins.",
                Players = "2-5",
                Time = "60-90 Min",
                Age = 10,
                ImageUrl = "https://files.rebel.pl/products/100/302/_111990/rebel_caylus_1303_gra_ekonomiczna_okladka_3D.png"
            },
            new BoardGame()
            {
                Name = "Aeon's End",
                Publisher = "Portal Games",
                Description = "Aeon's End is a co-operative card game based on a deck-building mechanic in which cards are not" +
                " shuffled at any stage and the variable order of players' turns simulates the chaos of battle. Players make " +
                "meaningful decisions by managing their deck. During each playthrough, you will face a different enemy, each" +
                " with a unique set of skills, forcing players to use different tactics to defeat them. In Aeon's End you will " +
                "take on the role of a powerful Gate Mage. A multitude of spell and artefact combinations, the ability to play solo " +
                "and in groups of up to four, and unique character abilities ensure immense replayability.",
                Players = "1-4",
                Time = "60 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/302/_107977/kooperacyjne-portal-games-Aeons-End.png"
            },
            new BoardGame()
            {
                Name = "The Quacks of Quedlinburg",
                Publisher = "G3",
                Description = "Once a year, for nine days, the market in Pasikurowice opens its doors. The best quacks and charlatans " +
                "from all over the country come together to present their healing concoctions. Hiccups, stinky feet, homesickness, unhappy " +
                "love - they have a cure for everything. They all outdo each other in brewing their potions. The Charlatans of Pasikurowice " +
                "is a light-hearted, yet more complex board game about potion-making for 2 to 4 players from 10 years old. The game is a colourful, " +
                "simple but original title, all thanks to the various variation. Players playing as charlatans select ingredients from their bags " +
                "and add them to the cauldron. They do this until they think the potion is ready. They must be careful, however, because if they " +
                "add too much of a special ingredient, the cauldron will explode! The key, then, is to find the right moment to stop adding ingredients. " +
                "A good strategy may be to start with less complicated potions to earn points and coins with which to buy new ingredients. " +
                "Buy the most valuable ingredients, a bit of luck and your next potion could be the best of the ones brewed by all the quacks across the country.",
                Players = "2-4",
                Time = "45 Min",
                Age = 10,
                ImageUrl = "https://files.rebel.pl/products/100/_109620/g3-familijne-Szarlatani-z-Pasikurowic-pudelko.jpg"
            },
            new BoardGame()
            {
                Name = "Revive",
                Publisher = "Rebel",
                Description = "5000 years ago, civilisation was almost completely destroyed. The few surviving tribes are trying to gain access " +
                "to ancient technologies to use in their daily lives. Uncover the secrets of the past and encourage others to join you. Every choice " +
                "you make will affect the fate of a reborn Earth! Revive is an engaging, strategic board game in which you take on the role of leader " +
                "of 1 of 6 tribes, each with unique knowledge and abilities. To win, you'll explore the land, build machines and recruit new tribe members " +
                "to build the greatest civilisation. In the 5-part campaign, you will discover additional elements of the game to ultimately enjoy a complex" +
                " and multifaceted board game.",
                Players = "1-4",
                Time = "90-120 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2016179/rebel-gra-strategiczna-revive-box3d.jpg"
            },
            new BoardGame()
            {
                Name = "Hero Realms",
                Publisher = "IUVI Games",
                Description = "Hero Realms, a game from the creators of the wildly popular and award-winning Star Realms, " +
                "combines the fun of deckbuilding with the interactivity of combat characteristic of collectible card games - " +
                "all wrapped up in atmospheric graphics in a 'high fantasy' atmosphere. What is it all about? The game begins " +
                "with a deck of 10 cards with gold (needed to expand the deck with new items) and several weapons. Every turn, " +
                "you draw a hand of five cards from the deck, buy new cards, adding them to the discard pile, which you shuffle " +
                "into the deck after drawing the last card from it. In the middle of the table is the market deck. The five cards " +
                "on it show what goods are available to each player at any given time. From here, we will acquire champions, action " +
                "and equipment cards to accumulate even more gold and crush the competition. There can only be one winner!",
                Players = "2-4",
                Time = "20 Min",
                Age = 12,
                ImageUrl = "https://files.rebel.pl/products/100/606/_107003/Her-realms-pudelko.png"
            },
            new BoardGame()
            {
                Name = "Chronicles of Avel",
                Publisher = "Rebel",
                Description = "Welcome to Avel: a world where dozens of moons hang in the sky day and night. " +
                "These magical celestial bodies - said to be inhabited by gods - send magical gifts to the inhabitants. " +
                "Thanks to them, wizards weave magic, druids help farmers take care of the crops and children can play in the overhead streams. " +
                "But there is no time for this now, for Kurodar, the Black Moon, has approached Avel and his sinister magic has awoken the forces of evil. " +
                "Dangerous creatures have always lurked in forests, caves and other dark places, but now they have come out in droves, their hate-filled " +
                "gaze focused on the castle. It is up to you to save the land from their destructive urges! Avel Castle Chronicles is a cooperative board " +
                "game for the whole family, where you take on the roles of heroes and heroines responsible for saving the magical land. During the gameplay," +
                " we will create our own characters with unique names and special equipment, and then explore the world as we move around the modular board. " +
                "During the journey we will encounter many dangers that we will have to fight against, and each victory will bring us a specific reward: " +
                "new weapons, armour, potions and gold. The accumulated goods will allow us to prepare for the final clash with the Monstrum, which threatens " +
                "the kingdom of Avel.",
                Players = "1-4",
                Time = "60-90 Min",
                Age = 8,
                ImageUrl = "https://files.rebel.pl/products/100/606/_2004904/rebel-gra-rodzinna-kroniki-zamku-avel-box3d.png"
            },
            new BoardGame()
            {
                Name = "The Witcher: Old World",
                Publisher = "Go On Board, Games Lab, Rebel",
                Description = "Take on the role of a professional monster killer and immerse yourself in the legendary world known from the Witcher universe!" +
                " Witcher: Old World is an adventure board game that takes players on a journey through a fantastic world full of dangers, arcane magic, " +
                "dark secrets and extraordinary places just waiting to be discovered. The game takes place in the Witcher universe, beloved by fans, many " +
                "years before the events of the Geralt of Rivia saga, at a time when a plague of monsters was ravaging the Continent. Only witchers were able" +
                " to counteract it - professional assassins trained to fight creatures hostile to humans.",
                Players = "1-5",
                Time = "90-150 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/371/_2003251/Witcher-old-world-3D.png"
            },
            new BoardGame()
            {
                Name = "Dune: Imperium",
                Publisher = "Lucky Duck Games",
                Description = "Arrakis. Dune. Desert planet. Command one of the high houses of the Landsraad. Raise your banner over the vast " +
                "wasteland and send your warriors and spies into action. Who will you form an alliance with and who will you betray? The ruthless " +
                "Emperor, the mysterious Bene Gesserit, the clever Space Guild and the wild Fremen are waiting for you. Power over the empire may " +
                "be yours, and war is not the only way to gain it. Dune: Empire is a strategy game that combines the mechanics of building a deck " +
                "and placing forces on the board (worker placement). It's up to you how you expand your power. Will you seek political alliances or " +
                "create a military advantage? The power of economics or subtle intrigue? A seat on the council... or a sharp blade? The choice is yours. " +
                "The Empire awaits. A game using elements and characters taken from the Dune universe, both from the latest Legendary Pictures film and a" +
                " series of novels by Frank Herbert, Brian Herbert and Kevin J. Anderson.",
                Players = "1-4",
                Time = "60-120 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2004554/Diuna-3D-box-PL.png?_gl=1*5daw6a*_up*MQ..&gclid=CjwKCAjwyJqzBhBaEiwAWDRJVLF1E38vy4vG8D1fAVBjZU9O-yzsPaXZ1aFN2z_hrWgkJxFRFXjinRoCUXoQAvD_BwE"
            },
            new BoardGame()
            {
                Name = "Alchemists",
                Publisher = "Rebel",
                Description = "Today I got my new cauldron. Finally my lab is ready! I spent days collecting and drying ingredients waiting for this moment. " +
                "What should I mix first? I have a good feeling about the raven feather and mandrake root. And apparently a toad goes with everything. " +
                "But then again, what do others know? This is my laboratory and my research! When I publish my theories, everyone will come to me! " +
                "I will prove to them that I am the greatest mind exploring the secrets of alchemy. Okay, time to light the fire and get to work. " +
                "In the murky depths of the cauldron you can find knowledge, wealth and fame. Two to four players take on the role of competing alchemists " +
                "seeking to discover the secrets of this arcane art. You can earn points in various ways, but you get the most points for publishing theories - " +
                "correct theories, it is worth adding. And therein lies the problem. Players gain knowledge by mixing ingredients and checking the results " +
                "using a card-scanning app on a tablet or smartphone. They deduce how to prepare potions that they can sell to adventurers. " +
                "They can spend the gold they earn on magical artifacts, which are very powerful, but also very expensive. We publish theories, " +
                "ridicule and refute opponents' theses, and struggle with challenges that make turning lead into gold a breeze! When players' " +
                "theories are published or rejected, their reputations go up and down. At the end of the game, reputation is converted into victory points. " +
                "Points are also awarded for artifacts and scholarships. The player with the most points wins.",
                Players = "2-4",
                Time = "120 Min",
                Age = 13,
                ImageUrl = "https://files.rebel.pl/products/100/302/_97006/Gra-planszowa-rebel-alchemicy-okladka.jpg?_gl=1*wxfpgp*_up*MQ..&gclid=CjwKCAjwyJqzBhBaEiwAWDRJVLF1E38vy4vG8D1fAVBjZU9O-yzsPaXZ1aFN2z_hrWgkJxFRFXjinRoCUXoQAvD_BwE"
            },
            new BoardGame()
            {
                Name = "Clank!: Catacombs",
                Publisher = "Lucrum Games",
                Description = "Say goodbye to the boards in one piece and create your own dungeons in the next stand-alone game in the series - " +
                "Clank! Catacombs! The catacombs are full of secrets waiting to be discovered. Portals lead to the darkest corners of the underground, " +
                "altars tempt with the prospect of mammon's blessing, and prisoners hope to regain their freedom. Of course, all these prospects are " +
                "accompanied by an appropriate dose of danger. Disturbed ghosts can haunt you until the end (yours or the game's), and of course there " +
                "is the dragon. Extremely nasty because he's undead. Each expedition into the catacombs is unique because their layout is created during " +
                "the game from randomly selected tiles. In the box you will find completely new cards, but you can also add those from previous installments " +
                "of the Clank series!",
                Players = "2-4",
                Time = "45-90 Min",
                Age = 13,
                ImageUrl = "https://files.rebel.pl/products/1065/5759/_2018496/brzdek-katakumby-pudelko-3d.jpg?_gl=1*vq6dg4*_up*MQ..&gclid=CjwKCAjwyJqzBhBaEiwAWDRJVLF1E38vy4vG8D1fAVBjZU9O-yzsPaXZ1aFN2z_hrWgkJxFRFXjinRoCUXoQAvD_BwE"
            },
            new BoardGame()
            {
                Name = "Ark Nova",
                Publisher = "Portal Games",
                Description = "In Ark Nova, you plan and build a modern, scientifically managed zoo. You prepare enclosures adapted to the animals' " +
                "lifestyle and support nature conservation projects to ensure the survival of rare species. A variety of animals increases the attractiveness " +
                "of your zoo and generates higher income. By carefully caring for your animals, you support breeding programs and other conservation projects " +
                "and earn appropriate bonuses. The markers on the attraction and nature protection tracks move in opposite directions - when one player's markers" +
                " meet, the game ends. The player who achieves the best combination of attractiveness and support for conservation has built the most successful " +
                "Zoo and wins the game. Activities for the association allow for cooperation with the Zoo and universities around the world. " +
                "Together with specialists and with the support of sponsors, they will help you manage the various tasks needed to achieve your goals. " +
                "The game won in the Best Board Game and Best Solo Game categories at the Board Game Prix 2023.",
                Players = "1-4",
                Time = "90-150 Min",
                Age = 14,
                ImageUrl = "https://files.rebel.pl/products/100/302/_2009674/Ark_Nova_3Dbox.png?_gl=1*zbbwer*_up*MQ..&gclid=CjwKCAjwyJqzBhBaEiwAWDRJVLF1E38vy4vG8D1fAVBjZU9O-yzsPaXZ1aFN2z_hrWgkJxFRFXjinRoCUXoQAvD_BwE"
            }
        };

        return boardGames;
    }
}

