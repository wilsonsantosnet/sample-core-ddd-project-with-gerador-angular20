using Common.Domain.Base;
using System;

namespace Seed.Domain.Entitys
{
    public class SampleTypeBase : DomainBase
    {
        public SampleTypeBase()
        {

        }
        public SampleTypeBase(int sampletypeid, string name)
        {
            this.SampleTypeId = sampletypeid;
            this.Name = name;

        }

        public virtual int SampleTypeId { get; protected set; }
        public virtual string Name { get; protected set; }




    }
}
