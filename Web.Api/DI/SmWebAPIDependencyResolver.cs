using System;
using System.Linq;
using StructureMap;
using System.Collections.Generic;
using System.Web.Http.Dependencies;


namespace Web.Api.DI
{
    public class SmWebAPIDependencyResolver : IDependencyResolver 
    {
        private readonly IContainer _container;

        public SmWebAPIDependencyResolver(IContainer container)
        {
            _container = container;        
        }


        public System.Web.Http.Dependencies.IDependencyScope BeginScope()
        {
            return this;
        }

        public object GetService(Type serviceType)
        {
            if (serviceType == null) return null;
            try
            {
                return serviceType.IsAbstract || serviceType.IsInterface
                         ? _container.TryGetInstance(serviceType)
                         : _container.GetInstance(serviceType);
            }
            catch
            {

                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return _container.GetAllInstances(serviceType).Cast<object>();
        }

        public void Dispose()
        {
           // to do 
        }
    }
}








