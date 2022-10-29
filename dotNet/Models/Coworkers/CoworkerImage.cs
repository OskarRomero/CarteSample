using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Coworkers
{
    public class CoworkerImage
    {
        public int Id { get; set; }
        public int TypeId { get; set; }
        public string Url { get; set; }
    }
}
