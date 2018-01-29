import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { ServiceBase } from 'app/common/services/service.base';

@Injectable()
export class SampleTypeServiceFields extends ServiceBase {


    constructor() {
		super()
	}

	getFormFields(moreFormControls? : any) {
		var formControls = Object.assign(moreFormControls || {},{
            name : new FormControl(),
            sampleTypeId : new FormControl(),

        });
		return new FormGroup(formControls);
	}



	getInfosFields(moreInfosFields? : any) {
		var defaultInfosFields = {
			name: { label: 'name', type: 'string', isKey: false, list:true   },
			sampleTypeId: { label: 'sampleTypeId', type: 'int', isKey: true, list:true   },

        };
		return this.mergeInfoFields(defaultInfosFields, moreInfosFields);
    }

}
