using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using Application.Auth;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class OAuthController : BaseApiController
    {
        //Google
        [AllowAnonymous]
        [HttpPost("signin-google/onetap")]
        public async Task<IActionResult> GoogleSignInOneTap([FromBody] GoogleTokenRequest request)
        {

            return HandleResult(await Mediator.Send(new GoogleAuthOneTap.Command { Credential = request.Credential }));

        }

        [AllowAnonymous]
        [HttpPost("signin-google/custom")]
        public async Task<IActionResult> GoogleSignInCustom([FromBody] GoogleSignInRequest request)
        {

            return HandleResult(await Mediator.Send(new GoogleAuthCustom.Command { AccesToken = request.AccessToken }));

        }
    }
}