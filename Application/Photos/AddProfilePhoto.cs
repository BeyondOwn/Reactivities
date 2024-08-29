using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class AddProfilePhoto
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccesor _photoAccesor;
            private readonly IUserAccesor _userAccesor;

            public Handler(DataContext context, IPhotoAccesor photoAccesor, IUserAccesor userAccesor)
            {
                _context = context;
                _photoAccesor = photoAccesor;
                _userAccesor = userAccesor;
            }
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccesor.GetUsername());

                if (user == null) return null;

                var photoUploadResult = await _photoAccesor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                if (!user.Photos.Any(x => x.isMain)) photo.isMain = true;

                user.Photos.Add(photo);

                var result = await _context.SaveChangesAsync() > 0;

                if (result) return Result<Photo>.Succes(photo);

                return Result<Photo>.Failure("Problem adding photo");
            }
        }
    }
}