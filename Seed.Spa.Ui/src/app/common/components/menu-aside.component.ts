﻿import { Component, OnInit, Input, SecurityContext, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'app/common/services/auth.service';

@Component({
    selector: 'app-menu-aside',
    template: `
  <div class="gc-menu">
    <div class="gc-menu__header">
      <div class="gc-menu__header__brand">
        <a href="/"><img src="../../assets/img/logo.png" alt="Home" /></a>
      </div>
      <div class="gc-profile">
        <div class="gc-profile__avatar">
          <div [ngStyle]="{'background-image': san(vm.avatar), 'width': '90px', 'height': '90px','background-size': 'cover','background-position': 'center','border-radius': '50%' }"></div>
        </div>
        <div class="gc-profile__title">
          <h3 class="gc-profile__name"><b> {{vm.userName}}</b></h3>
          <p class="gc-profile__infos"><span class="badge badge-pill badge-default">{{vm.userRole}}</span></p>
        </div>
      </div>
    </div>
    <ul class="gc-menu__list list-unstyled">
      <li *ngFor="let item of vm.menu">
        <a routerLink="{{item.Value}}">
          <span class="gc-menu__list__icon {{item.Icon}}"></span>
          <span class="gc-menu__list__text">{{item.Name}}</span>
        </a>
      </li>
    </ul>
  </div>
  <div class="gc-header">
  <nav class="navbar navbar-toggleable navbar-light bg-faded d-flex justify-content-start">
    <button type="button" class="btn btn-default btn-toggler" title="Minimizar menu" data-mockup="main-menu" (click)="_onToggleMenu($event)">
      <span class="fa fa-bars" aria-hidden="true"></span>
    </button>

    <a class="navbar-brand p-2" href="/"><img src="../../assets/img/logo.png"></a>

    <div class="form-inline p-2">
      <input class="form-control mr-sm-2" type="text" placeholder="Procurar tarefa" [(ngModel)]="filter">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit" (click)="_onFilter(filter)">Buscar</button>
    </div>
    <ul class="navbar-nav ml-auto p-2">
      <li class="nav-item">
        <a class="nav-link" 
          popover="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
          popoverTitle="Notificações"
          placement="bottom"
          href="#" title="Notificações" ><span class="fa fa-bullhorn" aria-hidden="true" style="color:red"></span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" title="Sair" (click)="_onLogout($event)"><span class="fa fa-sign-out" aria-hidden="true"></span> Sair</a>
      </li>
    </ul>
  </nav>
</div>`,
})
export class MenuAsideComponent  implements OnInit {

    @Output() onToggleMenu = new EventEmitter<any>();
    @Output() onLogout = new EventEmitter<any>();
    @Output() onFilter = new EventEmitter<any>();
    @Input() vm: any;
    @Input() folderAvatar: any;
    @Input() notification: any[];

    filter: string;

    constructor(private sanitizer: DomSanitizer, private authService: AuthService) { }

    

    ngOnInit() {
    }

    san(fileName : any) {
        var _url = "url('" + this.vm.downloadUri + "/" + this.folderAvatar + "/" + (fileName || 'vazio.png') + "')";
        return this.sanitizer.sanitize(SecurityContext.HTML, _url)
    }

    _onToggleMenu(event: any) {
        this.onToggleMenu.emit(event);
    }

    _onLogout(event: any) {
        this.onLogout.emit(event);
    }

    _onFilter(event: any) {
        this.onFilter.emit(event);
    }
}
