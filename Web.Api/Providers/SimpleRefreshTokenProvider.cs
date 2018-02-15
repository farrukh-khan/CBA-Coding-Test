
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Infrastructure;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;


namespace Web.Api.Providers
{
    public class SimpleRefreshTokenProvider : IAuthenticationTokenProvider
    {
        public SimpleRefreshTokenProvider()
        {

        }
        public async Task CreateAsync(AuthenticationTokenCreateContext context)
        {
            try
            {
                //var clientid = context.Ticket.Properties.Dictionary["as:client_id"];
                //var userId = context.Ticket.Properties.Dictionary["UserId"];
                //var ipAddress = context.Ticket.Properties.Dictionary["IPAddress"];

                //if (string.IsNullOrEmpty(clientid))
                //{
                //    return;
                //}

                var refreshTokenId = Guid.NewGuid().ToString("n");

                context.SetToken(refreshTokenId);
            }
            catch
            {

            }



        }

        public async Task ReceiveAsync(AuthenticationTokenReceiveContext context)
        {
            try
            {
                var allowedOrigin = context.OwinContext.Get<string>("as:clientAllowedOrigin");
                context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { allowedOrigin });
            }
            catch
            {

            }



        }

        public void Create(AuthenticationTokenCreateContext context)
        {
            throw new NotImplementedException();
        }

        public void Receive(AuthenticationTokenReceiveContext context)
        {
            throw new NotImplementedException();
        }
    }
}