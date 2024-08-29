using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using Domain;
using Google.Apis.Auth;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Persistence;

namespace Application.Auth
{
    public class GoogleAuth
    {
        public class Command : IRequest<Result<UserDto>>
        {
            public string AccessToken { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<UserDto>>
        {
            private readonly DataContext _context;
            private readonly IUserAccesor _userAccesor;
            private readonly IConfiguration _config;
            private readonly UserManager<AppUser> _userManager;
            private readonly TokenServiceInfra _tokenServiceInfra;
            private readonly IPhotoAccesor _photoAccesor;
            private readonly ILogger<Handler> _logger;

            public Handler(DataContext context, IUserAccesor userAccesor, IConfiguration config, UserManager<AppUser> userManager,
             TokenServiceInfra tokenServiceInfra, IPhotoAccesor photoAccesor, ILogger<Handler> logger)
            {
                _userManager = userManager;
                _tokenServiceInfra = tokenServiceInfra;
                _photoAccesor = photoAccesor;
                _logger = logger;
                _context = context;
                _userAccesor = userAccesor;
                _config = config;
            }

            public async Task<Result<UserDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var payload = await GetGoogleUserInfo(request.AccessToken);

                if (payload == null)
                {
                    return Result<UserDto>.Failure("Invalid Google token");
                }

                // Extract user information from payload
                var userId = payload.Subject;
                var email = payload.Email;
                var name = payload.Name;
                var picture = payload.Picture;
                System.Console.WriteLine(picture);
                if (name == null)
                {
                    string pattern = "(.*)@";
                    Regex regex = new Regex(pattern);
                    Match match = regex.Match(email);
                    name = match.Groups[1].Value;
                }
                // Find or create the user in your database
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    // You might want to create a new user in your database
                    user = new AppUser
                    {
                        UserName = name,
                        Email = email,
                        DisplayName = name,
                        Bio = "empty",
                    };

                    // Add the Google profile picture as a new Photo


                    var createUserResult = await _userManager.CreateAsync(user);
                    if (!createUserResult.Succeeded)
                    {
                        return Result<UserDto>.Failure("Couldnt create user");
                    }


                }

                var userDb = await _context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.Email == email);
                if (userDb == null) return Result<UserDto>.Failure("UserDb is null");
                // _logger.LogInformation("picture: ", [picture]);
                if (picture != null)
                {

                    if (userDb.Photos.All(x => !x.isMain))
                    {
                        string pattern = "/a/(.*)";
                        Regex regex = new Regex(pattern);
                        Match match = regex.Match(picture);

                        var photoUploadResult = await _photoAccesor.UploadImageFromUrlAsync(picture, match.Groups[1].Value);
                        var googlePhoto = new Photo
                        {
                            Id = photoUploadResult.PublicId,
                            Url = photoUploadResult.Url,
                            isMain = true // Set as main profile picture
                        };

                        userDb.Photos.Add(googlePhoto);
                    }
                }

                var result = await _context.SaveChangesAsync() > 0;
                // if (!result) return Result<UserDto>.Failure("Issue Saving Changes");

                var jwtToken = _tokenServiceInfra.CreateToken(userDb);

                var userDto = new UserDto
                {
                    Id = userDb.Id,
                    DisplayName = userDb.DisplayName,
                    Image = userDb.Photos.FirstOrDefault(p => p.isMain)?.Url, // Get the URL of the main profile picture
                    Token = jwtToken,
                    Username = userDb.UserName,
                    // Email = email
                };


                return Result<UserDto>.Succes(userDto);

            }

            private async Task<GoogleJsonWebSignature.Payload> ValidateGoogleToken(string token)
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _config["Google:ClientId"] }
                };

                try
                {
                    var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
                    return payload;
                }
                catch (InvalidJwtException)
                {
                    return null;
                }
            }

            private async Task<GoogleJsonWebSignature.Payload> GetGoogleUserInfo(string accessToken)
            {
                var url = $"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={accessToken}";
                using var httpClient = new HttpClient();
                var response = await httpClient.GetStringAsync(url);

                // Parse the response to get user info
                var payload = JsonConvert.DeserializeObject<GoogleJsonWebSignature.Payload>(response);
                return payload;
            }

        }


    }
}