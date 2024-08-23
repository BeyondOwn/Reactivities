using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts
{
    public class EditPost
    {
        public class Command : IRequest<Result<Unit>>
        {
            public ActivityPosts ActivityPosts { get; set; }
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccesor _userAccesor;

            public Handler(DataContext context, IMapper mapper, IUserAccesor userAccesor)
            {
                _context = context;
                _mapper = mapper;
                _userAccesor = userAccesor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccesor.GetUsername());
                var post = await _context.ActivityPosts.FindAsync(request.Id);

                if (post == null) return null;

                request.ActivityPosts.Users = user;

                if (post.CreatorId != user?.Id) return Result<Unit>.Failure("Unauthorized, you are not owner of the activity");

                //if mapping over null values can lead to Delete entire row.
                _mapper.Map(request.ActivityPosts, post);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Couldnt Edit activity");

                return Result<Unit>.Succes(Unit.Value);
            }
        }
    }
}