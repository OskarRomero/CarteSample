using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Friends;
using Sabio.Models.Requests.Friends;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Data.SqlClient;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/v3/friends")]
    [ApiController]
    public class FriendApiControllerV3 : BaseApiController
    {
        private IFriendService _service = null;
        private IAuthenticationService<int> _authService = null;
        public FriendApiControllerV3(IFriendService service
            ,ILogger<FriendApiControllerV3> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;

        }

        [HttpGet("{id:int}")]//route passed into GetById method/endpoint
        public ActionResult<ItemResponse<FriendV3>> GetById(int id)//will return Address object model
        {
            int iCode = 200;//setup default
            BaseResponse response = null;//setup empty BaseResponse object
            try
            {
                FriendV3 friend = _service.GetV3(id);//if service finds an id, it hydrates the Address mdodel

                if (friend == null)//if service returned null, return set a 404 and response
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }

                else

                {
                    response = new ItemResponse<FriendV3> { Item = friend };//creates new ItemResponse with Address model, set address model response to the Item prop
                }
            }

            catch (SqlException sqlEx)
            {
                iCode = 500;
                response = new ErrorResponse($"SqlException Error: ${sqlEx.Message}");
                base.Logger.LogError(sqlEx.ToString());
            }
            catch (ArgumentException argEx)
            {
                iCode = 500;
                response = new ErrorResponse($"ArgumentException Error: ${argEx.Message}");
            }
            catch (Exception ex)//base implementation of catch
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");

            }

            return StatusCode(iCode, response);

        }


        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<FriendV3>>> PaginationV3(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<FriendV3> paged = _service.PaginationV3(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<FriendV3>> response = new ItemResponse<Paged<FriendV3>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }


        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<FriendV3>>> SearchPaginationV3(int pageIndex, int pageSize, string query)
        {
            ActionResult result = null;
            try
            {
                Paged<FriendV3> paged = _service.SearchPaginationV3(pageIndex, pageSize, query);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<FriendV3>> response = new ItemResponse<Paged<FriendV3>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        //[HttpPost]//as soon as this route is invoked by client, the below class is invoked, Create method is invoked, this case param requests a request model
        //public ActionResult<ItemResponse<int>> Create(FriendAddRequest model)//ActionResults object that handles status return types. A service returns the status//I want ActionResult that has ItemResponse (200,400,500, etc), only returning an int in this case
        //{
        //    ObjectResult result = null;//empty object to be filled depending on response
        //    try
        //    {
        //        int userId = _authService.GetCurrentUserId();//this service will
        //        IUserAuthData user = _authService.GetCurrentUser();

        //        int id = _service.Add(model, user.Id);//Service returns an int

        //        ItemResponse<int> response = new ItemResponse<int>() { Item = id };//ItemResponse object with prop of Item, this case an int was created

        //        result = Created201(response);//object ItemResponse response represents a 201
        //    }
        //    catch (Exception ex)
        //    {
        //        ErrorResponse response = new ErrorResponse(ex.Message);
        //        result = StatusCode(500, response);
        //    }

        //    return result;
        //}

    }
}
