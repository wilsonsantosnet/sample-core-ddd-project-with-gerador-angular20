using Common.Validation;
using Seed.Domain.Entitys;
using Seed.Domain.Interfaces.Repository;

namespace Seed.Domain.Validations
{
    public class SampleTypeAptoParaCadastroWarning : WarningSpecification<SampleType>
    {
        public SampleTypeAptoParaCadastroWarning(ISampleTypeRepository rep)
        {
            //base.Add(Guid.NewGuid().ToString(), new Rule<SampleType>(Instance of RuleClassName,"message for user"));
        }

    }
}
