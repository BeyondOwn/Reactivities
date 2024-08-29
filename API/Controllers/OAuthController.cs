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
        [HttpPost("signin-google")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request)
        {

            return HandleResult(await Mediator.Send(new GoogleAuth.Command { AccessToken = request.AccessToken }));

        }
    }
}