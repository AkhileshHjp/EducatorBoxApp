import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { ManageService } from 'src/app/manage.service';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AddEditTakeAddmissionComponent } from 'src/app/student/add-edit-take-addmission/add-edit-take-addmission.component';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.css']
})

export class AdmissionComponent implements OnInit {
  displayedColumns: string[] = ['admission_id', 'regist_no', 'std_photo', 'std_name', 'roll_no', 'course_id_fk', 'batch_name', 'std_whatsapp_no',  'admission_date', 'admissition_status','action'];
  dataSource = new MatTableDataSource();
  imgUrl: string = 'https://educatorbox.com/assets/';

  count_admission: number = 0;
  color: ThemePalette = 'primary'
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tabledata: any;
  paginatorRef: any;
  login_deatils: any
  login: any
  inst_id: any
  inst_id_for_inst_login: any
  add_status: string = ""
  deletevalue = 1
  roll_no: any
  count_active: any = 0
  count_pending: any = 0
  FilterData :any
  constructor(
    private dailog: MatDialog,
    private service: ManageService,
    private router: Router,
    private popup: NgToastService,

  ) {
    const institute_data = this.router.getCurrentNavigation();
    this.inst_id = institute_data?.extras
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    // this.inst_id = this.login.institute_id_fk
    this.inst_id_for_inst_login = this.login.inst_id
    // console.log(this.inst_id_for_inst_login)
  }

  ngOnInit(): void {
    if (this.inst_id > 0) {
      this.get_admission_data(this.inst_id)
    }
    else {
      this.get_admission_data(this.inst_id_for_inst_login)
    }

  }

  toggle(event: MatSlideToggleChange, row: any) {
    if (!row.roll_no) {
      const rollfromdata = new FormData()
      rollfromdata.append('inst_id', row.inst_id)
      rollfromdata.append('batch_id', row.batch_id_fk)
      this.service.count_roll_no_by_batch(rollfromdata).subscribe(
        (result: any) => {
          this.roll_no = Number(result.data[0].total_roll) + Number(1)
          const update_roll = new FormData()
          update_roll.append('roll_no', this.roll_no)
          update_roll.append('admission_id', row.admission_id)
          this.service.roll_no_update(update_roll).subscribe(
            (res: any) => {
              this.get_admission_data(this.inst_id_for_inst_login)
              if (res.success) {
                if (event.checked == true) {
                  const editdata = new FormData()
                  editdata.append('admissition_status', '1')
                  editdata.append('admission_id', row.admission_id)
                  this.service.admission_update(editdata).subscribe(
                    (res: any) => {
                      console.log(res)
                      this.get_admission_data(this.inst_id_for_inst_login)
                    }
                  )
                }
              }
            }
          )


        }
      )
    }

    if (event.checked == true) {
      const editdata = new FormData()
      editdata.append('admissition_status', '1')
      editdata.append('admission_id', row.admission_id)
      this.service.admission_update(editdata).subscribe(
        (res: any) => {
          console.log(res)
          this.get_admission_data(this.inst_id_for_inst_login)
        }
      )
    }

    if (event.checked == false) {
      const editdata = new FormData()
      editdata.append('admissition_status', '0')
      editdata.append('admission_id', row.admission_id)

      this.service.admission_update(editdata).subscribe(
        (res: any) => {
          this.get_admission_data(this.inst_id_for_inst_login)
        }
      )
    }


  }
  roll_update(roll_no: any, admission_id: any) {
    const update_roll = new FormData()
    update_roll.append('roll_no', roll_no)
    update_roll.append('admission_id', admission_id)
    this.service.roll_no_update(update_roll).subscribe(
      (res: any) => {
        // console.log(res)
        this.get_admission_data(this.inst_id_for_inst_login)

      }
    )
  }

  get_admission_data(inst_id: any) {
    const fromdata = new FormData()
    fromdata.append("inst_id", inst_id)
    this.service.get_admission_by_inst_id(fromdata).subscribe(
      (res: any) => {
        this.FilterData  = res.data
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.count_admission = res.data.length
        this.count_active =  this.dataSource.data.filter((f: any) => f.admissition_status.search(new RegExp('1', 'i')) > -1).map((t: any) => t).length;
        this.count_pending =  this.dataSource.data.filter((f: any) => f.admissition_status.search(new RegExp('0', 'i')) > -1).map((t: any) => t).length;
      }
    )
  }

  onadmissiondelet(row: any) {
    const dialogRef = this.dailog.open(ConfirmBoxComponent, {
      data: this.deletevalue,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        const deletdata = new FormData()
        deletdata.append('admission_id', row)
        this.service.admission_delete(deletdata).subscribe(
          (res: any) => {
            this.popup.success({ detail: 'Success', summary: 'Admission Deleted', })
            this.get_admission_data(this.inst_id_for_inst_login)

          }
        )
      }
      else { }
    });
  }
  add_addmission() {
    this.dailog.open(AddEditTakeAddmissionComponent)
  }

  onActive() {
    this.dataSource.data = this.FilterData.filter((f: any) => f.admissition_status.search(new RegExp('1', 'i')) > -1).map((t: any) => t);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onPending() {
    this.dataSource.data = this.FilterData.filter((f: any) => f.admissition_status.search(new RegExp('0', 'i')) > -1).map((t: any) => t);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onTotal() {
    this.dataSource.data = this.FilterData.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t);

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.count_admission=this.dataSource.filteredData.length;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
}


