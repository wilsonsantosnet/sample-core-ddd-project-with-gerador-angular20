using Seed.Domain.Validations;
using System;
using Common.Domain.Model;

namespace Seed.Domain.Entitys
{
    public class Sample : SampleBase
    {

        public Sample()
        {

        }

        public Sample(int sampleid, string name, int sampletypeid) :
            base(sampleid, name, sampletypeid)
        {

        }

		public class SampleFactory
        {
            public Sample GetDefaultInstance(dynamic data, CurrentUser user)
            {
                var construction = new Sample(data.SampleId,
                                        data.Name,
                                        data.SampleTypeId);

                construction.SetarDescricao(data.Descricao);
                construction.SetarAtivo(data.Ativo);
                construction.SetarAge(data.Age);
                construction.SetarCategory(data.Category);
                construction.SetarDatetime(data.Datetime);
                construction.SetarTags(data.Tags);


				construction.SetAttributeBehavior(data.AttributeBehavior);
        		return construction;
            }

        }

        public bool IsValid()
        {
            base._validationResult = new SampleEstaConsistenteValidation().Validate(this);
            return base._validationResult.IsValid;

        }
        
    }
}
