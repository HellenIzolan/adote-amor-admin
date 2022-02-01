import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './core/services/auth.service';
import { DadosService } from './admin/services/dados.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public user: firebase.User;
  public appPages = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: 'apps'
    },
    {
      title: 'Dados',
      url: '/admin/dados',
      icon: 'duplicate'
    },
    {
      title: 'Contas',
      url: '/admin/contas',
      icon: 'card'
    },
    {
      title: 'Telefones',
      url: '/admin/telefones',
      icon: 'call'
    },
    {
      title: 'Conteúdos',
      url: '/admin/conteudos',
      icon: 'newspaper'
    },
    {
      title: 'Marketing',
      url: '/admin/marketing',
      icon: 'bulb'
    },
    {
      title: 'Animais para Adoção',
      url: '/admin/adocoes',
      icon: 'heart'
    }
  ];

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.authService.authState$.subscribe(user => (this.user = user));
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('admin/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

}
