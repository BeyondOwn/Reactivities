using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Azure.Core;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<Result<List<CommentDto>>>
        {
            public int ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccesor _userAccesor;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<CommentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {

                System.Console.WriteLine($"request.ActivityId:{request.ActivityId}");
                var chatAppComments = await _context.ChatAppComments
                    .Include(x => x.Activity)
                    .Where(x => x.Activity.Id == request.ActivityId)
                    .OrderBy(x => x.CreatedAt)
                    .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();


                if (chatAppComments == null) return Result<List<CommentDto>>.Failure("chatAppComments is null");

                return Result<List<CommentDto>>.Succes(chatAppComments);


            }
        }
    }
}