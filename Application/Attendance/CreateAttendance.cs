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
    public class CreateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public UserActivity UserActivity { get; set; }
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
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccesor.GetUsername());

                var attendance = await _context.UserActivities.FindAsync(request.UserActivity.UserId, request.UserActivity.ActivityId);

                if (request?.UserActivity.UserId == attendance?.UserId &&
                request?.UserActivity.ActivityId == attendance?.ActivityId)
                    return Result<Unit>.Failure("You already Attend!");

                if (request?.UserActivity.UserId != user?.Id) return Result<Unit>.Failure("Unauthorized, you can only attend for yourself");
                _context.UserActivities.Add(request?.UserActivity);


                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("failed to create UserAttendance");

                return Result<Unit>.Succes(Unit.Value);
            }
        }
    }
}


