using System;
using System.Linq;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Seed.Dto
{
	public class SampleTypeDtoSpecializedResult : SampleTypeDto
	{

        public IEnumerable<SampleDto> CollectionSample { get; set;} 

		
	}
}