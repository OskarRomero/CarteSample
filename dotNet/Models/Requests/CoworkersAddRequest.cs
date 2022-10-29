using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Coworkers
{
    public class CoworkersAddRequest: CoworkersImageAddRequest
    {
        [Required(ErrorMessage = "There should be at least 2 characters in length.")]
        [StringLength(100, MinimumLength =2)]
        public string Name { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "Only Positive integer allowed")]
        public int Height { get; set; }
        [Required(ErrorMessage = "There should be at least 2 characters in length.")]
        [StringLength (100, MinimumLength = 2)]
        public int PrimaryImgId { get; set; }
        //SHOULD INHERIT PROPS FROM CoworkersImageAddRequest
    }
}
