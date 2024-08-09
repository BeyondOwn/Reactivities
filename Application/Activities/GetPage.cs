using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class GetPage
    {
        public class Query : IRequest<PaginatedResult<Activity>>
        {
            public int PageNumber { get; set; } = 1;  // Default to page 1
            public int PageSize { get; set; } = 10;   // Default to 10 items per page
        }

        public class Handler : IRequestHandler<Query, PaginatedResult<Activity>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PaginatedResult<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {

                var totalCount = await _context.Activities.CountAsync(cancellationToken);

                // Ensure pageSize is not zero to avoid division by zero
                var pageSize = request.PageSize > 0 ? request.PageSize : 1;

                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var activities = await _context.Activities
                    .Skip((request.PageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync(cancellationToken);

                return new PaginatedResult<Activity>
                {
                    Items = activities,
                    HasMore = request.PageNumber * pageSize < totalCount,
                    TotalPages = totalPages
                };
            }
        }
    }
}