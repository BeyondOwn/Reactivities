using Application.Activities;
using Application.Activities.Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        // [HttpGet("/adc{userId}")]
        // public async Task<IActionResult> GetActivities(string userId)
        // {
        //     var query = new ListUserId.Query { UserId = userId };
        //     var result = await Mediator.Send(query);
        //     return HandleResult(result);
        // }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(int id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpGet("/view/{pageNumber}")]
        public async Task<IActionResult> GetActivities(int pageNumber)
        {
            var query = new GetPage.Query { PageNumber = pageNumber };
            var result = await Mediator.Send(query);
            return HandleResult(result);
        }

        [HttpPost]

        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));

        }

        [HttpPut("edit/id")]

        public async Task<IActionResult> EditActivity(int id, Activity activity)
        {
            var result = await Mediator.Send(new Edit.Command { Activity = activity });

            if (!result.IsSucces)
            {
                if (result.Error == "Unauthorized, you are not owner of the activity")
                    return Unauthorized(result.Error); // Return 401 Unauthorized
                else
                    return BadRequest(result.Error); // Return 400 Bad Request for other errors
            }

            return Ok(); // Return 200 OK if the operation is successful
        }

        [HttpDelete("id")]

        public async Task<IActionResult> DeleteActivity(int id)
        {
            var result = await Mediator.Send(new Delete.Command { Id = id });

            if (!result.IsSucces)
            {
                if (result.Error == "Unauthorized, you are not owner of the activity")
                    return Unauthorized(result.Error); // Return 401 Unauthorized
                else
                    return BadRequest(result.Error); // Return 400 Bad Request for other errors
            }

            return Ok(); // Return 200 OK if the operation is successful
        }
    }
}