import { Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import { SampleService } from '../sample.service';

import { ViewModel } from 'app/common/model/viewmodel';

@Component({
    selector: 'app-sample-field-create',
    templateUrl: './sample-field-create.component.html',
    styleUrls: ['./sample-field-create.component.css']
})
export class SampleFieldCreateComponent implements OnInit {

    @Input() vm: ViewModel<any>;


   constructor(private sampleService: SampleService, private ref: ChangeDetectorRef) { }

    ngOnInit() {}

	ngOnChanges() {
       this.ref.detectChanges()
	}

   


}
