import { AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { BackBtnService } from './back-btn.service';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cms';
  login_deatils: any
  login: any
  internetstatus: any = 1
  constructor(
    private route: Router,
    private servies: BackBtnService
  ) {


    // StatusBar.setOverlaysWebView({overlay:true});
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    if (!this.login) {
      // this.route.navigate(['/']);
      localStorage.clear()
    }
  }

  ngOnInit(): void {
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      this.internetstatus = status
      if (status.connectionType == 'none') {
        alert('No internet connection')
        this.route.navigate(['/'])
        App.exitApp();
      } else {
      }

    });

    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();

      console.log('Network status:', status);


    };

    console.log(this.internetstatus)
    this.servies.back()
  }

  ngAfterViewInit(): void {
    if (!navigator.onLine) {
      alert("No Internet Connection")
      this.route.navigate(['/'])
      App.exitApp();
    }

  }

}

