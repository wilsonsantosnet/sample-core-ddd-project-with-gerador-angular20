using Seed.Domain.Entitys;
using Seed.Domain.Filter;
using System.Linq;

namespace Seed.Data.Repository
{
    public static class SampleFilterBasicExtension
    {

        public static IQueryable<Sample> WithBasicFilters(this IQueryable<Sample> queryBase, SampleFilter filters)
        {
            var queryFilter = queryBase;

            if (filters.SampleId.IsSent()) 
			{ 
				
				queryFilter = queryFilter.Where(_=>_.SampleId == filters.SampleId);
			}
            if (filters.Name.IsSent()) 
			{ 
				
				queryFilter = queryFilter.Where(_=>_.Name.Contains(filters.Name));
			}
            if (filters.Descricao.IsSent()) 
			{ 
				
				queryFilter = queryFilter.Where(_=>_.Descricao.Contains(filters.Descricao));
			}
            if (filters.SampleTypeId.IsSent()) 
			{ 
				
				queryFilter = queryFilter.Where(_=>_.SampleTypeId == filters.SampleTypeId);
			}
            if (filters.Ativo.IsSent()) 
			{ 
				
				queryFilter = queryFilter.Where(_=>_.Ativo != null && _.Ativo.Value == filters.Ativo);
			}
            if (filters.Age.IsSent()) 
			{ 
				
				queryFilter = queryFilter.Where(_=>_.Age != null && _.Age.Value == filters.Age);
			}
            if (filters.Category.IsSent()) 
			{ 
				
				queryFilter = queryFilter.Where(_=>_.Category != null && _.Category.Value == filters.Category);
			}
            if (filters.DatetimeStart.IsSent()) 
			{ 
				
				queryFilter = queryFilter.Where(_=>_.Datetime != null && _.Datetime.Value >= filters.DatetimeStart.Value);
			}
            if (filters.DatetimeEnd.IsSent()) 
			{ 
				filters.DatetimeEnd = filters.DatetimeEnd.Value.AddDays(1).AddMilliseconds(-1);
				queryFilter = queryFilter.Where(_=>_.Datetime != null &&  _.Datetime.Value <= filters.DatetimeEnd);
			}

            if (filters.Tags.IsSent()) 
			{ 
				
				queryFilter = queryFilter.Where(_=>_.Tags.Contains(filters.Tags));
			}


            return queryFilter;
        }

		
    }
}