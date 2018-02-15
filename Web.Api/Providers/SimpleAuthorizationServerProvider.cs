
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Script.Serialization;

namespace Web.Api.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {

        public SimpleAuthorizationServerProvider()
        {

        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {


            try
            {

                //string clientId = string.Empty;
                //string clientSecret = string.Empty;
                //App client = null;

                //if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
                //{
                //    context.TryGetFormCredentials(out clientId, out clientSecret);
                //}

                //if (context.ClientId == null)
                //{
                //    //Remove the comments from the below line context.SetError, and invalidate context 
                //    //if you want to force sending clientId/secrects once obtain access tokens. 
                //    context.Validated();
                //    //context.SetError("invalid_clientId", "ClientId should be sent.");
                //    return Task.FromResult<object>(null);
                //}
                //var requestOrigin = context.Request.Headers["Origin"];
                //client = _appService.GetApps(x => x.AppName == context.ClientId && x.AllowedOrigin == requestOrigin).FirstOrDefault();
                //if (client == null)
                //{
                //    context.SetError("invalid_clientId", string.Format("Client '{0}' is not registered in the system.", context.ClientId));
                //    return Task.FromResult<object>(null);
                //}

                //if (client.ApplicationType == (int)Web.Api.Models.ApplicationTypes.NativeConfidential)
                //{
                //    if (string.IsNullOrWhiteSpace(clientSecret))
                //    {
                //        context.SetError("invalid_clientId", "Client secret should be sent.");
                //        return Task.FromResult<object>(null);
                //    }
                //    else
                //    {
                //        if (client.Secret != Web.Api.Common.CommonUtility.GetHash(clientSecret))
                //        {
                //            context.SetError("invalid_clientId", "Client secret is invalid.");
                //            return Task.FromResult<object>(null);
                //        }
                //    }
                //}

                //if (!client.Active)
                //{
                //    context.SetError("invalid_clientId", "Client is inactive.");
                //    return Task.FromResult<object>(null);
                //}

                //context.OwinContext.Set<string>("as:clientAllowedOrigin", String.Join(",", client.AllowedOrigin));
                //context.OwinContext.Set<string>("as:clientRefreshTokenLifeTime", String.Join(",", client.RefreshTokenLifeTime));

                context.Validated();
                return Task.FromResult<object>(null);
            }
            catch
            {
                return Task.FromResult<object>(null);
            }


        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {

            try
            {
                var scop = context.Scope[0].Split(',');

                string ip = HttpContext.Current.Request.UserHostAddress;
                bool isLogOffUser = bool.Parse(scop[0]);
                string token = scop[1];
                var allowedOrigin = context.OwinContext.Get<string>("as:clientAllowedOrigin");

                //if (allowedOrigin == null) allowedOrigin = "*";
                allowedOrigin = "*";

                context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { allowedOrigin });

                var identity = new ClaimsIdentity(context.Options.AuthenticationType);

                var props = new AuthenticationProperties(new Dictionary<string, string>
                {
                    {
                        "as:client_id", (context.ClientId == null) ? string.Empty : context.ClientId
                    }
                });

                var ticket = new AuthenticationTicket(identity, props);
                context.Validated(ticket);
            }
            catch (Exception ex)
            {
                context.SetError("invalid_grant", ex.ToString());
            }

        }

        public override Task GrantRefreshToken(OAuthGrantRefreshTokenContext context)
        {
            try
            {
                var originalClient = context.Ticket.Properties.Dictionary["as:client_id"];
                var currentClient = context.ClientId;

                if (originalClient != currentClient)
                {
                    context.SetError("invalid_clientId", "Refresh token is issued to a different clientId.");
                    return Task.FromResult<object>(null);
                }

                // Change auth ticket for refresh token requests
                var newIdentity = new ClaimsIdentity(context.Ticket.Identity);
                newIdentity.AddClaim(new Claim("newClaim", "newValue"));

                var newTicket = new AuthenticationTicket(newIdentity, context.Ticket.Properties);
                context.Validated(newTicket);

                return Task.FromResult<object>(null);
            }
            catch
            {
                return Task.FromResult<object>(null);
            }

        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            try
            {
                foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
                {
                    context.AdditionalResponseParameters.Add(property.Key, property.Value);
                }

                return Task.FromResult<object>(null);
            }
            catch
            {
                return Task.FromResult<object>(null);

            }


        }

    }
}