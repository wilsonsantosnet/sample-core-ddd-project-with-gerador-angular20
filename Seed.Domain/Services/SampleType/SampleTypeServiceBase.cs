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
    public class SampleTypeServiceBase : ServiceBase<SampleType>
    {
        protected readonly ISampleTypeRepository _rep;

        public SampleTypeServiceBase(ISampleTypeRepository rep, ICache cache, CurrentUser user)
            : base(cache)
        {
            this._rep = rep;
			this._user = user;
        }

        public virtual async Task<SampleType> GetOne(SampleTypeFilter filters)
        {
            return await this._rep.GetById(filters);
        }

        public virtual async Task<IEnumerable<SampleType>> GetByFilters(SampleTypeFilter filters)
        {
            var queryBase = this._rep.GetBySimplefilters(filters);
            return await this._rep.ToListAsync(queryBase);
        }

        public virtual Task<PaginateResult<SampleType>> GetByFiltersPaging(SampleTypeFilter filters)
        {
            var queryBase = this._rep.GetBySimplefilters(filters);
            return this._rep.PagingAndDefineFields(filters, queryBase);
        }

        public override void Remove(SampleType sampletype)
        {
            this._rep.Remove(sampletype);
        }

        public virtual Summary GetSummary(PaginateResult<SampleType> paginateResult)
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

        public override async Task<SampleType> Save(SampleType sampletype, bool questionToContinue = false)
        {
			var sampletypeOld = await this.GetOne(new SampleTypeFilter { SampleTypeId = sampletype.SampleTypeId });
			var sampletypeOrchestrated = await this.DomainOrchestration(sampletype, sampletypeOld);

            if (questionToContinue)
            {
                if (base.Continue(sampletypeOrchestrated, sampletypeOld) == false)
                    return sampletypeOrchestrated;
            }

            return this.SaveWithValidation(sampletypeOrchestrated, sampletypeOld);
        }

        public override async Task<SampleType> SavePartial(SampleType sampletype, bool questionToContinue = false)
        {
            var sampletypeOld = await this.GetOne(new SampleTypeFilter { SampleTypeId = sampletype.SampleTypeId });
			var sampletypeOrchestrated = await this.DomainOrchestration(sampletype, sampletypeOld);

            if (questionToContinue)
            {
                if (base.Continue(sampletypeOrchestrated, sampletypeOld) == false)
                    return sampletypeOrchestrated;
            }

            return SaveWithOutValidation(sampletypeOrchestrated, sampletypeOld);
        }

        protected override SampleType SaveWithOutValidation(SampleType sampletype, SampleType sampletypeOld)
        {
            sampletype = this.SaveDefault(sampletype, sampletypeOld);

			if (base._validationResult.IsNotNull() && !base._validationResult.IsValid)
				return sampletype;

            base._validationResult = new ValidationSpecificationResult
            {
                Errors = new List<string>(),
                IsValid = true,
                Message = "sampletype Alterado com sucesso."
            };

            base._cacheHelper.ClearCache();
            return sampletype;

        }

		protected override SampleType SaveWithValidation(SampleType sampletype, SampleType sampletypeOld)
        {
            if (!this.DataAnnotationIsValid())
                return sampletype;

            if (!sampletype.IsValid())
            {
                base._validationResult = sampletype.GetDomainValidation();
                return sampletype;
            }

            this.Specifications(sampletype);

            if (!base._validationResult.IsValid)
                return sampletype;
            
            sampletype = this.SaveDefault(sampletype, sampletypeOld);
            base._validationResult.Message = "SampleType cadastrado com sucesso :)";

            base._cacheHelper.ClearCache();
            return sampletype;
        }

		protected virtual void Specifications(SampleType sampletype)
        {
            base._validationResult  = new SampleTypeAptoParaCadastroValidation(this._rep).Validate(sampletype);
			base._validationWarning  = new SampleTypeAptoParaCadastroWarning(this._rep).Validate(sampletype);
        }

        protected virtual SampleType SaveDefault(SampleType sampletype, SampleType sampletypeOld)
        {
			

            var isNew = sampletypeOld.IsNull();			
            if (isNew)
                sampletype = this.AddDefault(sampletype);
            else
				sampletype = this.UpdateDefault(sampletype);

            return sampletype;
        }
		
        protected virtual SampleType AddDefault(SampleType sampletype)
        {
            sampletype = this._rep.Add(sampletype);
            return sampletype;
        }

		protected virtual SampleType UpdateDefault(SampleType sampletype)
        {
            sampletype = this._rep.Update(sampletype);
            return sampletype;
        }
				
		public virtual async Task<SampleType> GetNewInstance(dynamic model, CurrentUser user)
        {
            return await Task.Run(() =>
            {
                return new SampleType.SampleTypeFactory().GetDefaultInstance(model, user);
            });
         }

		public virtual async Task<SampleType> GetUpdateInstance(dynamic model, CurrentUser user)
        {
            return await Task.Run(() =>
            {
                return new SampleType.SampleTypeFactory().GetDefaultInstance(model, user);
            });
         }
    }
}
