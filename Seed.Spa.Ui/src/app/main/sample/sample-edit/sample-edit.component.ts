import { Component, OnInit, Input,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { ViewModel } from 'app/common/model/viewmodel';
import { SampleService } from '../sample.service';
import { GlobalService, NotificationParameters} from '../../../global.service';
import { LocationHistoryService } from 'app/common/services/location.history';

@Component({
    selector: 'app-sample-edit',
    templateUrl: './sample-edit.component.html',
    styleUrls: ['./sample-edit.component.css'],
})
export class SampleEditComponent implements OnInit {

    @Input() vm: ViewModel<any>;
    id: number;
    private sub: any;

    constructor(private sampleService: SampleService, private route: ActivatedRoute, private router: Router, private ref: ChangeDetectorRef) {

		 this.vm = null;

    }

    ngOnInit() {

		this.vm = this.sampleService.initVM();
		this.sampleService.detectChanges(this.ref);

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id']; 
        });

		setTimeout(() => {
        this.sampleService.get({ id: this.id }).subscribe((data) => {
            this.vm.model = data.data;
			GlobalService.getNotificationEmitter().emit(new NotificationParameters("edit", {
                model: this.vm.model
            }));
        })}, 250);

    }

    onSave(model) {

        this.sampleService.save(model).subscribe((result) => {
            this.router.navigate([LocationHistoryService.getLastNavigation()])
        });
    }

}
