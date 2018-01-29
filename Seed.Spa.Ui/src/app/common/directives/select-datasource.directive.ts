import { Directive, ElementRef, Renderer, Input, Output, OnInit, EventEmitter, OnDestroy, Optional, Self } from '@angular/core';
import { NgModel, FormControlName } from '@angular/forms';

import { ApiService } from '../services/api.service';
import { GlobalService, NotificationParameters } from "../../global.service";

declare var $: any;

@Directive({
    selector: '[datasource]',
    providers: [NgModel]
})

export class DataSourceDirective implements OnInit, OnDestroy {

    @Input() dataitem: string;
    @Input() endpoint: string;
    @Input() datafilters: any;
    @Input() fieldFilterName: any;
    @Input() disabledOnInit: boolean;
    @Input() enabledSelect2: boolean;
    @Output() change: EventEmitter<any>;

    accessor: any;

    _notificationEmitter: EventEmitter<NotificationParameters>;

    constructor(private _elemetRef: ElementRef, private _renderer: Renderer, private api: ApiService<any>, private ngModel: NgModel, @Optional() @Self() private controlName: FormControlName) {

        this.disabledOnInit = false;
        this.enabledSelect2 = GlobalService.getGlobalSettings().enabledSelect2;
        this.change = new EventEmitter<any>();
        this.fieldFilterName = "nome";
        this._notificationEmitter = new EventEmitter<NotificationParameters>();

    }

    ngOnInit() {

        if (!this.disabledOnInit)
            this.datasource(this._elemetRef.nativeElement);

        this._notificationEmitter = GlobalService.notification.subscribe((not: any) => {

            if (not.event == "create" || not.event == "edit" || not.event == "init") {
                this.init();
            }

            if (not.event == "change") {
                if (not.data.dataitem == this.dataitem)
                    this.datasource(this._elemetRef.nativeElement, not.data.parentFilter);
            }
        });
    }

    init() {
        $(this._elemetRef.nativeElement).val(null).trigger('change');
    }

    get control() {

        if (!this.controlName) {
            return null;
        }

        return this.controlName.control;
    }
    hasFormControl() {
        return this.controlName && this.controlName.control;
    }

    private datasource(el: any, parentFilter?: any) {

        el.options.length = 0;
        let selectedValue = null;
        if (this.ngModel.valueAccessor) {
            this.accessor = this.ngModel.valueAccessor;
            if (this.accessor.value) {
                selectedValue = this.accessor.value;
            }
        }

        if (!this.existsDefaultItem(el))
            this.addOption(el, undefined, "Selecione");

        if (this.enabledSelect2)
            this.select2(el, selectedValue, parentFilter);
        else
            this.select(el, selectedValue, parentFilter);

    }

    private select(el: any, selectedValue: any, parentFilter: any) {

        let filter = Object.assign(this.datafilters || {}, parentFilter || {})
        this.api.setResource(this.dataitem, this.endpoint).getDataitem(filter).subscribe((data) => {

            for (var i = 0; i < data.dataList.length; i++) {
                this.addOption(el, data.dataList[i].id, data.dataList[i].name);
            }

            if (selectedValue)
                el.value = this.accessor.value;

        });

    }

    private select2(el: any, selectedValue: any, parentFilter: any) {

        if (selectedValue) {

            let filterOne = Object.assign(this.datafilters || {}, parentFilter || {})
            filterOne[el.name] = selectedValue;

            this.api.setResource(this.dataitem, this.endpoint).getDataitem(filterOne).subscribe((data) => {

                for (var i = 0; i < data.dataList.length; i++) {
                    this.addOption(el, data.dataList[i].id, data.dataList[i].name);
                }

                if (selectedValue)
                    el.value = this.accessor.value;

                this.select2Config(Object.assign(this.datafilters || {}, parentFilter || {}))
            });
        }
        else {
            this.select2Config(Object.assign(this.datafilters || {}, parentFilter || {}))
        }

    }

    private select2Config(filters: any) {

        let element = $(this._elemetRef.nativeElement);
        let ultimoValor = 0;
        let config = {
            ajax: this.api.setResource(this.dataitem, this.endpoint)
                .getUrlConfig(true, this.fieldFilterName, "GetDataItem", filters)
        }
        $(element)
            .select2(config)
            .on("select2:select", (e: any) => {
                let valor = $(e.currentTarget).val()
                this.updateValue(valor, ultimoValor);
                ultimoValor = valor;
                this.change.emit({
                    target: {
                        value: valor
                    }
                })
            });
    }

    private updateValue(value: any, valueold: any) {

        if (this.ngModel) {
            this.ngModel.viewToModelUpdate(value);

            if (value != valueold) {
                this.ngModel.control.markAsDirty();
            }
        }

        if (this.hasFormControl()) {
            this.control.setValue(value);

            if (value != valueold) {
                this.control.markAsDirty();
            }
        }

    }

    private addOption(el: any, value: any, text: any) {

        if (this.existsItem(el, value))
            return;

        let option = document.createElement("option");
        option.text = text;
        option.value = value;
        el.add(option);
    }

    private existsItem(el: any, value: any) {

        let found = false;
        if (el.options) {
            for (var i = 0; i < el.options.length; i++) {
                if (el.options[i].value == value)
                    found = true;
            }
        }
        return found;
    }

    private existsDefaultItem(el: any) {

        let found = false;
        if (el.options) {
            for (var i = 0; i < el.options.length; i++) {
                if (el.options[i].text == "Selecione")
                    found = true;
            }
        }
        return found;
    }

    ngOnDestroy() {

        $(this._elemetRef.nativeElement).select2()
        $(this._elemetRef.nativeElement).select2('destroy');

        if (this._notificationEmitter)
            this._notificationEmitter.unsubscribe();
    }

}
