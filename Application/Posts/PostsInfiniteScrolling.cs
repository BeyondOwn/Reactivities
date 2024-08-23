using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class PostsInfiniteScrolling
    {
        public class Query : IRequest<Result<PaginatedResult<ActivityPosts>>>
        {
            public int ActivityId { get; set; }
            public int PageNumber { get; set; } = 1;  // Default to page 1
            public int PageSize { get; set; } = 10;   // Default to 10 items per page
        }

        public class Handler : IRequestHandler<Query, Result<PaginatedResult<ActivityPosts>>>
        {
            private readonly DataContext _context;
            private readonly IUserAccesor _userAccesor;

            public Handler(DataContext context, IUserAccesor userAccesor)
            {
                _context = context;
                _userAccesor = userAccesor;
            }

            public async Task<Result<PaginatedResult<ActivityPosts>>> Handle(Query request, CancellationToken cancellationToken)
            {

                var totalCount = await _context.Activities.CountAsync(cancellationToken);

                // Ensure pageSize is not zero to avoid division by zero
                var pageSize = request.PageSize > 0 ? request.PageSize : 1;

                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccesor.GetUsername());


                var posts = await _context.ActivityPosts
                    .Where(a => a.ActivityId == request.ActivityId)
                    .Skip((request.PageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync(cancellationToken);

                foreach (var elem in posts)
                {
                    elem.Users = null;
                }
                var post = new PaginatedResult<ActivityPosts>
                {
                    Items = posts,
                    HasMore = request.PageNumber * pageSize < totalCount,
                    TotalPages = totalPages

                };

                return Result<PaginatedResult<ActivityPosts>>.Succes(post);
            }
        }
    }
}