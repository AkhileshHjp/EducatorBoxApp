import { Component, OnInit } from '@angular/core';
import { ManageService } from 'src/app/manage.service';


@Component({
  selector: 'app-institute-dashboard',
  templateUrl: './institute-dashboard.component.html',
  styleUrls: ['./institute-dashboard.component.css']
})
export class InstituteDashboardComponent implements OnInit {
  course_count: number = 0
  batch_count: number = 0
  student_count: number = 0
  admission_count: number = 0
  enquiry_count: number = 0
  fee_count: number = 0
  dues_count: number = 0
  issue_certificate: number = 0
  oes_count: number = 0
  elearning_count: number = 0
  query_count: number = 0
  notification_count: number = 0
  employee_count: number = 0
  expence_count: number = 0
  ledger_count: number = 0
  profitloss_count: number = 0
  profit_loss: number = 0
  login_deatils: any
  login: any
  inst_id: any
  Month: number = Date.now();
  constructor(
    private services: ManageService
  ) { }

  ngOnInit(): void {
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id = this.login.inst_id
    const formdata = new FormData()

    formdata.append("inst_id", this.inst_id)
    this.services.get_dashboad(formdata).subscribe(
      (res: any) => {
        console.log(res)
        this.course_count = res.data.course_tbl
        this.batch_count = res.data.batch_tbl
        this.student_count = res.data.student_tbl
        this.admission_count = res.data.admission_tbl
        this.enquiry_count = res.data.enquiry_tbl
        this.query_count = res.data.query_tbl
        this.notification_count = res.data.notification_tbl
        this.employee_count = res.data.employee_tbl

        this.expence_count = res.data.expense_tbl
        if (this.expence_count == null) {
          this.expence_count = 0
        }

        this.ledger_count = res.data.ledger_tbl
        if (this.ledger_count == null) {
          this.ledger_count = 0
        }

        this.dues_count = res.data.dues_tbl
        if (this.dues_count == null) {
          this.dues_count = 0
        }

        this.fee_count = res.data.fee_tbl
        if (this.fee_count == null) {
          this.fee_count = 0
        }

        this.issue_certificate = res.data.certificate_tbl
        if (this.issue_certificate == null) {
          this.issue_certificate = 0
        }

        this.profit_loss = res.data.profit_loss
        if (this.profit_loss == null) {
          this.profit_loss = 0
        }

      }
    )  
  }
}
