using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class CreatePost
    {

        public class Command : IRequest<Result<Unit>>
        {
            public ActivityPosts ActivityPosts { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.ActivityPosts).SetValidator(new PostsValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccesor _userAccesor;

            public Handler(DataContext context, IUserAccesor userAccesor)
            {
                _context = context;
                _userAccesor = userAccesor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // if (!request.Activity.UserActivities.Any())
                // {
                //     request.Activity.UserActivities = new List<UserActivity>();
                // }

                // var post = new ActivityPosts
                // {
                //     Id = request.ActivityPosts.Id,
                //     ActivityId = request.ActivityPosts.Id,
                //     Content = request.ActivityPosts.Content,
                //     CreatorId = request.ActivityPosts.CreatorId,
                //     CreatorDisplayName = request.ActivityPosts.CreatorDisplayName
                // };


                _context.ActivityPosts.Add(request.ActivityPosts);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("failed to create post");

                return Result<Unit>.Succes(Unit.Value);
            }
        }
    }
}
