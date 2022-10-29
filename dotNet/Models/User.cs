using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Users
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
        public string TenantId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        //public string Password { get; set; }
    }
}
//ALTER proc[dbo].[Users_SelectById]
//@Id int

//as

///*
//Declare @Id int = 7;
//Execute dbo.Users_SelectById @Id

//*/

//BEGIN


//    SELECT[Id]
//      ,[FirstName]
//      ,[LastName]
//      ,[Email]
//      ,[AvatarUrl]
//--,[Password]
//      ,[TenantId]
//      ,[DateCreated]
//      ,[DateModified]
//FROM[dbo].[Users]
//  Where Id = @Id

//END