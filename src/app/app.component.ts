import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar} from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cms';
  login_deatils:any
  login:any
  constructor(
    private route : Router
  ) {
    // StatusBar.setOverlaysWebView({overlay:true});
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    if(!this.login){
      // this.route.navigate(['/']);
      localStorage.clear()
    }
  }
}
