using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Activities.Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ActivityAttendance : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAtendances()
        {
            var query = new GetActivitieAttendances.Query();
            var result = await Mediator.Send(query);
            return HandleResult(result);
        }

        [HttpGet("userId/{UserId}")]
        public async Task<IActionResult> GetActivitiesByUserId(string userId)
        {
            var query = new GetActivitiesByUser.Query { UserId = userId };
            var result = await Mediator.Send(query);
            return HandleResult(result);
        }

        [HttpGet("activityId/{ActivityId}")]
        public async Task<IActionResult> GetActivitiesByActivityId(int activityId)
        {
            var query = new GetActivitiesByActivity.Query { ActivityId = activityId };
            var result = await Mediator.Send(query);
            return HandleResult(result);
        }

        [HttpPost]

        public async Task<IActionResult> CreateAttendance(UserActivity attendance)
        {
            return HandleResult(await Mediator.Send(new CreateAttendance.Command { UserActivity = attendance }));

        }

        [HttpDelete]

        public async Task<IActionResult> DeleteAttendance(UserActivity attendance)
        {
            var result = await Mediator.Send(new DeleteAttendance.Command { UserActivity = attendance });

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