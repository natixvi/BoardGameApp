namespace Domain.Exceptions;
public class DuplicateUserDataException : Exception
{
    public DuplicateUserDataException(string message) : base(message){}
}
