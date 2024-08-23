using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class GetPostsForActivity
    {

        public class Query : IRequest<Result<List<ActivityPosts>>>
        {
            public int ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityPosts>>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<ActivityPosts>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var posts = await _context.ActivityPosts.
                Where(u => u.ActivityId == request.ActivityId)
                .ToListAsync();

                return Result<List<ActivityPosts>>.Succes(posts);

            }
        }
    }
}