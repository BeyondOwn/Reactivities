using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class GetActivitiesByActivity
    {
        public class Query : IRequest<Result<List<UserActivity>>>
        {
            public int ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivity>>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<UserActivity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.UserActivities.
                Where(u => u.ActivityId == request.ActivityId)
                .ToListAsync();

                return Result<List<UserActivity>>.Succes(activity);

            }
        }
    }
}
