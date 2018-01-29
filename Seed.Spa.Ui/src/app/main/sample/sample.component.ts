import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, FormGroup, FormControl} from '@angular/forms';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { SampleService } from './sample.service';
import { ViewModel } from 'app/common/model/viewmodel';
import { GlobalService, NotificationParameters} from '../../global.service';
import { ComponentBase } from '../../common/components/component.base';

@Component({
    selector: 'app-sample',
    templateUrl: './sample.component.html',
    styleUrls: ['./sample.component.css'],
})
export class SampleComponent extends ComponentBase implements OnInit, OnDestroy {

    vm: ViewModel<any>;

    operationConfimationYes: any;
	changeCultureEmitter: EventEmitter<string>;

	@ViewChild('filterModal') private filterModal: ModalDirective;
    @ViewChild('saveModal') private saveModal: ModalDirective;
    @ViewChild('editModal') private editModal: ModalDirective;
    @ViewChild('detailsModal') private detailsModal: ModalDirective;
	
    constructor(private sampleService: SampleService, private router: Router, private ref: ChangeDetectorRef) {

        super();
		this.vm = null;
    }

    ngOnInit() {

		this.vm = this.sampleService.initVM();
		this.sampleService.detectChanges(this.ref);

        this.sampleService.get().subscribe((result) => {
            this.vm.filterResult = result.dataList;
            this.vm.summary = result.summary;
        });

		this.updateCulture();

        this.changeCultureEmitter = GlobalService.getChangeCultureEmitter().subscribe((culture) => {
            this.updateCulture(culture);
        });

    }

	updateCulture(culture: string = null)
    {
        this.sampleService.updateCulture(culture).then(infos => {
            this.vm.infos = infos;
            this.vm.grid = this.sampleService.getInfoGrid(infos);
        });
    }


    public onFilter(modelFilter) {

        this.sampleService.get(modelFilter).subscribe((result) => {
            this.vm.filterResult = result.dataList;
            this.vm.summary = result.summary;
			this.filterModal.hide();
        })
    }

    public onExport() {
        this.sampleService.export().subscribe((result) => {
            var blob = new Blob([result._body], {
                type: 'application/vnd.ms-excel'
            });
            var downloadUrl = window.URL.createObjectURL(blob);
            window.location.href = downloadUrl;
        })
    }

	public onCreate() {

        this.showContainerCreate();
        this.vm.model = {};
        this.saveModal.show();
    }

    public onEdit(model) {
        this.vm.model = {};
        this.sampleService.get(model).subscribe((result) => {
            this.vm.model = result.dataList[0];
			this.showContainerEdit();
			this.editModal.show();
        })
    }

    public onSave(model) {

        this.sampleService.save(model).subscribe((result) => {

            this.vm.filterResult = this.vm.filterResult.filter(function (model) {
                return  model.sampleId != result.data.sampleId;
            });

            this.vm.filterResult.push(result.data);
            this.vm.summary.total = this.vm.filterResult.length

			if (!this.vm.manterTelaAberta) {
                this.saveModal.hide();
                this.editModal.hide();
				this.hideContainerCreate();
                this.hideContainerEdit();
            }

        });

    }

    public onDetails(model) {

        this.showContainerDetails();
        this.vm.details = {};
        this.detailsModal.show();
        this.sampleService.get(model).subscribe((result) => {
            this.vm.details = result.dataList[0];
        })

    }

    public onCancel() {

        this.saveModal.hide();
        this.editModal.hide();
        this.detailsModal.hide();
		this.filterModal.hide();
		this.hideComponents();
    }

	public onShowFilter() {
		this.showContainerFilters();
        this.filterModal.show();
    }

    public onClearFilter() {
        this.vm.modelFilter = {};
    }

    public onPrint(model) {
        this.router.navigate(['/sample/print', model.sampleId]);
    }

    public onDeleteConfimation(model) {



        var conf = GlobalService.operationExecutedParameters(
            "confirm-modal",
            () => {
                this.sampleService.delete(model).subscribe((result) => {
                    this.vm.filterResult = this.vm.filterResult.filter(function (model) {
                        return  model.sampleId != result.data.sampleId;
                    });
                    this.vm.summary.total = this.vm.filterResult.length
                });
            }
        );

        GlobalService.getOperationExecutedEmitter().emit(conf);
    }

    public onConfimationYes() {
        this.operationConfimationYes();
    }

    public onPageChanged(pageConfig) {

        let modelFilter = this.sampleService.pagingConfig(this.vm.modelFilter, pageConfig);
        this.sampleService.get(modelFilter).subscribe((result) => {
            this.vm.filterResult = result.dataList;
            this.vm.summary = result.summary;
        });
    }

    public onOrderBy(order) {

        let modelFilter = this.sampleService.orderByConfig(this.vm.modelFilter, order);
        this.sampleService.get(modelFilter).subscribe((result) => {
            this.vm.filterResult = result.dataList;
            this.vm.summary = result.summary;
        });
    }

	ngOnDestroy() {
        this.changeCultureEmitter.unsubscribe();
    }

}
