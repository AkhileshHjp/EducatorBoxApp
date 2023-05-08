import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router,NavigationEnd} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackBtnService {

  private previousUrl: string = "";
  private currentUrl: string = "";

  constructor(
    private router:Router,
    private platform : Platform,
    private location : Location,
  ) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
  }

  back(){
    this.platform.ready().then(()=>{
      App.addListener('backButton',()=>{
        if(this.router.url!="/") {
          window.location.replace(this.previousUrl)
          window.location.href = this.previousUrl;
        }else{
          App.exitApp();
        }
      })
    })
  }
}