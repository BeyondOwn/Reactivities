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
        Task<PhotoUploadResults> AddPhoto(IFormFile file, string userId);

        Task<PhotoUploadResults> UploadImageFromUrlAsync(string imageUrl, string publicId);

        Task<string> GetPublicIdFromUrlAsync(string imageUrl);

        Task<string> DeletePhoto(string publicId);

    }
}