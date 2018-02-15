using System;
using System.Web.Mvc;

namespace Web.Api.DI
{
    /// <summary>
    /// 
    /// </summary>
    public class CustomControllerActivator : IControllerActivator
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="requestContext"></param>
        /// <param name="controllerType"></param>
        /// <returns></returns>
        IController IControllerActivator.Create(System.Web.Routing.RequestContext requestContext,
            Type controllerType)
        {
            return DependencyResolver.Current
                       .GetService(controllerType) as IController;
        }
    }
}