using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class ListUserId
    {
        public class Query : IRequest<Result<List<Activity>>>
        {
            public string UserId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {

                var activity = await _context.Activities
                .Where(a => a.CreatorId == request.UserId)
                .ToListAsync(cancellationToken);
                return Result<List<Activity>>.Succes(activity);
            }
        }
    }
}