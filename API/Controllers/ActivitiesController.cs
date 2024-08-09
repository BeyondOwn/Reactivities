using Application.Activities;
using Application.Activities.Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(int id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpGet("/asd/{pageNumber}")]
        public async Task<ActionResult<PaginatedResult<Activity>>> GetActivities(int pageNumber, int pageSize = 10)
        {
            var query = new GetPage.Query { PageNumber = pageNumber, PageSize = pageSize };
            var result = await Mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]

        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            await Mediator.Send(new Create.Command { Activity = activity });

            return Ok($"Posted succesfully:\n{activity.Title}");
        }

        [HttpPut("id")]

        public async Task<IActionResult> EditActivity(int id, Activity activity)
        {
            activity.Id = id;
            return Ok(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [HttpDelete("id")]

        public async Task<IActionResult> DeleteActivity(int id)
        {

            return Ok(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}