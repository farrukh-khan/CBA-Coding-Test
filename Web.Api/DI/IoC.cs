
using StructureMap;
using StructureMap.Graph;
using System.Web.ApplicationServices;

namespace Web.Api.DI
{
    public static class IoC
    {
        public static IContainer Initialize()
        {
            ObjectFactory.Initialize(x =>
            {
                x.Scan(scan =>
                {
                    scan.WithDefaultConventions();
                    scan.TheCallingAssembly();
                   

                });

                
            });
            return ObjectFactory.Container;
        }
    }
}


