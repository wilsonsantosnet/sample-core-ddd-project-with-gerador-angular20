using Common.Validation;
using Seed.Domain.Entitys;

namespace Seed.Domain.Validations
{
    public class SampleEstaConsistenteValidation : ValidatorSpecification<Sample>
    {
        public SampleEstaConsistenteValidation()
        {
            //base.Add(Guid.NewGuid().ToString(), new Rule<Sample>(Instance of RuleClassName,"message for user"));
        }

    }
}
