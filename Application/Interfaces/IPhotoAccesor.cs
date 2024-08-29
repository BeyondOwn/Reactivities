using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccesor
    {
        Task<PhotoUploadResults> AddPhoto(IFormFile file);

        Task<PhotoUploadResults> UploadImageFromUrlAsync(string imageUrl, string publicId);

        Task<string> DeletePhoto(string publicId);

    }
}