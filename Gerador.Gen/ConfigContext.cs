using Common.Gen;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Seed.Gen
{
    public class ConfigContext
    {
        #region Config Contexts

        private Context ConfigContextSeed()
        {
            var contextName = "Seed";

            return new Context
            {

                ConnectionString = ConfigurationManager.ConnectionStrings["Seed"].ConnectionString,

                Namespace = "Seed",
                ContextName = contextName,
                ShowKeysInFront = true,
                LengthBigField = 250,
                OverrideFiles = true,

                OutputClassDomain = ConfigurationManager.AppSettings[string.Format("outputClassDomain{0}", contextName)],
                OutputClassInfra = ConfigurationManager.AppSettings[string.Format("outputClassInfra{0}", contextName)],
                OutputClassDto = ConfigurationManager.AppSettings[string.Format("outputClassDto{0}", contextName)],
                OutputClassApp = ConfigurationManager.AppSettings[string.Format("outputClassApp{0}", contextName)],
                OutputClassApi = ConfigurationManager.AppSettings[string.Format("outputClassApi{0}", contextName)],
                OutputClassFilter = ConfigurationManager.AppSettings[string.Format("outputClassFilter{0}", contextName)],
                OutputClassSummary = ConfigurationManager.AppSettings[string.Format("outputClassSummary{0}", contextName)],
                OutputAngular = ConfigurationManager.AppSettings["OutputAngular"],
                OutputClassSso = ConfigurationManager.AppSettings["OutputClassSso"],

                Arquiteture = ArquitetureType.DDD,
                CamelCasing = true,
                MakeFront = true,

                TableInfo = new UniqueListTableInfo
                {

                   new TableInfo { TableName = "Sample", MakeDomain = true, MakeApp = true, MakeDto = true, MakeCrud = true, MakeApi= true, MakeSummary = true , MakeFront= true , FieldsConfig = new List<FieldConfig> {

                       new FieldConfig {
                           Name ="tags",
                           Tags = true
                       }
                   } },
                   new TableInfo { TableName = "SampleType", MakeDomain = true, MakeApp = true, MakeDto = true, MakeCrud = true, MakeApi= true, MakeSummary = true , MakeFront= true},
                   new TableInfo { TableName = "ManySampleType", MakeDomain = true, MakeApp = true, MakeDto = true, MakeCrud = true, MakeApi= true, MakeSummary = true , MakeFront= true}

                }
            };
        }



        public IEnumerable<Context> GetConfigContext()
        {

            return new List<Context>
            {

                ConfigContextSeed(),

            };

        }

        #endregion
    }
}
