import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { SampleTypeService } from '../sampletype.service';
import { ViewModel } from 'app/common/model/viewmodel';

@Component({
    selector: 'app-sampletype-field-edit',
    templateUrl: './sampletype-field-edit.component.html',
    styleUrls: ['./sampletype-field-edit.component.css']
})
export class SampleTypeFieldEditComponent implements OnInit {

    @Input() vm: ViewModel<any>


    constructor(private sampleTypeService: SampleTypeService, private ref: ChangeDetectorRef) { }

    ngOnInit() { }

	ngOnChanges() {
       this.ref.detectChanges()
	}

        

   
}
