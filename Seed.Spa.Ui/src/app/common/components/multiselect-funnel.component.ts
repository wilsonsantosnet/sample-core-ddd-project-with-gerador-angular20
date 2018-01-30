import { Component, NgModule, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { ApiService } from "app/common/services/api.service";
import { GlobalService, NotificationParameters } from "../../global.service";
import { ViewModel } from '../model/viewmodel';

@Component({
    selector: 'multiselect-funnel',
    template: `<div class="row">

      <section class="col-md-5">
        <input type="text" [(ngModel)]='_filterFunnel' class="form-control" name="filter_funnel" style="margin-bottom:20px" (keyup)="onFilterLeft($event)">
      </section>

    </div>
    
    <div class="row no-margin">
      
      <section class="col-md-5 section-scroll-larger">
        

        <div class='checkbox'>
          <label>
              <input [(ngModel)]='_datasourceAllRigth' type='checkbox' (change)='onSelectAllDataSourceRigth($event)' /> Todos
          </label>
        </div>

        <hr>    
        <label>Disponiveis:</label>
        <div class='checkbox'  *ngFor="let option of _datasourceRigth">
          <label>
              <input type='checkbox' [(ngModel)]='option.checked' name='{{ctrlNameItem}}'  value='{{option.id}}' (change)='onChange($event)' /> {{ option.name }}
          </label>
        </div>
      </section>

      <section class="col-md-2" style='padding:43px'>
        <button class="btn btn-default" type="button" (click)="onTransferenciaToRight()"> >> </button>
        <button class="btn btn-default" type="button" (click)="onTransferenciaToLeft()"> << </button>
      </section>
  
      <section class="col-md-5 section-scroll-larger">

        <div class='checkbox'>
          <label>
              <input [(ngModel)]='_datasourceAllLeft' type='checkbox' (change)='onSelectAllDataSourceLeft($event)' /> Todos
          </label>
        </div>

        <hr>    

        <label>Selecionados:</label>
        <div class='checkbox' *ngFor="let option_funnel of _datasourceLeft">
          <label>
              <input type='checkbox' [(ngModel)]='option_funnel.checked' name='{{ctrlNameItem}}'  value='{{option_funnel.id}}'  /> {{ option_funnel.name }}
          </label>
        </div>
      </section>
    </div>
  `

})
export class MultiSelectFunnelComponent implements OnInit, OnDestroy {

    @Input() dataitem: string;
    @Input() datafilters: any;
    @Input() vm: ViewModel<any>
    @Input() endpoint: string;
    @Input() ctrlName: string;
    @Input() ctrlNameItem: string;
    @Input() disabledOnInit: boolean;
    @Input() fieldFilterName: any;

    _datasourceRigth: any[];
    _datasourceAllRigth: boolean;
    _datasourceAllLeft: boolean;
    _datasourceLeft: any[];

    _selectedTemp: any[];
    _modelOutput: any[];
    _collectionjsonTemplate: any;
    _modelInput: any;
    _filter: any;
    _filterFunnel: string

    _notificationEmitter: EventEmitter<NotificationParameters>;
    _filteronstop: any;

    constructor(private api: ApiService<any>) {
        this._filter = {};
        this.fieldFilterName = "nome";
        this._notificationEmitter = new EventEmitter<NotificationParameters>();
        this._filteronstop = null;
    }

    ngOnInit() {

        if (!this.disabledOnInit) {
            this.init();
            this.getInstance();
        }

        this._notificationEmitter = GlobalService.getNotificationEmitter().subscribe((not: any) => {

            if (not.event == "edit" || not.event == "create" || not.event == "init") {
                this.init();
            }
            if (not.event == "change") {
                if (not.data.dataitem == this.dataitem)
                    this.getInstance(not.data.parentFilter);
            }
        })


    }

    init() {
        this._selectedTemp = [];
        this._modelOutput = [];
        this._datasourceRigth = [];
        this._datasourceLeft = [];
        this._modelInput = this.vm.model[this.ctrlName];
        this._collectionjsonTemplate = "";
    }

    onSelectAllDataSourceRigth(e: any) {
        for (var i in this._datasourceRigth) {
            this._datasourceRigth[i].checked = this._datasourceAllRigth;
        }
    }
    onSelectAllDataSourceLeft(e: any) {
        for (var i in this._datasourceLeft) {
            this._datasourceLeft[i].checked = this._datasourceAllLeft;
        }
    }
    onFilterLeft(e: any) {

        if (this._filteronstop)
            clearTimeout(this._filteronstop)

        this._filteronstop = setTimeout(() => {
            this._datasourceRigth = [];
            var filterFunnel: any = {};
            filterFunnel[this.fieldFilterName] = this._filterFunnel;
            this.getInstance(filterFunnel)
        }, 500)
    }
    onChange(e: any) {

    }
    onTransferenciaToRight() {

        for (var i in this._datasourceRigth) {

            if (this._datasourceRigth[i].checked) {
                this._datasourceRigth[i].checked = false;
                this._datasourceLeft.push(this._datasourceRigth[i]);
            }
        }

        this.removeableLeft()
        this.updateModelOutputFunnel();
        this._selectedTemp = [];

    }
    onTransferenciaToLeft() {

        for (let i in this._datasourceLeft) {
            if (this._datasourceLeft[i].checked) {
                this._datasourceLeft[i].checked = false;
                this._datasourceRigth.push(this._datasourceLeft[i]);
            }
        }

        this.removeableRigth();
        this.updateModelOutputFunnel();
        this._selectedTemp = [];

    }

    removeableLeft() {
        this._datasourceLeft.forEach(itemLeft => {
            this._datasourceRigth = this._datasourceRigth.filter((item: any) => {
                return item.id != itemLeft.id;
            });
        });
    }
    removeableRigth() {
        this._datasourceRigth.forEach(itemRigth => {
            this._datasourceLeft = this._datasourceLeft.filter((item: any) => {
                return item.id != itemRigth.id;
            });
        });
    }
    updateModelOutputFunnel() {

        this._modelOutput = [];
        this._datasourceLeft.forEach((item) => {
            this._modelOutput.push(item.id);
        })
        this.serializer();
    }
    serializer() {
        this.vm.model[this.ctrlName] = this.serializeToSave();
    }
    serializeToSave() {

        let items: any = [];

        for (let item in this._modelOutput) {
            items.push(`{ "${this.ctrlNameItem}" : "${this._modelOutput[item]}"}`);
        }

        this._collectionjsonTemplate = `[ ${items.join()} ]`;

        return JSON.parse(this._collectionjsonTemplate);
    }
    getInstance(parentFilter?: any) {
        let filters = Object.assign(this.datafilters || {}, parentFilter || {});
        this.getInstanceMultiSelect(filters);
    }
    getInstanceMultiSelect(filters: any) {
        this.api.setResource(this.dataitem, this.endpoint).getDataitem(filters).subscribe(result => {
            this._datasourceRigth = [];
            for (let item in result.dataList) {
                this._datasourceRigth.push({
                    id: result.dataList[item].id,
                    name: result.dataList[item].name,
                    checked: this._modelInput ? this._modelInput.filter((selecteds: any) => {
                        return selecteds[this.ctrlNameItem] == result.dataList[item].id;
                    }).length > 0 : false
                });
            }
            this.removeableLeft();
            this.onTransferenciaToRight();
            this._modelInput = null;
        });

    }

    ngOnDestroy() {
        if (this._notificationEmitter)
            this._notificationEmitter.unsubscribe();
    }
}
