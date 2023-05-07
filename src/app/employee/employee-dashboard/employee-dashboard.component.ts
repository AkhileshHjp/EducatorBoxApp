import { Component, OnInit } from '@angular/core';
import { ManageService } from 'src/app/manage.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  enquiry_count:number=0
  login_deatils:any
  login:any
  inst_id:any
  constructor(
    private services:ManageService
  ) { }

  ngOnInit(): void {
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id = this.login.institute_id_fk
    const formdata =  new FormData()
    formdata.append("inst_id", this.login.institute_id_fk)
    this.services.get_dashboad(formdata).subscribe(
      (res: any) => {
        console.log(res)
        this.enquiry_count=res.data.enquiry_tbl
       
      }
    )
  }

  }


 