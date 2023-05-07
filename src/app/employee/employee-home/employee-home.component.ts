import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
import { EmployeeProfileUpdateComponent } from '../employee-profile-update/employee-profile-update.component';
@Component({
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.css']
})
export class EmployeeHomeComponent implements OnInit {
  displayedColumns: string[] = ['notification'];
  custtomize_noti:string = ''
  name: any;
  opened: boolean = true
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  url: string = 'https://educatorbox.com/assets/';
  img_url: string = '';
  login_deatils: any
  login: any
  action_menu:boolean = true
  emp_id:any
  
  constructor(
    private observe: BreakpointObserver,
    private dailog: MatDialog,
    private servies:ManageService
  ) {
  
  if(window.innerWidth > 720){
    this.action_menu = true
}
else{
this.action_menu = false
}
}
  ngOnInit(): void {
     this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.emp_id = this.login.emp_id
    this.get_emp_data(this.emp_id)
    this.name = this.login.emp_name
    if(!this.login.emp_photo){
      this.img_url = "profile.png"
    }
    else{
      this.img_url = this.login.emp_photo
    }

    const fromdata = new FormData()
    fromdata.append("inst_id", this.login.institute_id_fk)
    this.servies.get_emp_by_inst_id(fromdata).subscribe(
      (res:any)=>{
        this.custtomize_noti = res.data[0].notification
      }
    )
  }

  get_emp_data(emp: any) {
    const fromdata = new FormData()
    fromdata.append('emp_id', emp)
    this.servies.get_emp_by_emp_id(fromdata).subscribe(
      (res: any) => {
        console.log(res.data.emp_photo)
        this.name = res.data.emp_name
        this.img_url = res.data.emp_photo

      }
    )
  }
  emp_profile_update(){
    this.dailog.open(EmployeeProfileUpdateComponent, {
      disableClose: true
    });
  }
}