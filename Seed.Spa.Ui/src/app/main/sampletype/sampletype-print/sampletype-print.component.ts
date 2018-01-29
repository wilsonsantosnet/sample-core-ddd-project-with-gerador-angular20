import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { SampleTypeService } from '../sampletype.service';
import { ViewModel } from 'app/common/model/viewmodel';

@Component({
    selector: 'app-sampletype-print',
    templateUrl: './sampletype-print.component.html',
    styleUrls: ['./sampletype-print.component.css'],
})
export class SampleTypePrintComponent implements OnInit {

    vm: ViewModel<any>;
    id: number;
    private sub: any;

    constructor(private sampleTypeService: SampleTypeService, private route: ActivatedRoute) {
		this.vm = null;
    }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id']; 
        });

        this.vm = this.sampleTypeService.initVM();

        this.sampleTypeService.get({ id: this.id }).subscribe((data) => {
            this.vm.details = data.data;
        })

    }
    
	onPrint() {
        window.print();
	}
   


}
