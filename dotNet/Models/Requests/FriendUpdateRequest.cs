using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Friends
{
    public class FriendUpdateRequest : FriendAddRequest
    {
        //public string Title { get; set; }
        //public string Bio { get; set; }
        //public string Summary { get; set; }
        //public string Headline { get; set; }
        //public string Slug { get; set; }
        //public int StatusId { get; set; }
        //public string PrimaryImageUrl { get; set; }
        public int Id { get; set; }
    }
}
//BEGIN

//	Declare @datNow datetime2 = getutcdate();

//UPDATE[dbo].[Friends]
//		   SET[Title] = @Title
//			  ,[Bio] = @Bio
//			  ,[Summary] = @Summary
//			  ,[Headline] = @Headline
//			  ,[Slug] = @Slug
//			  ,[StatusId] = @StatusId
//			  ,[PrimaryImageUrl] = @PrimaryImageUrl
//			  ,[DateModified] = @datNow
//			  ,[UserId] = @UserId

//			  Where Id = 6

//END