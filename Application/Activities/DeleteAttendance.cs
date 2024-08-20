using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using global::Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    namespace Application.Activities
    {
        public class DeleteAttendance
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
                    var attendance = await _context.UserActivities.FindAsync(request.UserActivity?.UserId, request.UserActivity?.ActivityId);

                    if (attendance == null) return Result<Unit>.Failure("Attendance doesn't exist!");

                    if (attendance?.UserId != user?.Id) return Result<Unit>.Failure("Unauthorized, you can only delete your own attendance");
                    _context.Remove(attendance);


                    var result = await _context.SaveChangesAsync() > 0;
                    if (!result) return Result<Unit>.Failure("Couldn't Delete attendance");

                    return Result<Unit>.Succes(Unit.Value);
                }
            }
        }
    }
}