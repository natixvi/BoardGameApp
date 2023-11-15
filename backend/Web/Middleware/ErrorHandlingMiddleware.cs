using Domain.Exceptions;

namespace Web.Middleware;

public class ErrorHandlingMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next.Invoke(context);
        }
        catch (DuplicateUserDataException)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("Something went wrong!");
        }
        catch ()
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("Something went wrong!");
        }
        catch ()
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("Something went wrong!");
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("Something went wrong!");
        }
    }
}
