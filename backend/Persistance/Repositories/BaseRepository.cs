using Domain.IRepositories;
using Persistance.Data;

namespace Persistance.Repositories;
public abstract class BaseRepository<T> : IBaseRepository<T> where T : class
{
    private readonly AppDbContext AppDbContext;

    public BaseRepository(AppDbContext appDbContext)
    {
        AppDbContext = appDbContext;
    }

    public async Task CreateAsync(T entity)
    {
        AppDbContext.Set<T>().Add(entity);
        await AppDbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        AppDbContext.Set<T>().Remove(entity);
        await AppDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(T entity)
    {
        AppDbContext.Set<T>().Update(entity);
        await AppDbContext.SaveChangesAsync();
    }
}
