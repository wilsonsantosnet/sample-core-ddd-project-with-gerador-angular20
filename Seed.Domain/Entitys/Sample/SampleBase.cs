using Common.Domain.Base;
using System;

namespace Seed.Domain.Entitys
{
    public class SampleBase : DomainBase
    {
        public SampleBase()
        {

        }
        public SampleBase(int sampleid, string name, int sampletypeid)
        {
            this.SampleId = sampleid;
            this.Name = name;
            this.SampleTypeId = sampletypeid;

        }

        public virtual int SampleId { get; protected set; }
        public virtual string Name { get; protected set; }
        public virtual string Descricao { get; protected set; }
        public virtual int SampleTypeId { get; protected set; }
        public virtual bool? Ativo { get; protected set; }
        public virtual int? Age { get; protected set; }
        public virtual int? Category { get; protected set; }
        public virtual DateTime? Datetime { get; protected set; }
        public virtual string Tags { get; protected set; }


		public virtual void SetarDescricao(string descricao)
		{
			this.Descricao = descricao;
		}
		public virtual void SetarAtivo(bool? ativo)
		{
			this.Ativo = ativo;
		}
		public virtual void SetarAge(int? age)
		{
			this.Age = age;
		}
		public virtual void SetarCategory(int? category)
		{
			this.Category = category;
		}
		public virtual void SetarDatetime(DateTime? datetime)
		{
			this.Datetime = datetime;
		}
		public virtual void SetarTags(string tags)
		{
			this.Tags = tags;
		}


    }
}
