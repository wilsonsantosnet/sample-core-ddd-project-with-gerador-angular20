using Common.Validation;
using Seed.Domain.Entitys;

namespace Seed.Domain.Validations
{
    public class SampleTypeEstaConsistenteValidation : ValidatorSpecification<SampleType>
    {
        public SampleTypeEstaConsistenteValidation()
        {
            //base.Add(Guid.NewGuid().ToString(), new Rule<SampleType>(Instance of RuleClassName,"message for user"));
        }

    }
}
