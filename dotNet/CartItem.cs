using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class CartItem
    {
        public int Id { get; set; }
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
        public string MenuItemName { get; set; }
        public string MenuItemDescription { get; set; }
        public string ImageUrl { get; set; }
        public decimal UnitCost { get; set; }
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public int LocationId { get; set; }
        public string LocationZip { get; set; }
        public List<IngredientWithWarningRestriction> Ingredients { get; set; }
        public List<LookUp> FoodSafeTypes { get; set; }     
    }
}