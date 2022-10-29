using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface ICartService
    {
        int Add(CartAddRequest model);
        public Cart GetCartById(int id);
        public List<CartItem> GetAllByCreatedBy(int createdById);

        public void DeleteById(int cartItemId);
        public void DeleteByCreatedBy(int createdById);

        public void UpdateCart(CartUpdateRequest model);

        public List<CartPreview> GetRandomMenuItems();

    }
}