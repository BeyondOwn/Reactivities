using Application.Activities;
using Application.Activities.Application.Activities;
using Application.DataObjects;
using Application.Posts;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PostsController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("{ActivityId}")]
        public async Task<IActionResult> GetActivity(int activityId)
        {
            return HandleResult(await Mediator.Send(new GetPostsForActivity.Query { ActivityId = activityId }));
        }
        [AllowAnonymous]
        [HttpGet("infinite/{activityId}/{pageNumber}")]
        public async Task<IActionResult> GetActivities(int pageNumber, int activityId)
        {
            var query = new PostsInfiniteScrolling.Query { ActivityId = activityId, PageNumber = pageNumber };
            var result = await Mediator.Send(query);
            return HandleResult(result);
        }

        [HttpPost]

        public async Task<IActionResult> CreateActivity(ActivityPosts activityPosts)
        {
            return HandleResult(await Mediator.Send(new CreatePost.Command { ActivityPosts = activityPosts }));

        }

        [HttpPut("edit/{id}")]

        public async Task<IActionResult> EditActivity(int id, ActivityPosts activityPosts)
        {
            var result = await Mediator.Send(new EditPost.Command { Id = id, ActivityPosts = activityPosts });

            if (!result.IsSucces)
            {
                if (result.Error == "Unauthorized, you are not owner of the activity")
                    return Unauthorized(result.Error); // Return 401 Unauthorized
                else
                    return BadRequest(result.Error); // Return 400 Bad Request for other errors
            }

            return Ok(); // Return 200 OK if the operation is successful
        }

        [HttpDelete("delete/{id}")]

        public async Task<IActionResult> DeleteActivity(int id)
        {
            var result = await Mediator.Send(new DeletePost.Command { Id = id });

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