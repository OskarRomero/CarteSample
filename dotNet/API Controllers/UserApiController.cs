using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Users;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController
    {
        private IUserServiceV1 _service = null;
        private IAuthenticationService<int> _authService = null;

        public UserApiController(IUserServiceV1 service //IAddressService dependency is inserted into the AddressAPIController constructor of this class
           , ILogger<UserApiController> logger//logger+loggerName
           , IAuthenticationService<int> authService) : base(logger)//When this constructor fired, base constructor that takes logger will be called
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]//route passed into GetById method/endpoint
        public ActionResult<ItemResponse<User>> GetById(int id)//will return User object model
        {
            int iCode = 200;//setup default response code
            BaseResponse response = null;//setup empty BaseResponse object
            try
            {
                User user = _service.Get(id);//if service finds an id, it hydrates the Address mdodel

                if (user == null)//if service returned null, return set a 404 and response
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }

                else
                {

                    response = new ItemResponse<User> { Item = user };//creates new ItemResponse with Address model, set address model response to the Item prop
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

        [HttpGet("")]
        public ActionResult<ItemsResponse<User>> GetAll()//returns ActionResult of Address. ItemsResonse is a type of Address
        {
            int code = 200;
            BaseResponse response = null;//new instance

            try
            {
                List<User> list = _service.GetAll();//getting the list

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemsResponse<User> { Items = list };
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


        [HttpPost]//as soon as this route is invoked by client, the below class is invoked, Create method is invoked, this case param requests a request model
        public ActionResult<ItemResponse<int>> Create(UserAddRequest model)//ActionResults object that handles status return types. A service returns the status//I want ActionResult that has ItemResponse (200,400,500, etc), only returning an int in this case
        {
            ObjectResult result = null;//empty object to be filled depending on response
            try
            {
                int userId = _authService.GetCurrentUserId();//this service will
                IUserAuthData user = _authService.GetCurrentUser();

                int id = _service.Add(model);//line below is original
                //int id = _service.Add(model, user.Id);//Service returns an int

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };//ItemResponse object with prop of Item, this case an int was created

                result = Created201(response);//object ItemResponse response represents a 201
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }

            return result;
        }


        [HttpPut("{id:int}")]//UPDATE
        public ActionResult<ItemResponse<int>> Update(UserUpdateRequest model)
        {

            _service.Update(model);

            SuccessResponse response = new SuccessResponse();

            return Ok(response);

        }

        
        [HttpDelete("{id:int}")]//Video 8min
        public ActionResult<SuccessResponse> Delete(int id)//why not ItemResponse instead of SuccessResonse
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);//returns a void           
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}

    
