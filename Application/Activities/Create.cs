using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
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

                var attendance = new UserActivity
                {
                    UserId = request.Activity.CreatorId,
                    ActivityId = request.Activity.Id,
                    DisplayName = request.Activity.CreatorDisplayName,
                    Activity = request.Activity // Need this for it to work
                };


                _context.Activities.Add(request.Activity);
                _context.UserActivities.Add(attendance);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("failed to create activity");

                return Result<Unit>.Succes(Unit.Value);
            }
        }
    }
}