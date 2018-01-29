using AutoMapper;

namespace Seed.Application.Config
{
	public class AutoMapperConfigSeed
    {
		public static void RegisterMappings()
		{

			Mapper.Initialize(x =>
			{
				x.AddProfile<DominioToDtoProfileSeed>();
				x.AddProfile<DominioToDtoProfileSeedCustom>();
			});

		}
	}
}
