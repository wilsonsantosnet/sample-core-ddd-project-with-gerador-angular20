import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormControl } from '@angular/forms';

import { ApiService } from 'app/common/services/api.service';
import { ServiceBase } from 'app/common/services/service.base';
import { ViewModel } from 'app/common/model/viewmodel';
import { GlobalService } from '../global.service';
import { GlobalServiceCulture, Translated, TranslatedField } from '../global.service.culture';

@Injectable()
export class MainService extends ServiceBase {


    constructor(private globalServiceCulture: GlobalServiceCulture, private api: ApiService<any>) {
        super();
    }

    updateCulture(vm: any, culture: string = null) {
        this.getInfosTranslated(this.globalServiceCulture.defineCulture(culture)).then((result: any) => {
            vm.generalInfo = result;
        });
    }

    resetCulture() {
        this.globalServiceCulture.reset();
    }

    getInfosTranslated(culture: string) {

        var grupo = "Geral";
        return this.globalServiceCulture.getResource(grupo, culture, this.getInfosFields(), (culture: any, infosFields: any) => {
            return new Promise((resolve, reject) => {
                var translated = new Translated([
                    new TranslatedField("pt-BR", "Voltar", "pra traz"),
                    new TranslatedField("pt-BR", "NovoItem", "Add")
                ]);
                return resolve(this.globalServiceCulture.setResource(grupo, translated.get(culture), infosFields));
            });
        });
    }

    getInfos() {
        return this.getInfosFields();
    }

    getInfosFields() {
        return {
            buscar: { label: 'Buscar' },
            voltar: { label: 'Voltar' },
            sair: { label: 'Sair' },
            filtro: { label: 'Filtros' },
            novoItem: { label: 'Novo item' },
            titulo: { label: 'Titulo' },
            acao: { label: 'AÃ§Ã£o' },
            totalRegistro: { label: 'Total de registros' },
            proximo: { label: 'PrÃ³ximo' },
            anterior: { label: 'Anterior' },
            filtrar: { label: 'Filtrar' },
            salvar: { label: 'Salvar' },
            cancelar: { label: 'Cancelar' },
            sim: { label: 'Ok' },
            imprimir: { label: 'Imprimir' },
            procurar: { label: 'Procurar' },
            excluir: { label: 'Excluir' },
        }
    }
}