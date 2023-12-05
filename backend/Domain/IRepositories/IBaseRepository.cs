namespace Domain.IRepositories;
public interface IBaseRepository<T>
{
/*    Task CreateAsync(T entity);*/
    Task DeleteAsync(T entity);
    Task UpdateAsync(T entity);
}
