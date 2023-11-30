using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Persistance.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<BoardGame> BoardGames { get; set; }
    public DbSet<BoardGameReview> BoardGameReviews { get; set; }
    public DbSet<FavouriteGame> FavouriteGames { get; set; }
    public DbSet<FavouriteUser> FavouriteUsers { get; set; }

}

