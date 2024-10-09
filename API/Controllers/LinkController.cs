using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Application.Comments;
using Application.Interfaces;
using AutoMapper;
using CloudinaryDotNet;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Persistence;
using Reddit;
using Reddit.Controllers;

namespace API.Controllers
{

    public class LinkController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly IUserAccesor _userAccesor;
        private readonly IMapper _mapper;

        public LinkController(HttpClient httpClient, DataContext context, IUserAccesor userAccesor, IMapper mapper)
        {
            _mapper = mapper;
            _userAccesor = userAccesor;
            _context = context;
        }

        private static readonly HttpClientHandler handler = new HttpClientHandler
        {
            CookieContainer = new System.Net.CookieContainer() // Handle cookies
        };

        private static readonly HttpClient httpClient = new HttpClient(handler);

        [AllowAnonymous]
        [HttpPut("edit-chat-comment")]
        public async Task<IActionResult> EditChatComment([FromQuery] int Id, Metadata updatedMetadata)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccesor.GetUsername());
            var chatcomment = await _context.ChatAppComments
            .Include(c => c.Metadata)  // Ensure Metadata is included in the query
            .FirstOrDefaultAsync(c => c.Id == Id);

            if (chatcomment == null) return NotFound("chatComment no found");


            if (chatcomment.Author.Id != user?.Id) return Unauthorized("Unauthorized, you are not owner of the comment");
            if (chatcomment.Metadata == null)
            {
                if (updatedMetadata != null)
                {
                    chatcomment.Metadata = new Metadata
                    {
                        Success = updatedMetadata.Success,
                        chatAppComment = updatedMetadata.chatAppComment,
                        chatAppCommentId = Id,
                        Href = updatedMetadata.Href,
                        SiteName = updatedMetadata.SiteName,
                        Title = updatedMetadata.Title,
                        Description = updatedMetadata.Description,
                        ImageUrl = updatedMetadata.ImageUrl
                    };
                }
            }


            var result = await _context.SaveChangesAsync() > 0;
            if (!result) return StatusCode(500, "Couldnt Edit chat comment");

            return Ok(chatcomment.Metadata);
        }

        [AllowAnonymous]
        [HttpGet("fetch-meta")]
        public async Task<IActionResult> FetchMeta([FromQuery] string url)
        {
            if (string.IsNullOrEmpty(url))
            {
                return BadRequest("Invalid URL");
            }

            try
            {
                httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36");
                // Add random delay to mimic human browsing

                var href = url;

                var decodedUrl = System.Web.HttpUtility.UrlDecode(url);
                // Fetch the content from the URL
                var response = await httpClient.GetStringAsync(decodedUrl);

                var siteNameMatch = Regex.Match(response, @"og:site_name""\s*content=""([^""]*)""", RegexOptions.IgnoreCase);
                var siteName = siteNameMatch.Success ? siteNameMatch.Groups[1].Value : string.Empty;

                var titlePatterns = new string[]
                {
                @"og:title""\s*content=""([^""]*)""",        // First pattern (correct one)
                @"og:title\\""\s*content=\\""([^""]*)""",
                @"title>([^""]*)</title>",   
                // Add more patterns here if needed
                };

                string title = string.Empty;

                // Loop through each pattern and try to find a match
                foreach (var pattern in titlePatterns)
                {
                    var titleMatch = Regex.Match(response, pattern, RegexOptions.IgnoreCase);
                    if (titleMatch.Success)
                    {
                        title = titleMatch.Groups[1].Value;
                        break; // Exit the loop if a match is found
                    }
                }

                // Extract the description
                var descriptionMatch = Regex.Match(response, @"og:description""\s*content=""([^""]*)""", RegexOptions.IgnoreCase);
                var description = descriptionMatch.Success ? descriptionMatch.Groups[1].Value : string.Empty;

                // Extract the image URL
                var imageMatch = Regex.Match(response, @"og:image""\s*content=""([^""]*)""", RegexOptions.IgnoreCase);
                var imageUrl = imageMatch.Success ? imageMatch.Groups[1].Value : string.Empty;

                var SuccessState = true;
                if (href == string.Empty || siteName == string.Empty || title == string.Empty || description == string.Empty
                || imageUrl == string.Empty)
                    SuccessState = false;
                // Return the extracted metadata as JSON
                return Ok(new Metadata
                {
                    Success = SuccessState,
                    Href = href,
                    SiteName = siteName,
                    Title = title,
                    Description = description,
                    ImageUrl = imageUrl
                }
                );
            }
            catch (HttpRequestException e)
            {
                return Ok(new Metadata
                {
                    Success = false,
                    Href = url,
                    SiteName = string.Empty,
                    Title = string.Empty,
                    Description = string.Empty,
                    ImageUrl = string.Empty
                });
            }
        }

    }
}
