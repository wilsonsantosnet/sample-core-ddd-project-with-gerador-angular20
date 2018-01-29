import { Injectable, EventEmitter, NgModule } from '@angular/core'
import { Observable, Observer } from 'rxjs/Rx';
import { ServiceBase } from 'app/common/services/service.base';
import { CacheService } from 'app/common/services/cache.service';
import { ECacheType } from 'app/common/type-cache.enum';


export class Translated {

    private _translatedFields: TranslatedField[];

    constructor(translatedFields: TranslatedField[]) {
        this._translatedFields = translatedFields;
    }

    public adapterData(resources: any[], culture: string, key: string, value: string) {
        this._translatedFields = [];
        if (resources) {
            for (var index in resources) {
                this._translatedFields.push(new TranslatedField(resources[index][culture], resources[index][key], resources[index][value]));
            }
        }
    }

    public adapterDataForCulture(resources: any[], culture: string, key: string, value: string) {
        this._translatedFields = [];
        if (resources) {
            for (var index in resources) {
                this._translatedFields.push(new TranslatedField(culture, resources[index][key], resources[index][value]));
            }
        }
    }

    public getFileResource(grupo: string, culture: string) {
        let v = Math.random();
        return "assets/" + grupo.toLowerCase() + ".service.fields." + culture + ".json?v=" + v;
    }

    public get(culture: string): TranslatedField[] {
        return this._translatedFields.filter((item) => {
            return item.culture == culture;
        });
    }
}

export class TranslatedField {

    public culture: string;
    public key: string;
    public value: string;

    constructor(_culture: string, _key: string, _value: string) {

        this.culture = _culture;
        this.key = _key;
        this.value = _value;
    }
}
export class GlobalServiceCulture extends ServiceBase {


    constructor() {
        super();
    }

    defineCulture(culture: string = null) {

        var _culture = this.getCulture();
        if (culture)
            _culture = culture;

        this.setCulture(_culture);

        return _culture;
    }

    public setCulture(_culture: string) {

        CacheService.add('culture', _culture, ECacheType.COOKIE);
    }

    public getCulture() {

        let culture = CacheService.get('culture', ECacheType.COOKIE);
        return culture ? culture : navigator.language;

    }

    public reset() {
        CacheService.removePartialKey(this.getCulture(), ECacheType.COOKIE);
    }

    public setResource<T>(grupo: string, translatedFields: any[], InfosFields: any) {

        var mergeFileds = this.makeInfoFields(translatedFields, InfosFields);

        if (mergeFileds) {
            this.setResourceCookie(grupo, mergeFileds);
        }

        return mergeFileds;
    }

    public getResource<T>(grupo: string, culture: string, infosFields: any, callbackData: any) {

        var result = CacheService.get(this.makeKeyCookieCulture(culture, grupo), ECacheType.COOKIE);
        if (result) {
            return new Promise((resolve, reject) => {
                return resolve(JSON.parse(result));
            });
        }
        else
            return callbackData(culture, infosFields);
    }

    private makeKeyCookieCulture(culture: any, grupo: any) {
        return culture + '-' + grupo;
    }

    private makeInfoFields(translatedFields: TranslatedField[], InfosFields: any) {

        let _translatedFields = super.objectToArray(translatedFields);
        if (_translatedFields) {

            for (let key in InfosFields) {
                let newField = _translatedFields.filter((item) => {

                    if (item.key == undefined)
                        return false;

                    return item.key.toUpperCase() == key.toUpperCase()
                });

                if (newField.length > 0) {
                    InfosFields[key].label = newField[0].value;
                }
            }
        }

        return InfosFields;
    }

    private setResourceCookie(grupo: any, mergeFileds: any) {
        CacheService.add(this.makeKeyCookieCulture(this.getCulture(), grupo), JSON.stringify(mergeFileds), ECacheType.COOKIE, 1);
    }
}