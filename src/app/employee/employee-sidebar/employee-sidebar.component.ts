import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';

@Component({
  selector: 'app-employee-sidebar',
  templateUrl: './employee-sidebar.component.html',
  styleUrls: ['./employee-sidebar.component.css']
})
export class EmployeeSidebarComponent implements OnInit {
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
        // let str = result.data.inst_name;
        // let res = str.charAt(str.indexOf(" ") + 1);
        // this.inst_name = result.data.inst_name.charAt(0) + (res)
        this.inst_name = result.data.inst_name;

      },
      (error: any) => {
        console.log(error)
      }
    )
  }

}