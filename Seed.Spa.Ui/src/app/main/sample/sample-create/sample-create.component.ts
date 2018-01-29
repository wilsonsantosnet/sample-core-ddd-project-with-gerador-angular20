import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { ViewModel } from 'app/common/model/viewmodel';
import { SampleService } from '../sample.service';
import { LocationHistoryService } from 'app/common/services/location.history';

@Component({
    selector: 'app-sample-create',
    templateUrl: './sample-create.component.html',
    styleUrls: ['./sample-create.component.css'],
})
export class SampleCreateComponent implements OnInit {

    @Input() vm: ViewModel<any>;
 
    constructor(private sampleService: SampleService, private route: ActivatedRoute, private router: Router, private ref: ChangeDetectorRef) {

        this.vm = this.sampleService.initVM();
		this.sampleService.detectChanges(this.ref);
    }

    ngOnInit() {

       
    }

    onSave(model) {

        this.sampleService.save(model).subscribe((result) => {
            this.router.navigate([LocationHistoryService.getLastNavigation()])
        });
    }

}
