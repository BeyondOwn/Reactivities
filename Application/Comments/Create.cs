using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<chatCommentDto>>
        {
            public string Body { get; set; }
            public string? ImageUrl { get; set; }
            public string[]? Link { get; set; }
            public int ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<chatCommentDto>>
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

            public async Task<Result<chatCommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null) return Result<chatCommentDto>.Failure("activity is null");

                var user = await _context.Users
                    .Include(p => p.Photos)
                    .SingleOrDefaultAsync(x => x.UserName == _userAccesor.GetUsername());

                if (user == null) return Result<chatCommentDto>.Failure("user is null");

                var comment = new ChatAppComment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                    ImageUrl = request.ImageUrl,
                    Link = request.Link
                };
                if (activity.ChatAppComments == null) return null;
                activity.ChatAppComments.Add(comment);

                var succes = await _context.SaveChangesAsync() > 0;
                if (succes) return Result<chatCommentDto>.Succes(_mapper.Map<chatCommentDto>(comment));
                return Result<chatCommentDto>.Failure("Failed to add comment");

            }
        }
    }
}