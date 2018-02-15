using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
[assembly: log4net.Config.XmlConfigurator(Watch = true)]
namespace Web.Api
{
  
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("elmah.axd/{*pathInfo}");
            
            // e-report/132
            routes.MapRoute(
                name: "ereport",
                url: "ereport/{id}",
                defaults: new
                {
                    controller = "PatientReport",
                    action = "GetInvoiceReport",
                }
            );

            routes.MapRoute(
                name: "ereport without id",
                url: "ereport",
                defaults: new
                {
                    controller = "PatientReport",
                    action = "GetInvoiceReport",
                }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "PatientReport", action = "GetInvoiceReport", id = UrlParameter.Optional }
            );



        }
    }
}
