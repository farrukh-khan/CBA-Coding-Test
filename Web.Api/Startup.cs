
using Elmah;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Web.Api.DI;
using Web.Api.Mappings;
using Web.Api.Providers;

[assembly: OwinStartup(typeof(Web.Api.Startup))]

namespace Web.Api
{
    public class Startup
    {

        public void Configuration(IAppBuilder app)
        {

          

            
        
            HttpConfiguration config = new HttpConfiguration();
            config.Formatters.JsonFormatter
                        .SerializerSettings
                        .ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;


            RegisterDependencyResolution();
            ConfigureOAuth(app);
            WebApiConfig.Register(config);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            AreaRegistration.RegisterAllAreas();

            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);
            
            InitializeAutoMapper();
            
            
            //SqlDependency.Start(ConfigurationManager.ConnectionStrings["Default"].ToString());
            //var aTimer = new System.Timers.Timer(5000);

            //aTimer.Elapsed += aTimer_Elapsed;
            //aTimer.Interval = 5000;
            //aTimer.Enabled = true;
        }

        void aTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            //MessagesHub hub = new MessagesHub();

            //hub.Send();


            //var context = GlobalHost.ConnectionManager.GetHubContext<MessagesHub>();
            //context.Clients.All.hello("Hello how are you");
        }
        private void InitializeAutoMapper()
        {
            // initialize automapper
            Type maperInterfaceType = typeof(IAutoMap);
            var mappers = Assembly.GetExecutingAssembly().GetTypes()
                .Where(p => maperInterfaceType.IsAssignableFrom(p) && !p.IsInterface)
                .Select(x => (IAutoMap)Activator.CreateInstance(x))
                .ToList();
            mappers.ForEach(x => x.Initialize());
        }



        public void ConfigureOAuth(IAppBuilder app)
        {

            

            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions() {
            
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new SimpleAuthorizationServerProvider(),
                RefreshTokenProvider = new SimpleRefreshTokenProvider()                
            };
            
            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);

            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

        }

        private void RegisterDependencyResolution()
        {
            var container = (IContainer)IoC.Initialize();
            DependencyResolver.SetResolver(new StructureMapDependencyResolver(container));
        }


        void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs

            // Get the exception object.
            Exception exc = HttpContext.Current.Server.GetLastError();

            // Handle HTTP errors
            if (exc.GetType() == typeof(HttpException))
            {
                // The Complete Error Handling Example generates
                // some errors using URLs with "NoCatch" in them;
                // ignore these here to simulate what would happen
                // if a global.asax handler were not implemented.
                if (exc.Message.Contains("NoCatch") || exc.Message.Contains("maxUrlLength"))
                    return;

                //Redirect HTTP errors to HttpError page
                HttpContext.Current.Server.Transfer("HttpErrorPage.aspx");
            }

            

            // Clear the error from the server
            HttpContext.Current.Server.ClearError();
        }
        void ErrorLog_Filtering(object sender, ExceptionFilterEventArgs e)
        {
            // perform filtering here
        }

        void ErrorMail_Filtering(object sender, ExceptionFilterEventArgs e)
        {
            // perform filtering here
        }
        protected void Application_EndRequest(object sender, EventArgs e)
        {
       
          
        }


        protected void Application_End()
        {
            //Stop SQL dependency
            //SqlDependency.Stop(ConfigurationManager.ConnectionStrings["Default"].ToString());
        }

    }

}