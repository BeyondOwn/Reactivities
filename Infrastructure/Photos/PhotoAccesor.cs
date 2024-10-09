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
                        PublicId = Path.GetFileNameWithoutExtension(publicId)
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

                    var resourceExists = await _cloudinary.GetResourceAsync(new GetResourceParams(publicId));
                    System.Console.WriteLine(resourceExists.PublicId);
                    if (resourceExists.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        System.Console.WriteLine("PublicID: ", resourceExists.PublicId);
                        return new PhotoUploadResults
                        {
                            PublicId = resourceExists.PublicId,
                            Url = resourceExists.SecureUrl.ToString(),
                        };
                    }
                    else
                    {
                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                        if (uploadResult.Error != null)
                        {
                            throw new Exception(uploadResult.Error.Message);
                        }

                        return new PhotoUploadResults
                        {
                            PublicId = publicId,
                            Url = uploadResult.SecureUrl.ToString(),
                        };
                    }


                }
            }
        }

        public async Task<PhotoUploadResults> AddPhoto(IFormFile file, string userId)
        {
            if (file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    PublicId = $"{userId}_{Path.GetFileNameWithoutExtension(file.FileName)}"
                    // Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };

                var resourceExists = await _cloudinary.GetResourceAsync(new GetResourceParams(Path.GetFileNameWithoutExtension(file.FileName)));
                if (resourceExists.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    System.Console.WriteLine(resourceExists.PublicId);
                    return new PhotoUploadResults
                    {
                        PublicId = resourceExists.PublicId,
                        Url = resourceExists.SecureUrl.ToString(),
                    };
                }
                else
                {
                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.Error != null)
                    {
                        throw new Exception(uploadResult.Error.Message);
                    }

                    return new PhotoUploadResults
                    {
                        PublicId = uploadParams.PublicId,
                        Url = uploadResult.SecureUrl.ToString(),
                    };
                }


            }
            return null;
        }
        public async Task<string> DeletePhoto(string publicId)
        {

            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }

        public async Task<string> GetPublicIdFromUrlAsync(string imageUrl)
        {
            var publicId = ExtractPublicIdFromUrl(imageUrl);

            if (string.IsNullOrEmpty(publicId))
            {
                throw new ArgumentException("Invalid image URL provided.");
            }

            // Fetch details about the image
            var resources = await _cloudinary.GetResourceAsync(publicId);

            if (resources == null || resources.Error != null)
            {
                throw new Exception("Error retrieving resource from Cloudinary.");
            }

            // Return the public ID or any other details you need
            return resources.PublicId;
        }

        private string ExtractPublicIdFromUrl(string url)
        {
            // Extract public ID from URL logic
            // Cloudinary URLs have the format: `https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/public_id.png`
            var uri = new Uri(url);
            var pathSegments = uri.AbsolutePath.Split('/');
            // Extract public ID from the path
            // Path segments: ["/image", "/upload", "/v1234567890", "public_id.png"]
            if (pathSegments.Length >= 4)
            {
                var fileName = pathSegments[pathSegments.Length - 1];
                var versionAndId = fileName.Split('.');
                if (versionAndId.Length >= 2)
                {
                    return versionAndId[0]; // Return the public ID part
                }
            }

            return null;
        }


    }
}