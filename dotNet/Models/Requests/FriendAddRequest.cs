using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Friends
{
    public class FriendAddRequest
    {//Model contains INSERT INTO param columns section of the proc
        [Required(ErrorMessage = "Title should be at least 2 characters in length.")]
        [StringLength(100, MinimumLength =2)]
        public string Title { get; set; }
        [Required(ErrorMessage = "Bio should be at least 2 characters in length.")]
        [StringLength(100, MinimumLength = 2)]
        public string Bio { get; set; }
        [Required(ErrorMessage = "Summary should be at least 2 characters in length.")]
        [StringLength(100, MinimumLength = 2)]
        public string Summary { get; set; }
        [Required(ErrorMessage = "Headline should be at least 2 characters in length.")]
        [StringLength(100, MinimumLength = 2)]
        public string Headline { get; set; }
        [Required(ErrorMessage = "Slug should be at least 2 characters in length.")]
        [StringLength(100, MinimumLength = 2)]
        public string Slug { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "Only positive number allowed")]
        public int StatusId { get; set; }
        [Required(ErrorMessage = "Primary Image Url should be a valid URL.")]
        [StringLength(1000, MinimumLength = 2)]
        public  string PrimaryImageUrl { get; set; }
       // public int UserId { get; set; } 

    }
}
//proc [dbo].[Friends_Insert]
//[dbo].[Friends]
//([Title]
//           ,[Bio]
//           ,[Summary]
//           ,[Headline]
//           ,[Slug]
//           ,[StatusId]
//           ,[PrimaryImageUrl]
//           ,[UserId])