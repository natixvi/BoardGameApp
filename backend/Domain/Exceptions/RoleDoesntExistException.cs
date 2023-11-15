namespace Domain.Exceptions;
public class RoleDoesntExistException: Exception
{
    public RoleDoesntExistException(string message) : base(message)
    {
        
    }
}
