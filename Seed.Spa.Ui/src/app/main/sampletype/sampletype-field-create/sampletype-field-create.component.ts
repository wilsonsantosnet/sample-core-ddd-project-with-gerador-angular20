import { Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import { SampleTypeService } from '../sampletype.service';

import { ViewModel } from 'app/common/model/viewmodel';

@Component({
    selector: 'app-sampletype-field-create',
    templateUrl: './sampletype-field-create.component.html',
    styleUrls: ['./sampletype-field-create.component.css']
})
export class SampleTypeFieldCreateComponent implements OnInit {

    @Input() vm: ViewModel<any>;


   constructor(private sampleTypeService: SampleTypeService, private ref: ChangeDetectorRef) { }

    ngOnInit() {}

	ngOnChanges() {
       this.ref.detectChanges()
	}

   


}
