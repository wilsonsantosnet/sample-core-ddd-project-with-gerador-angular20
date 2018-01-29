using Common.Validation;
using Seed.Domain.Entitys;
using Seed.Domain.Interfaces.Repository;

namespace Seed.Domain.Validations
{
    public class SampleTypeAptoParaCadastroValidation : ValidatorSpecification<SampleType>
    {
        public SampleTypeAptoParaCadastroValidation(ISampleTypeRepository rep)
        {
            //base.Add(Guid.NewGuid().ToString(), new Rule<SampleType>(Instance of RuleClassName,"message for user"));
        }

    }
}
