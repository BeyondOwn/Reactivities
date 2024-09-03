using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LinkController : BaseApiController
    {
        private readonly HttpClient _httpClient;

        public LinkController(HttpClient httpClient)
        {
            _httpClient = httpClient;
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
                var decodedUrl = System.Web.HttpUtility.UrlDecode(url);
                // Fetch the content from the URL
                var response = await _httpClient.GetStringAsync(decodedUrl);

                // Extract the title
                var titleMatch = Regex.Match(response, @"og:title""\s*content=""([^""]*)""", RegexOptions.IgnoreCase);
                var title = titleMatch.Success ? titleMatch.Groups[1].Value : "";

                // Extract the description
                var descriptionMatch = Regex.Match(response, @"og:description""\s*content=""([^""]*)""", RegexOptions.IgnoreCase);
                var description = descriptionMatch.Success ? descriptionMatch.Groups[1].Value : "";

                // Extract the image URL
                var imageMatch = Regex.Match(response, @"og:image""\s*content=""([^""]*)""", RegexOptions.IgnoreCase);
                var imageUrl = imageMatch.Success ? imageMatch.Groups[1].Value : "";

                // Return the extracted metadata as JSON
                return Ok(new
                {
                    success = 1,
                    meta = new
                    {
                        title,
                        description,
                        image = new
                        {
                            url = imageUrl
                        }
                    }
                });
            }
            catch (HttpRequestException e)
            {
                return StatusCode(500, $"Error fetching the URL: {e.Message}");
            }
        }

    }
}
