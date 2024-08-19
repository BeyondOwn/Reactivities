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
        public class Delete
        {
            public class Command : IRequest<Result<Unit>>
            {
                public int Id { get; set; }
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
                    var activity = await _context.Activities.FindAsync(request.Id);

                    if (activity == null) return null;

                    if (activity.CreatorId != user.Id) return Result<Unit>.Failure("Unauthorized, you are not owner of the activity");
                    _context.Remove(activity);


                    var result = await _context.SaveChangesAsync() > 0;
                    if (!result) return Result<Unit>.Failure("Couldn't Delete activity");

                    return Result<Unit>.Succes(Unit.Value);
                }
            }
        }
    }
}