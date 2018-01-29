import { ViewRef_ } from "@angular/core/src/view";
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { GlobalServiceCulture, Translated, TranslatedField } from '../../global.service.culture';
import { MainService } from '../../main/main.service';
import { CacheService } from 'app/common/services/cache.service';
import { ECacheType } from 'app/common/type-cache.enum';
import { ModalDirective } from 'ngx-bootstrap/modal';


export class ServiceBase {


    protected _interval: any;

    protected getInfoGrid(infos: any) {
        var list = [];
        for (let key in infos) {
            var info = infos[key];
            if (info.list == true)
                list.push({ key: key, info: info });
        }
        return list;
    }

    protected objectToArray(infos: any) {

        var list = [];
        for (let key in infos) {

            var info = infos[key];

            list.push(info);
        }
        return list;
    }

    protected objectToArrayWithKeys(infos: any) {

        var list = [];
        for (let key in infos) {

            var info = infos[key];

            list.push({
                key: key,
                infos: info
            });
        }
        return list;
    }

    public pagingConfig(modelFilter: any, pageConfig: any) {

        return Object.assign(modelFilter, {
            PageIndex: pageConfig.PageIndex,
            PageSize: pageConfig.PageSize,
            IsPagination: true
        });

    }

    public orderByConfig(modelFilter: any, order: any) {

        return Object.assign(modelFilter, {
            OrderByType: order.asc ? "OrderBy" : "OrderByDescending",
            OrderFields: [order.field]
        });

    }

    public detectChanges(changeDetector: any) {

        if (this._interval)
            return;

        changeDetector.detach();

        this._interval = setInterval(() => {
            changeDetector.reattach();

            if (changeDetector && !(changeDetector as ViewRef_).destroyed) {
                changeDetector.detectChanges();
            }

            changeDetector.detach();
        }, 250);
    }

    public detectChangesStop() {
        if (this._interval)
            clearInterval(this._interval);
    }

    public masksConfig() {

        let decimalMask = createNumberMask({
            prefix: '',
            allowDecimal: true,
            includeThousandsSeparator: false,
        })

        return {
            maskUF: [/\D/, /\D/,],
            maskCEP: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
            maskCPF: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
            maskCNPJ: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
            maskDDD: ['(', /\d/, /\d/, ')'],
            maskOnlyTelefone: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/],
            maskTelefone: ['(', /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/],
            maskHorario: [/\d/, /\d/, ':', /\d/, /\d/],
            CartaoCredito: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
            maskDecimal: decimalMask
        }

    }

    public tagTransformToShow(value: any, readonly: any) {
        var tagItems = value ? value.split(',') : value;
        var tags = [];
        if (tagItems) {
            for (var i = 0; i < tagItems.length; i++) {
                tags.push({
                    display: tagItems[i],
                    value: tagItems[i],
                    readonly: readonly
                })
            }
        }
        return tags;
    }

    public tagTransformToSave(value: any) {
        if (value) {
            return value.map((item: any) => {
                return item.value
            }).toString();
        }
        return value;
    }

    public mergeInfoFields(defaultInfosFields: any, moreInfosFields: any) {

        let dataArrayDefault = this.objectToArrayWithKeys(defaultInfosFields);
        if (moreInfosFields) {
            let dataArrayMore = this.objectToArrayWithKeys(moreInfosFields);

            dataArrayMore.forEach((_elemetMore) => {
                dataArrayDefault = dataArrayDefault.map((_elemetDefault) => {
                    if (_elemetDefault.key == _elemetMore.key)
                        return _elemetMore;
                    else {
                        return _elemetDefault;
                    }
                })

                let dataArrayDefaultExists = dataArrayDefault.filter((_elemetDefault) => {
                    return _elemetDefault.key == _elemetMore.key
                })

                if (dataArrayDefaultExists.length == 0)
                    dataArrayDefault.push(_elemetMore)
            })
        }

        let objMerged : any = {};
        if (moreInfosFields) {
            dataArrayDefault.forEach((item) => {
                objMerged[item.key] = item.infos;
            });
        } else {
            dataArrayDefault.forEach((item) => {
                objMerged[item.key] = item.infos;
            });
        }


        return objMerged;
    }

    public saveFilters(modelFilter: any, key: any) {
        CacheService.add(key, JSON.stringify(modelFilter), ECacheType.LOCAL);
        return modelFilter;
    }

    public getFilters(key: any) {
        return JSON.parse(CacheService.get(key, ECacheType.LOCAL));
    }
    
    public ExtractDate(data: any) {
        return new Date(data.split('/')[2].split(' ')[0], data.split('/')[1] - 1, data.split('/')[0], data.split('/')[2].split(' ')[1].split(':')[0], data.split('/')[2].split(' ')[1].split(':')[1]);
    } 

    public OnHide(saveModal: ModalDirective, editModal: ModalDirective, hideFunction: any) {
        editModal.onHide.subscribe(() => {
            hideFunction();
        });

        saveModal.onHide.subscribe(() => {
            hideFunction();
        });
    }

}
