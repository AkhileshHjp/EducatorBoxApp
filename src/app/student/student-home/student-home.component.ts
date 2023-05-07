import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { StudentProfileComponent } from '../student-profile/student-profile.component';
import { ManageService } from 'src/app/manage.service';
import { StdChnangePwdComponent } from '../std-chnange-pwd/std-chnange-pwd.component';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  displayedColumns: string[] = ['notification'];
  custtomize_noti:any
  name: any;
  opened: boolean = true
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  url: string = 'https://educatorbox.com/assets/h';
  img_url: string = '';
  login_deatils: any
  login: any
  std_id: any
  action_menu: boolean = true

  constructor(
    private observe: BreakpointObserver,
    private dailog: MatDialog,
    private servies:ManageService
  ) {
    if (window.innerWidth > 720) {
      this.action_menu = true
    }
    else {
      this.action_menu = false
    }
  }

  ngOnInit(): void {
    this.observe.observe(['(max-width:768px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      }
      else {
        this.sidenav.mode = 'side';
        this.sidenav.close();
      }
    })
    
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.std_id = this.login.std_id
    this.get_std_data(this.std_id)
    console.log(this.login.std_name)
    this.name = this.login.std_name
    
    const fromdata = new FormData()
    fromdata.append("inst_id", this.login.institute_id_fk)
    this.servies.get_notification_by_inst_id(fromdata).subscribe(
      (res:any)=>{
        this.custtomize_noti = res.data
        console.log(res.data)
      }
    )
  }

  get_std_data(std: any) {
    const fromdata = new FormData()
    fromdata.append('std_id', std)
    this.servies.get_student_by_std_id(fromdata).subscribe(
      (res: any) => {
        this.name = res.data.std_name
        if(res.data.std_img == null){
          this.img_url = 'profile.jpg'
        }
        else{
          this.img_url = res.data.std_img
        }
      }
    )
  }

  changepassword() {
    this.dailog.open(StdChnangePwdComponent, {
      disableClose: true
    });
  }
  show_profile() {
    this.dailog.open(StudentProfileComponent, {
      disableClose: true,
      panelClass:'all_dialog'
    });
  }
}