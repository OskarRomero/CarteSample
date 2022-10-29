using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Coworkers;
using Sabio.Models.Requests.Coworkers;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Data.SqlClient;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/v3/coworkers")]
    [ApiController]
    public class CoworkerAPIController : BaseApiController
    {
        private ICoworkerService _service = null;
        private IAuthenticationService<int> _authService = null;

        public CoworkerAPIController(ICoworkerService service
            ,ILogger<CoworkerAPIController> logger
            ,IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{Id:int}")]
        public ActionResult<ItemResponse<Coworker>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Coworker aCoworker = _service.GetCoworkerById(id);
                if (aCoworker == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }

                else
                {
                    response = new ItemResponse<Coworker> { Item = aCoworker };
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

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(CoworkersAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                IUserAuthData user = _authService.GetCurrentUser();
                int id = _service.AddCoworker(model, user.Id);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            { ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }
    }
}
