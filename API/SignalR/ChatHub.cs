using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using API.DTOs;
using Application.Comments;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Persistence;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        private static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, Application.Profiles.Profile>> GroupUsers
        = new ConcurrentDictionary<string, ConcurrentDictionary<string, Application.Profiles.Profile>>();
        private readonly IUserAccesor _userAccesor;
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ChatHub(IMediator mediator, IUserAccesor userAccesor, DataContext context, IMapper mapper)
        {
            _userAccesor = userAccesor;
            _context = context;
            _mapper = mapper;
            _mediator = mediator;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext?.Request.Query["activityId"];
            var username = Context?.User?.Identity?.Name;

            var connections = GroupUsers.GetOrAdd(activityId, _ => new ConcurrentDictionary<string, Application.Profiles.Profile>());

            var userProfile = await GetUserProfileAsync(username);
            // Send the profile information back to the client
            await Clients.Caller.SendAsync("ReceiveUserProfile", userProfile);

            bool userAlreadyInGroup = connections.Values.Any(up => up.UserName == username);

            if (!connections.ContainsKey(Context.ConnectionId) && !userAlreadyInGroup)
            {
                // Add connection ID to the group
                connections[Context.ConnectionId] = userProfile;

                // Add to SignalR group
                await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

                await Clients.Group(activityId).SendAsync("UserJoined", activityId);
            }

            System.Console.WriteLine($"{Context.User.Identity.Name} joined group {activityId}");
            var result = await _mediator.Send(new List.Query { ActivityId = int.Parse(activityId) });
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }


        private async Task<Application.Profiles.Profile> GetUserProfileAsync(string username)
        {
            var userProfile = await _context.Users
                    .ProjectTo<Application.Profiles.Profile>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(x => x.UserName == username);

            if (userProfile == null) return null;

            return userProfile;
        }


        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];

            if (!StringValues.IsNullOrEmpty(activityId) && GroupUsers.TryGetValue(activityId, out var connections))
            {
                // Remove the connection ID from the group
                if (connections.TryRemove(Context.ConnectionId, out _))
                {
                    // Optionally remove the connection from the SignalR group
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, activityId);

                    // If the group is now empty, remove it from GroupUsers
                    if (connections.IsEmpty)
                    {
                        GroupUsers.TryRemove(activityId, out _);
                    }
                }
            }

            // This loop removes the connection ID from any other group it might be in.
            foreach (var group in GroupUsers)
            {
                if (group.Value.TryRemove(Context.ConnectionId, out _))
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, group.Key);

                    // If this group is now empty, remove it from GroupUsers
                    if (group.Value.IsEmpty)
                    {
                        GroupUsers.TryRemove(group.Key, out _);
                    }
                }
            }
            await Clients.Group(activityId).SendAsync("UserLeft", activityId);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task GetUsersInGroup(string groupName)
        {
            try
            {
                if (string.IsNullOrEmpty(groupName))
                {
                    throw new ArgumentException("Invalid activity ID");
                }
                var userProfiles = await GetUserProfilesInGroup(groupName);
                await Clients.Caller.SendAsync("ReceiveUserProfiles", userProfiles);
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                Console.WriteLine($"Error in GetUsersInGroup: {ex.Message}");
                throw; // Rethrow the exception to propagate it to the client
            }

        }

        private Task<List<Application.Profiles.Profile>> GetUserProfilesInGroup(string activityId)
        {
            if (GroupUsers.TryGetValue(activityId, out var connections))
            {
                return Task.FromResult(connections.Values.ToList());
            }
            return Task.FromResult(new List<Application.Profiles.Profile>());
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Groups(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }
    }
}