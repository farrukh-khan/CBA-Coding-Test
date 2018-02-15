using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using StructureMap;
using System.Web.Http.Dependencies;


namespace Web.Api.DI
{
    public class StructureMapScope : IDependencyScope
    {
        private readonly IContainer container;

        public StructureMapScope(IContainer container)
        {
            if (container == null)
            {
                throw new ArgumentNullException("container");
            }
            this.container = container;
        }

        public object GetService(Type serviceType)
        {
            if (serviceType == null)
            {
                return null;
            }

            try
            {
                return serviceType.IsAbstract || serviceType.IsInterface
                         ? this.container.TryGetInstance(serviceType)
                         : this.container.GetInstance(serviceType);
            }
            catch(Exception ex)
            {
                System.Diagnostics.EventLog.WriteEntry("Agent Web", ex.ToString());
                return null;
            }            
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return this.container.GetAllInstances(serviceType).Cast<object>();
        }

        public void Dispose()
        {
            this.container.Dispose();
        }
    }

    public class StructureMapDependencyResolver : StructureMapScope, System.Web.Mvc.IDependencyResolver
    {
        private readonly IContainer container;

        public StructureMapDependencyResolver(IContainer container)
            : base(container)
        {
            this.container = container;
        }

        public IDependencyScope BeginScope()
        {
            var childContainer = this.container.GetNestedContainer();
            return new StructureMapScope(childContainer);
        }
    }
}
