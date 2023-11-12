using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.DTOs.User;
public class LoginDto
{
    [Required]
    public string UserName;
    [Required]
    public string Password;
}
