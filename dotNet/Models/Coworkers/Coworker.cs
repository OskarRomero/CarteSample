using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Coworkers
{
    public class Coworker
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Height { get; set; }
        public CoworkerImage PrimaryImageCo { get; set; }//prop name doesn't have to match name of proc or table
        public List<Talent> Talents { get; set; }
        public DateTime DateAdded { get; set; }




    }
}
