import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.css']
})
export class StudentSidebarComponent implements OnInit {
  setting: any
  action_icon1: boolean = false
  action_icon2: boolean = true
  status: any
  inst_id: any
  login_deatils: any
  login: any
  inst_name: any
  constructor(
    private dailog: MatDialog,
    private service: ManageService

  ) { }

  ngOnInit(): void {
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id = this.login.institute_id_fk
    const fromdata = new FormData()
    fromdata.append('inst_id', this.login.institute_id_fk)
    this.service.get_inst_by_inst_id(fromdata).subscribe(
      (result: any) => {
        this.inst_name = result.data.inst_name;
      }
    )
  }

  report_dropdown() {
    this.setting = document.getElementById("dropdown_report")
    if (this.setting.style.display != "block") {
      this.setting.style.display = "block";
      this.action_icon1 = true
      this.action_icon2 = false

    } else {
      this.setting.style.display = "none";
      this.action_icon1 = false
      this.action_icon2 = true
    }
  }
}