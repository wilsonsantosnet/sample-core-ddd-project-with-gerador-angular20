using Common.Domain.Base;
using Common.Domain.Interfaces;
using Common.Domain.Model;
using Seed.Domain.Entitys;
using Seed.Domain.Filter;
using Seed.Domain.Interfaces.Repository;
using Seed.Domain.Validations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Seed.Domain.Services
{
    public class SampleServiceBase : ServiceBase<Sample>
    {
        protected readonly ISampleRepository _rep;

        public SampleServiceBase(ISampleRepository rep, ICache cache, CurrentUser user)
            : base(cache)
        {
            this._rep = rep;
			this._user = user;
        }

        public virtual async Task<Sample> GetOne(SampleFilter filters)
        {
            return await this._rep.GetById(filters);
        }

        public virtual async Task<IEnumerable<Sample>> GetByFilters(SampleFilter filters)
        {
            var queryBase = this._rep.GetBySimplefilters(filters);
            return await this._rep.ToListAsync(queryBase);
        }

        public virtual Task<PaginateResult<Sample>> GetByFiltersPaging(SampleFilter filters)
        {
            var queryBase = this._rep.GetBySimplefilters(filters);
            return this._rep.PagingAndDefineFields(filters, queryBase);
        }

        public override void Remove(Sample sample)
        {
            this._rep.Remove(sample);
        }

        public virtual Summary GetSummary(PaginateResult<Sample> paginateResult)
        {
            return new Summary
            {
                Total = paginateResult.TotalCount,
				PageSize = paginateResult.PageSize,
            };
        }

        public virtual ValidationSpecificationResult GetDomainValidation(FilterBase filters = null)
        {
            return base._validationResult;
        }

        public virtual ConfirmEspecificationResult GetDomainConfirm(FilterBase filters = null)
        {
            return base._validationConfirm;
        }

        public virtual WarningSpecificationResult GetDomainWarning(FilterBase filters = null)
        {
            return base._validationWarning;
        }

        public override async Task<Sample> Save(Sample sample, bool questionToContinue = false)
        {
			var sampleOld = await this.GetOne(new SampleFilter { SampleId = sample.SampleId });
			var sampleOrchestrated = await this.DomainOrchestration(sample, sampleOld);

            if (questionToContinue)
            {
                if (base.Continue(sampleOrchestrated, sampleOld) == false)
                    return sampleOrchestrated;
            }

            return this.SaveWithValidation(sampleOrchestrated, sampleOld);
        }

        public override async Task<Sample> SavePartial(Sample sample, bool questionToContinue = false)
        {
            var sampleOld = await this.GetOne(new SampleFilter { SampleId = sample.SampleId });
			var sampleOrchestrated = await this.DomainOrchestration(sample, sampleOld);

            if (questionToContinue)
            {
                if (base.Continue(sampleOrchestrated, sampleOld) == false)
                    return sampleOrchestrated;
            }

            return SaveWithOutValidation(sampleOrchestrated, sampleOld);
        }

        protected override Sample SaveWithOutValidation(Sample sample, Sample sampleOld)
        {
            sample = this.SaveDefault(sample, sampleOld);

			if (base._validationResult.IsNotNull() && !base._validationResult.IsValid)
				return sample;

            base._validationResult = new ValidationSpecificationResult
            {
                Errors = new List<string>(),
                IsValid = true,
                Message = "sample Alterado com sucesso."
            };

            base._cacheHelper.ClearCache();
            return sample;

        }

		protected override Sample SaveWithValidation(Sample sample, Sample sampleOld)
        {
            if (!this.DataAnnotationIsValid())
                return sample;

            if (!sample.IsValid())
            {
                base._validationResult = sample.GetDomainValidation();
                return sample;
            }

            this.Specifications(sample);

            if (!base._validationResult.IsValid)
                return sample;
            
            sample = this.SaveDefault(sample, sampleOld);
            base._validationResult.Message = "Sample cadastrado com sucesso :)";

            base._cacheHelper.ClearCache();
            return sample;
        }

		protected virtual void Specifications(Sample sample)
        {
            base._validationResult  = new SampleAptoParaCadastroValidation(this._rep).Validate(sample);
			base._validationWarning  = new SampleAptoParaCadastroWarning(this._rep).Validate(sample);
        }

        protected virtual Sample SaveDefault(Sample sample, Sample sampleOld)
        {
			

            var isNew = sampleOld.IsNull();			
            if (isNew)
                sample = this.AddDefault(sample);
            else
				sample = this.UpdateDefault(sample);

            return sample;
        }
		
        protected virtual Sample AddDefault(Sample sample)
        {
            sample = this._rep.Add(sample);
            return sample;
        }

		protected virtual Sample UpdateDefault(Sample sample)
        {
            sample = this._rep.Update(sample);
            return sample;
        }
				
		public virtual async Task<Sample> GetNewInstance(dynamic model, CurrentUser user)
        {
            return await Task.Run(() =>
            {
                return new Sample.SampleFactory().GetDefaultInstance(model, user);
            });
         }

		public virtual async Task<Sample> GetUpdateInstance(dynamic model, CurrentUser user)
        {
            return await Task.Run(() =>
            {
                return new Sample.SampleFactory().GetDefaultInstance(model, user);
            });
         }
    }
}
