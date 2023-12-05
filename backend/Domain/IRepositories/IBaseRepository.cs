namespace Domain.IRepositories;
public interface IBaseRepository<T>
{
    Task Delete(T entity);
    Task Update(T entity);
}
