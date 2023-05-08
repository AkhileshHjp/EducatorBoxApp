import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditEmployeeComponent } from '../add-edit-employee/add-edit-employee.component';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/manage.service';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = ['slno', 'emp_name', 'emp_whatsapp', 'emp_aadhar_no','emp_ifsc', 'emp_photo', 'emp_address', 'Action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  login_deatils: any
  login: any
  count_emp: Number = 0
  deletevalue: any = 1
  imgUrl: string = 'https://educatorbox.com/assets/';
  emp_data:any


  constructor(
    private dailog: MatDialog,
    private popup: NgToastService,
    private router: Router,
    private services: ManageService,
  ) {
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
  }

  ngOnInit(): void {
    const formdata = new FormData()
    formdata.append('inst_id', this.login.inst_id)
    this.services.get_emp_by_inst_id(formdata).subscribe(
      (itemresult: any) => {
        console.log(itemresult)
        this.count_emp = itemresult.data.length
        this.dataSource = new MatTableDataSource(itemresult.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    )
  }
  add_Employee() {
    this.dailog.open(AddEditEmployeeComponent, {
      disableClose: true,
      data: this.emp_data,
      panelClass:'all_dialog'
    });
  }

  editEmp(row: any) {
    this.dailog.open(AddEditEmployeeComponent, {
      data: row,
      disableClose: true
    });
  }

  del_emp(row: any) {
    const dialogRef = this.dailog.open(ConfirmBoxComponent, {
      data: this.deletevalue,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        const deldata = new FormData();
        deldata.append('emp_id', row.emp_id);
        this.services.delete_employee(deldata).subscribe(
          (res: any) => {
            console.log(res)
            this.popup.success({ detail: 'Success', summary: 'Employee Deleted', })
            this.router.navigate(['/institutehome/employee']);
          }
        )
      }
      else { }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.count_emp=this.dataSource.filteredData.length;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  PrintThisPage() {
    AddEditEmployeeComponent
  }
}






