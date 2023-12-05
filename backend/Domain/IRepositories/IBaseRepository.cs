namespace Domain.IRepositories;
public interface IBaseRepository<T>
{
/*    Task CreateAsync(T entity);*/
    Task Delete(T entity);
    Task Update(T entity);
}
