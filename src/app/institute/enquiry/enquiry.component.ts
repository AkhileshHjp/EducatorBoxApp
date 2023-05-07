import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddEditEnquiryComponent } from '../add-edit-enquiry/add-edit-enquiry.component';
import { ManageService } from 'src/app/manage.service';
import { ConverttoadmissionComponent } from '../converttoadmission/converttoadmission.component';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})

export class EnquiryComponent implements OnInit {
  displayedColumns: string[] = ['enq_id', 'std_name', 'std_father_name', 'std_whatsapp_no', 'course_id_fk', 'std_gender', 'std_address', 'std_regist_date','remarks', 'action'];
  dataSource = new MatTableDataSource();
  count_enquiry: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tabledata: any;
  login_deatils: any
  login: any
  inst_id_for_inst_login: any
  inst_id_for_admin: any;
  inst_id_for_std: any;
  action_btn:any
  inst_id:any
  deletevalue:any = 1
  constructor(
    private dailog: MatDialog, 
    private router: Router,
    private service: ManageService,
    private popup: NgToastService,

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    const institute_data = this.router.getCurrentNavigation();
    this.inst_id_for_admin = institute_data?.extras
    console.log("admin" + this.inst_id_for_admin)
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)

    this.inst_id_for_std = this.login.institute_id_fk

    this.inst_id_for_inst_login = this.login.inst_id
  }

  ngOnInit(): void {
    if (this.inst_id_for_admin) {
      this.get_enquiry_by_inst_id(this.inst_id_for_admin);
    }
    if (this.inst_id_for_inst_login) {
      this.action_btn = false
      this.get_enquiry_by_inst_id(this.inst_id_for_inst_login)
    }
    if (this.inst_id_for_std) {
      this.get_enquiry_by_inst_id(this.inst_id_for_std)
      this.action_btn = true
      this.displayedColumns = ['enq_id', 'std_name', 'std_father_name', 'std_whatsapp_no', 'course_id_fk', 'std_gender', 'std_address', 'std_regist_date', 'action'];
      const instformdata = new FormData()
      instformdata.append('inst_id', this.inst_id)
      this.service.get_enquiry_by_inst_id(instformdata).subscribe(
        (result: any) => {
          console.log(result)
          this.dataSource.data = result.data
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.count_enquiry = result.data.length
          this.router.navigate(['/institutehome/batch']);
          return
        }
      )
    }
  }

  get_enquiry_by_inst_id(inst_for_all: any) {
    const instformdata = new FormData()
    instformdata.append('inst_id', inst_for_all)
    this.service.get_enquiry_by_inst_id(instformdata).subscribe(
      (result: any) => {
        console.log(result)
        this.dataSource.data = result.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.count_enquiry = result.data.length
      }
    )
  }

  // ngOnInit(): void {
  //   const fromdata = new FormData()
  //   fromdata.append('inst_id', this.login.inst_id)
  //   this.service.get_enquiry_by_inst_id(fromdata).subscribe(
  //     (res: any) => {
  //       console.log(res)
  //       this.dataSource.data = res.data
  //       this.dataSource.sort = this.sort;
  //       this.dataSource.paginator = this.paginator;
  //       this.count_enquiry = res.data.length
  //     }
  //   )
  // }

  add_enquiry() {
    this.dailog.open(AddEditEnquiryComponent, {
      disableClose: true,
      panelClass:'all_dialog'
    });
  }

  edit_enquiry(row: any) {
    this.dailog.open(AddEditEnquiryComponent, {
      data: row,
      disableClose: true,
      panelClass:'all_dialog'
    });
  }

  admission_form(row: any) {
    this.dailog.open(ConverttoadmissionComponent, {
      data: row,
      disableClose: true,
      panelClass:'all_dialog'
    })
  }


  ondelete(row: any) {
    const dialogRef = this.dailog.open(ConfirmBoxComponent, {
      data: this.deletevalue,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        const deldata = new FormData();
        deldata.append('enq_id', row.enq_id);
        this.service.enquiry_delete(deldata).subscribe(
          (res: any) => {
            this.popup.success({ detail: 'Success', summary: 'Enquiry Deleted', })
            this.router.navigate(['/institutehome/enquiry']);
          }
        )
      }
      else { }
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}