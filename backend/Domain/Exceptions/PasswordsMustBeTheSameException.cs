namespace Domain.Exceptions;
public  class PasswordsMustBeTheSameException : Exception
{
    public PasswordsMustBeTheSameException(string message) : base(message){}
}
