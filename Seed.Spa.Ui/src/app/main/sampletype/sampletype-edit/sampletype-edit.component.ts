import { Component, OnInit, Input,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { ViewModel } from 'app/common/model/viewmodel';
import { SampleTypeService } from '../sampletype.service';
import { GlobalService, NotificationParameters} from '../../../global.service';
import { LocationHistoryService } from 'app/common/services/location.history';

@Component({
    selector: 'app-sampletype-edit',
    templateUrl: './sampletype-edit.component.html',
    styleUrls: ['./sampletype-edit.component.css'],
})
export class SampleTypeEditComponent implements OnInit {

    @Input() vm: ViewModel<any>;
    id: number;
    private sub: any;

    constructor(private sampleTypeService: SampleTypeService, private route: ActivatedRoute, private router: Router, private ref: ChangeDetectorRef) {

		 this.vm = null;

    }

    ngOnInit() {

		this.vm = this.sampleTypeService.initVM();
		this.sampleTypeService.detectChanges(this.ref);

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id']; 
        });

		setTimeout(() => {
        this.sampleTypeService.get({ id: this.id }).subscribe((data) => {
            this.vm.model = data.data;
			GlobalService.getNotificationEmitter().emit(new NotificationParameters("edit", {
                model: this.vm.model
            }));
        })}, 250);

    }

    onSave(model) {

        this.sampleTypeService.save(model).subscribe((result) => {
            this.router.navigate([LocationHistoryService.getLastNavigation()])
        });
    }

}
