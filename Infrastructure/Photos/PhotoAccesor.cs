using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccesor : IPhotoAccesor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccesor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<PhotoUploadResults> UploadImageFromUrlAsync(string imageUrl, string publicId)
        {
            using (var httpClient = new HttpClient())
            {
                // Download the image from the URL
                var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);

                // Create an upload stream from the image bytes
                using (var stream = new MemoryStream(imageBytes))
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(publicId, stream),
                    };

                    //     var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    // if (uploadResult.Error != null)
                    // {
                    //     throw new Exception(uploadResult.Error.Message);
                    // }

                    // return new PhotoUploadResults
                    // {
                    //     PublicId = uploadResult.PublicId,
                    //     Url = uploadResult.SecureUrl.ToString(),
                    // };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.Error != null)
                    {
                        throw new Exception(uploadResult.Error.Message);
                    }

                    return new PhotoUploadResults
                    {
                        PublicId = uploadResult.PublicId,
                        Url = uploadResult.SecureUrl.ToString(),
                    };

                    // return uploadResult.SecureUrl.ToString(); // Return the URL of the uploaded image
                }
            }
        }

        public async Task<PhotoUploadResults> AddPhoto(IFormFile file)
        {
            if (file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    // Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                return new PhotoUploadResults
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString(),
                };
            }
            return null;
        }
        public async Task<string> DeletePhoto(string publicId)
        {

            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}