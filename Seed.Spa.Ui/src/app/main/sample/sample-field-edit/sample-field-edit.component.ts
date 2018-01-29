import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { SampleService } from '../sample.service';
import { ViewModel } from 'app/common/model/viewmodel';

@Component({
    selector: 'app-sample-field-edit',
    templateUrl: './sample-field-edit.component.html',
    styleUrls: ['./sample-field-edit.component.css']
})
export class SampleFieldEditComponent implements OnInit {

    @Input() vm: ViewModel<any>


    constructor(private sampleService: SampleService, private ref: ChangeDetectorRef) { }

    ngOnInit() { }

	ngOnChanges() {
       this.ref.detectChanges()
	}

        

   
}
