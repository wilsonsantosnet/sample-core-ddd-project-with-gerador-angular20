using Common.Validation;
using Seed.Domain.Entitys;
using Seed.Domain.Interfaces.Repository;

namespace Seed.Domain.Validations
{
    public class SampleAptoParaCadastroValidation : ValidatorSpecification<Sample>
    {
        public SampleAptoParaCadastroValidation(ISampleRepository rep)
        {
            //base.Add(Guid.NewGuid().ToString(), new Rule<Sample>(Instance of RuleClassName,"message for user"));
        }

    }
}
