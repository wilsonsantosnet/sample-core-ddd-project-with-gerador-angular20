using Seed.Domain.Validations;
using System;
using Common.Domain.Model;

namespace Seed.Domain.Entitys
{
    public class SampleType : SampleTypeBase
    {

        public SampleType()
        {

        }

        public SampleType(int sampletypeid, string name) :
            base(sampletypeid, name)
        {

        }

		public class SampleTypeFactory
        {
            public SampleType GetDefaultInstance(dynamic data, CurrentUser user)
            {
                var construction = new SampleType(data.SampleTypeId,
                                        data.Name);



				construction.SetAttributeBehavior(data.AttributeBehavior);
        		return construction;
            }

        }

        public bool IsValid()
        {
            base._validationResult = new SampleTypeEstaConsistenteValidation().Validate(this);
            return base._validationResult.IsValid;

        }
        
    }
}
