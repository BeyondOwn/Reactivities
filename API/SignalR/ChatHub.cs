using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext?.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            System.Console.WriteLine($"{Context.User.Identity.Name} joined group {activityId}");
            var result = await _mediator.Send(new List.Query { ActivityId = int.Parse(activityId) });
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Groups(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }
    }
}