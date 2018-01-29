using Common.API.Extensions;
using Common.Domain.Base;
using Common.Domain.Model;
using IdentityModel.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Seed.CrossCuting
{
    public class RequestTokenMiddlewareCustom : RequestTokenMiddleware
    {
        public RequestTokenMiddlewareCustom(RequestDelegate next) : base(next)
        {

        }


    }

}
