import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap/pagination'
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TagInputModule } from 'ngx-chips';
import { TextMaskModule } from 'angular2-text-mask';

import { DataSourceDirective } from './directives/select-datasource.directive';
import { MaskInputDirective } from './directives/mask-input.directive';
import { DateDirective } from './directives/date.directive';
import { DateTimeDirective } from './directives/date.time.directive';
import { BindCustomComponent } from './components/bind-custom.component';
import { MakeGridComponent } from './components/grid.component'
import { MakePaginationComponent } from 'app/common/components/pagination.component';
import { CepComponent } from 'app/common/components/cep.component';
import { TreeViewComponent } from 'app/common/components/tree-view.component';
import { NestabaleTreeComponent } from 'app/common/components/nestable-tree.component';
import { UploadCustomComponent } from 'app/common/components/upload-file.component';
import { MultiSelectComponent } from 'app/common/components/multiselect.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { MaskFormatPipe } from './pipes/mask.pipe';
import { EditorHtmlDiretive } from './directives/editor-html.directive';
import { TagCustomComponent } from 'app/common/components/tag.component';
import { DomElemetAppendDirective } from 'app/common/directives/dom-elemet-apped.directive';
import { CallerDiretive } from 'app/common/directives/caller.directive';
import { NestableDirective } from 'app/common/directives/nestable.directive';
import { MultiSelectFunnelComponent } from 'app/common/components/multiselect-funnel.component';
import { CepDirective } from "app/common/directives/cep.directive";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PaginationModule.forRoot(),
        ModalModule.forRoot(),
        FormsModule,
        TextMaskModule,
        TagInputModule,
        TabsModule.forRoot()
    ],
    declarations: [
        BindCustomComponent,
        MakePaginationComponent,
        DataSourceDirective,
        MaskInputDirective,
        DateDirective,
        DateTimeDirective,
    	CepDirective,
        EditorHtmlDiretive,
        DomElemetAppendDirective,
        MakeGridComponent,
        CepComponent,
        TreeViewComponent,
        NestabaleTreeComponent,
        UploadCustomComponent,
        MultiSelectComponent,
        MultiSelectFunnelComponent,
        DateFormatPipe,
        MaskFormatPipe,
        TagCustomComponent,
        CallerDiretive,
        NestableDirective,
    ],
    providers: [
    ],
    exports: [
        BindCustomComponent,
        MakePaginationComponent,
        MakeGridComponent,
        CepComponent,
    	CepDirective,
        TreeViewComponent,
        NestabaleTreeComponent,
        UploadCustomComponent,
        MultiSelectComponent,
        MultiSelectFunnelComponent,
        TagCustomComponent,
        DataSourceDirective,
        MaskInputDirective,
        DateDirective,
        DateTimeDirective,
        EditorHtmlDiretive,
        DomElemetAppendDirective,
        CallerDiretive,
        NestableDirective,
        TextMaskModule,
        TagInputModule,
        TabsModule
	]
})
export class CommonSharedModule {

}
