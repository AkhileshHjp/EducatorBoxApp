import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { InstituteUpdateProfileComponent } from '../institute-update-profile/institute-update-profile.component';
import { InstChangePasswordComponent } from '../inst-change-password/inst-change-password.component';
import { ManageService } from 'src/app/manage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-institute-home',
  templateUrl: './institute-home.component.html',
  styleUrls: ['./institute-home.component.css']
})
export class InstituteHomeComponent implements OnInit {
  center_code:any;
  name: any;
  center:any;
  opened: boolean = true
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  url: string = 'https://educatorbox.com/assets/';
  img_url: string = '';
  login_deatils: any
  login: any
  action_menu: boolean = true

  constructor(
    private dailog: MatDialog,
    private servies:ManageService,
    private router:Router
  ) {
    if (window.innerWidth > 768) {
      this.action_menu = true
    }
    else {
      this.action_menu = false
    }
  }

  ngOnInit(): void {
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.name = this.login.inst_name    
    this.center = this.login.center_code   
    this.get_inst_data(this.login.inst_id)
  }
  get_inst_data(inst: any) {
    const fromdata = new FormData()
    fromdata.append('inst_id', inst)
    this.servies.get_inst_by_inst_id(fromdata).subscribe(
      (res: any) => {
        this.name = res.data.inst_name
        this.center = res.data.center_code
        if(!res.data.inst_logo){
          this.img_url = "profile.jpg"          
        }
        else{
          this.img_url = res.data.inst_logo   
        }
      }
    )
  }


  profile_update() {
    this.dailog.open(InstituteUpdateProfileComponent, {
      disableClose: true
    });
  }
  inst_change_pwd() {
    this.dailog.open(InstChangePasswordComponent, {
      disableClose: true
    });
  }
  logout(){
    this.router.navigate(['institutelogin'])
    localStorage.clear()
  }
}