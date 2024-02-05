using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Domain.Enums;

namespace Persistance.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<BoardGame> BoardGames { get; set; }
    public DbSet<BoardGameRequest> AddBoardGameRequests { get; set; }
    public DbSet<UserBoardGame> UserBoardGames { get; set; }
    public DbSet<FavouriteUser> FavouriteUsers { get; set; }
    public DbSet<GameComment> GameComments { get; set; }
    public DbSet<UserRequest> UserRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<UserRequest>()
           .Property(r => r.Status)
           .HasConversion(new EnumToStringConverter<UserRequestStatus>());

        modelBuilder.Entity<FavouriteUser>()
            .HasIndex(f => new { f.UserId, f.FavUserId })
            .IsUnique();
        modelBuilder.Entity<FavouriteUser>()
           .HasIndex(f => new { f.FavUserId, f.UserId })
           .IsUnique();

        modelBuilder.Entity<FavouriteUser>()
            .HasOne(f => f.User)
            .WithMany(u => u.FavouriteUsers)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<FavouriteUser>()
            .HasOne(f => f.FavUser)
            .WithMany()
            .HasForeignKey(f => f.FavUserId)
            .OnDelete(DeleteBehavior.Restrict);
    
}

}

