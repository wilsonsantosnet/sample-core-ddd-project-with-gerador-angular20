using System;
using System.Linq;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Seed.Dto
{
	public class SampleTypeDtoSpecializedDetails : SampleTypeDto
	{

        public IEnumerable<SampleDto> CollectionSample { get; set;} 

		
	}
}