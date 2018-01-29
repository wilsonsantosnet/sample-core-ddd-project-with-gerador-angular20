import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { ViewModel } from 'app/common/model/viewmodel';
import { SampleTypeService } from '../sampletype.service';
import { LocationHistoryService } from 'app/common/services/location.history';

@Component({
    selector: 'app-sampletype-create',
    templateUrl: './sampletype-create.component.html',
    styleUrls: ['./sampletype-create.component.css'],
})
export class SampleTypeCreateComponent implements OnInit {

    @Input() vm: ViewModel<any>;
 
    constructor(private sampleTypeService: SampleTypeService, private route: ActivatedRoute, private router: Router, private ref: ChangeDetectorRef) {

        this.vm = this.sampleTypeService.initVM();
		this.sampleTypeService.detectChanges(this.ref);
    }

    ngOnInit() {

       
    }

    onSave(model) {

        this.sampleTypeService.save(model).subscribe((result) => {
            this.router.navigate([LocationHistoryService.getLastNavigation()])
        });
    }

}
