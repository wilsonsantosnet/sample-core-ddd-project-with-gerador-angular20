using Common.Gen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seed.Gen
{
    public class ConfigExternalResources
    {

        private ExternalResource ConfigExternarResourcesTemplatesFrontBs4Angular20(bool replaceLocalFilesApplication)
        {

            return new ExternalResource
            {
                ReplaceLocalFilesApplication = replaceLocalFilesApplication,
                ResouceRepositoryName = "template-gerador-front-bs4-angular2.0",
                ResourceUrlRepository = "https://github.com/wilsonsantosnet/template-gerador-front-bs4-angular2.0.git",
                ResourceLocalPathFolderExecuteCloning = @"C:\Projetos\Outros\Repositorios",
                ResourceLocalPathDestinationFolrderApplication = @"C:\Projetos\sample-core-ddd-project-with-gerador-angular20\Gerador.Gen\Templates\Front",
            };

        }

        private ExternalResource ConfigExternarResourcesTemplatesBackDDD(bool replaceLocalFilesApplication)
        {

            return new ExternalResource
            {
                ReplaceLocalFilesApplication = true,
                ResouceRepositoryName = "template-gerador-back-DDD",
                ResourceUrlRepository = "https://github.com/wilsonsantosnet/template-gerador-back-DDD.git",
                ResourceLocalPathFolderExecuteCloning = @"C:\Projetos\Outros\Repositorios",
                ResourceLocalPathDestinationFolrderApplication = @"C:\Projetos\sample-core-ddd-project-with-gerador-angular20\Gerador.Gen\Templates\Back"
            };

        }

        private ExternalResource ConfigExternarResourcesFrameworkAngula20Crud(bool replaceLocalFilesApplication)
        {

            return new ExternalResource
            {
                ReplaceLocalFilesApplication = true,
                ResouceRepositoryName = "framework-angular2.0-CRUD",
                ResourceUrlRepository = "https://github.com/wilsonsantosnet/framework-angular2.0-CRUD.git",
                ResourceLocalPathFolderExecuteCloning = @"C:\Projetos\Outros\Repositorios",
                ResourceLocalPathDestinationFolrderApplication = @"C:\Projetos\sample-core-ddd-project-with-gerador-angular20\Seed.Spa.Ui\src\app\common"
            };

        }

        private ExternalResource ConfigExternarResourcesFrameworkCommon(bool replaceLocalFilesApplication)
        {

            return new ExternalResource
            {
                ReplaceLocalFilesApplication = true,
                OnlyFoldersContainsThisName = "Common",
                ResouceRepositoryName = "framework-core-common",
                ResourceUrlRepository = "https://github.com/wilsonsantosnet/framework-core-common.git",
                ResourceLocalPathFolderExecuteCloning = @"C:\Projetos\Outros\Repositorios",
                ResourceLocalPathDestinationFolrderApplication = @"C:\Projetos\sample-core-ddd-project-with-gerador-angular20"
            };

        }

        private ExternalResource ConfigExternarResourcesSeedLayoutBs4Angular20(bool replaceLocalFilesApplication)
        {

            return new ExternalResource
            {
                ReplaceLocalFilesApplication = true,
                DownloadOneTime = true,
				DownloadOneTimeFileVerify = "package.json",
                ResouceRepositoryName = "Seed-layout-front-bs4-angular2.0",
                ResourceUrlRepository = "https://github.com/wilsonsantosnet/Seed-layout-front-bs4-angular2.0.git",
                ResourceLocalPathFolderExecuteCloning = @"C:\Projetos\Outros\Repositorios",
                ResourceLocalPathDestinationFolrderApplication = @"C:\Projetos\sample-core-ddd-project-with-gerador-angular20\Seed.Spa.Ui"
			};

        }
		
		private ExternalResource ConfigExternarResourcesSeedLayoutBs4Angular20OnlyThisFiles(bool replaceLocalFilesApplication)
        {

            return new ExternalResource
            {
                ReplaceLocalFilesApplication = true,
                ResouceRepositoryName = "Seed-layout-front-bs4-angular2.0",
                ResourceUrlRepository = "https://github.com/wilsonsantosnet/Seed-layout-front-bs4-angular2.0.git",
                ResourceLocalPathFolderExecuteCloning = @"C:\Projetos\Outros\Repositorios",
                ResourceLocalPathDestinationFolrderApplication = @"C:\Projetos\sample-core-ddd-project-with-gerador-angular20\Seed.Spa.Ui",
                OnlyThisFiles = new List<string> {
                    "package.json",
                    "Web.config",
                    ".angular-cli.json",
                    "src\\typings.d.ts",
                    "src\\app\\app.component.css",
                    "src\\app\\app.component.html",
                    "src\\app\\app.component.ts",
                    "src\\app\\app.module.ts",
                    "src\\app\\global.service.culture.ts",
                    "src\\app\\global.service.ts",
                    "src\\app\\startup.service.ts",
                    "src\\app\\util\\util-shared.module.ts",
                    "src\\app\\main\\main.component.css",
                    "src\\app\\main\\main.component.html",
                    "src\\app\\main\\main.component.ts",
                    "src\\app\\main\\main.service.ts",
                    "src\\assets\\css\\main.css",
                    "src\\assets\\css\\main.css.map",
                }

            };
        }

        public IEnumerable<ExternalResource> GetConfigExternarReources()
        {
            var replaceLocalFilesApplication = true;

            return new List<ExternalResource>
            {

               ConfigExternarResourcesTemplatesBackDDD(replaceLocalFilesApplication),
               ConfigExternarResourcesFrameworkCommon(replaceLocalFilesApplication),
               ConfigExternarResourcesTemplatesFrontBs4Angular20(replaceLocalFilesApplication),
               ConfigExternarResourcesFrameworkAngula20Crud(replaceLocalFilesApplication),
               ConfigExternarResourcesSeedLayoutBs4Angular20(replaceLocalFilesApplication),
               ConfigExternarResourcesSeedLayoutBs4Angular20OnlyThisFiles(replaceLocalFilesApplication)

            };

        }


    }
}
