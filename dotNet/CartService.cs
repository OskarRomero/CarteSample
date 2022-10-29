using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class CartService : ICartService
    {
        IDataProvider _data = null;

        public CartService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(CartAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[Cart_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    col.Add(idOut);
                },
               returnParameters: delegate (SqlParameterCollection returnCollection)
               {
                   object old = returnCollection["@Id"].Value;
                   int.TryParse(old.ToString(), out id);
                   Console.WriteLine("");
               });
            return id;
        }

        public Cart GetCartById(int id)//GetById - make proc fit this service or make model fit this service and proc
        {
            string procname = "[dbo].[Cart_Select_ById]";
            Cart cartItem = null;
            _data.ExecuteCmd(procname, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                cartItem = MapCartItemById(reader, ref startingIndex);
            }
            );
            return cartItem;
        }

        public List<CartItem> GetAllByCreatedBy(int createdById)
        {
            List<CartItem> list = null;
            string procname = "[dbo].[Cart_Select_ByCreatedBy]";

            _data.ExecuteCmd(procname, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CreatedBy", createdById);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                CartItem cartItem = MapSingleCartItem(reader, ref startingIndex);
                if (list == null)
                {
                    list = new List<CartItem>();
                }
                list.Add(cartItem);
            });
            return list;
        }

        public void DeleteById(int cartItemId)
        {
            string procName = "[dbo].[Cart_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", cartItemId);
            }, returnParameters: null);
        }//DeleteById

        public void DeleteByCreatedBy(int createdById)
        {
            string procName = "Cart_DeleteBy_CreatedBy";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@CreatedBy", createdById);
            }, returnParameters: null);
        }

        public void UpdateCart(CartUpdateRequest model)//Update
        {
            string procName = "[dbo].[Cart_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);


            }, returnParameters: null);
        }

        public List<CartPreview> GetRandomMenuItems()
        {
        List<CartPreview> list = null;
        string procName = "[dbo].[Cart_SelectAll_MenuItems]";
            _data.ExecuteCmd(procName, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    CartPreview cartPreview = MapSingleCartPreview(reader);
                    if (list ==null)
                    {
                        list = new List<CartPreview>();
                    }
                    list.Add(cartPreview);
                }
                );
            return list;
        }



        private static void AddCommonParams(CartAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@MenuItemId", model.MenuItemId);
            col.AddWithValue("@Quantity", model.Quantity);
            col.AddWithValue("@CreatedBy", model.CreatedBy);
            col.AddWithValue("@ModifiedBy", model.ModifiedBy);
        }

        private static CartItem MapSingleCartItem(IDataReader reader, ref int startingIndex)
        {
            CartItem cartItem = new CartItem();
            cartItem.Id = reader.GetSafeInt32(startingIndex++);
            cartItem.MenuItemId = reader.GetSafeInt32(startingIndex++);
            cartItem.Quantity = reader.GetSafeInt32(startingIndex++);
            cartItem.MenuItemName = reader.GetSafeString(startingIndex++);
            cartItem.MenuItemDescription = reader.GetSafeString(startingIndex++);
            cartItem.ImageUrl = reader.GetSafeString(startingIndex++);
            cartItem.UnitCost = reader.GetSafeDecimal(startingIndex++);
            cartItem.OrganizationId = reader.GetSafeInt32(startingIndex++);
            cartItem.OrganizationName = reader.GetSafeString(startingIndex++);
            cartItem.LocationId = reader.GetSafeInt32(startingIndex++);
            cartItem.LocationZip = reader.GetSafeString(startingIndex++);
            cartItem.Ingredients = reader.DeserializeObject<List<IngredientWithWarningRestriction>>(startingIndex++);
            cartItem.FoodSafeTypes = reader.DeserializeObject<List<LookUp>>(startingIndex++);

            return cartItem;
        }

        private static Cart MapCartItemById(IDataReader reader, ref int startingIndex)
        {
            Cart cartItem = new Cart();


            cartItem.Id = reader.GetSafeInt32(startingIndex++);
            cartItem.MenuItemId = reader.GetSafeInt32(startingIndex++);
            cartItem.Quantity = reader.GetSafeInt32(startingIndex++);
            cartItem.CreatedBy = reader.GetSafeInt32(startingIndex++);
            cartItem.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            cartItem.DateCreated = reader.GetDateTime(startingIndex);
            cartItem.DateModified = reader.GetDateTime(startingIndex);

            return cartItem;

        }

        private static CartPreview MapSingleCartPreview(IDataReader reader)
        {
            CartPreview previewModel = new CartPreview();

            int index = 0;
            previewModel.Id = reader.GetSafeInt32(index++);
            previewModel.MenuItemName = reader.GetSafeString(index++);
            previewModel.Description = reader.GetSafeString(index++);
            previewModel.ImageUrl = reader.GetSafeString(index++);
            previewModel.UnitCost = reader.GetSafeDecimal(index++);
            previewModel.OrganizationId = reader.GetSafeInt32(index++);
            previewModel.OrganizationName = reader.GetSafeString(index++);

            return previewModel;
        }





    }
}
