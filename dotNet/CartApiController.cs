using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartApiController : BaseApiController
    {
        private ICartService _service = null;
        private IAuthenticationService<int> _authService = null;

        public CartApiController(ICartService service,
            ILogger<CartApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(CartAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int id = _service.Add(model);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("{Id:int}")] // SelectById
        public ActionResult<ItemResponse<Cart>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Cart cartItem = _service.GetCartById(id);
                if (cartItem == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }

                else
                {
                    response = new ItemResponse<Cart> { Item = cartItem };
                }

            }
            catch (SqlException sqlEx)
            {
                iCode = 500;
                response = new ErrorResponse($"SqlException Error: ${sqlEx.Message}");
                base.Logger.LogError(sqlEx.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("createdby/{createdById:int}")]
        public ActionResult<ItemsResponse<CartItem>> GetAll(int createdById)//returns ActionResult of Address. ItemsResonse is a type of Address
        {
            int code = 200;
            BaseResponse response = null;//new instance

            try
            {
                List<CartItem> list = _service.GetAllByCreatedBy(createdById);//getting the list

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemsResponse<CartItem> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }



        [HttpDelete("delete/{id:int}")]//DELETE

        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteById(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("checkout")]

        public ActionResult<SuccessResponse> DeleteUserCart()
        {
            int code = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                _service.DeleteByCreatedBy(userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        //UPDATE 
        [HttpPut("{id:int}")]//UPDATE
        public ActionResult<ItemResponse<int>> Update(CartUpdateRequest model)
        {

            _service.UpdateCart(model);

            SuccessResponse response = new SuccessResponse();

            return Ok(response);

        }

        [HttpGet("precart")]
        public ActionResult<ItemsResponse<CartPreview>> GetMenuItems()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<CartPreview> list = _service.GetRandomMenuItems();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemsResponse<CartPreview> { Items = list };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

    }
}
