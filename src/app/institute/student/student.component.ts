import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
import { AddEditStudentComponent } from '../add-edit-student/add-edit-student.component';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { AddEditTakeAddmissionComponent } from 'src/app/student/add-edit-take-addmission/add-edit-take-addmission.component';
import { formatDate } from '@angular/common';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  displayedColumns: string[] = ['std_id', 'std_regist_no','std_photo', 'std_name', 'std_whatsapp_no', 'std_email', 'std_aadhar', 'std_regist_date','status',  'action'];
  dataSource = new MatTableDataSource();
  count_student: number = 0;
  inst_id: any
  rowdata = 0
  login_deatils: any
  login: any
  inst_id_for_inst_login: any
  std_reg_no:any
  std_id:any
  deletevalue:any = 1
  count_active:any = 0
  count_pending :any = 0
  pending_admission :any = 0
  red:string = 'forred'
  green:string = 'forgreen'
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  imgUrl: string = 'https://educatorbox.com/assets/';
  color: ThemePalette = 'primary'
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
  }

  ngOnInit(): void {

    if (this.inst_id > 0) {
      this.get_std(this.inst_id)
    }
    else {
      this.get_std(this.inst_id_for_inst_login)
    }
  

  }

  add_student(): any {
    this.dailog.open(AddEditStudentComponent, {
      data: this.rowdata,
      disableClose: true,
      panelClass:'all_dialog'
    });
  }
  convertoadmission(row: any) {
    this.dailog.open(AddEditTakeAddmissionComponent, {
      data: row,
      disableClose: true,
      panelClass:'all_dialog'
    });
  }

  edit_student(row: any) {
    this.dailog.open(AddEditStudentComponent, {
      data: row,
      disableClose: true,
      panelClass:'all_dialog'
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.count_student=this.dataSource.filteredData.length;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggle(event: MatSlideToggleChange, row: any) {
    this.std_id = row.std_id
  if(!row.std_regist_no){
      const  std_count = new FormData()
      std_count.append('inst_id',this.inst_id_for_inst_login)
      this.service.count_std_as_reg_no(std_count).subscribe(
        (res:any)=>{
          console.log(res.data[0].std_count);
        const std = Number(res.data[0].std_count) + Number(1)
          const regfrmodata =  new FormData()
          regfrmodata.append('std_regist_no',this.inst_id_for_inst_login+formatDate(new Date(), 'yyyyMMdd', 'en') + std)
          regfrmodata.append('std_id',this.std_id)
          this.service.student_reg_no_confirm(regfrmodata).subscribe(
            (res:any)=>{
              console.log(res)
              this.get_std(this.inst_id_for_inst_login)
            }
          )
        }
      )
    }
  


    if (event.checked == true) {
      const editstd = new FormData()
      editstd.append('status', '1')
      editstd.append('std_id', row.std_id)

      this.service.student_conform(editstd).subscribe(
        (res: any) => {
          console.log(res)
          this.get_std(this.inst_id_for_inst_login)
        }
      )

        
    }

    if (event.checked == false) {
      const editstd = new FormData()
      editstd.append('status', '0')
      editstd.append('std_id', row.std_id)

      this.service.student_conform(editstd).subscribe(
        (res: any) => {
          console.log(res)
          this.get_std(this.inst_id_for_inst_login)
        }
      )
    }
  }
  get_std(inst: any) {
    const instformdata = new FormData()
    instformdata.append('inst_id', inst)
    this.service.get_student_by_inst_id(instformdata).subscribe(
      (result: any) => {
        console.log(result)
        this.FilterData  = result.data
        this.dataSource.data = result.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.count_student = result.data.length
        this.count_active =  this.dataSource.data.filter((f: any) => f.status.search(new RegExp('1', 'i')) > -1).map((t: any) => t).length;
        this.count_pending =  this.dataSource.data.filter((f: any) => f.status.search(new RegExp('0', 'i')) > -1).map((t: any) => t).length;
        this.pending_admission =  this.dataSource.data.filter((f: any) => f.total_admission.search(new RegExp('0', 'i')) > -1).map((t: any) => t).length;
      }
    )
  }

  ondeletedstd(row:any){
  const dialogRef = this.dailog.open(ConfirmBoxComponent, {
    data: this.deletevalue,
  });
  dialogRef.afterClosed().subscribe(result => {
    if (this.deletevalue == result) {
    const deledata = new FormData()
    deledata.append('std_id', row)
    this.service.student_delet(deledata).subscribe(
      (res:any)=>{
        this.popup.success({ detail: 'Success', summary: 'Student Deleted', })
        this.get_std(this.inst_id_for_inst_login)
      }
    )
    }
    else { }
  });
}

onTotal(){
  this.dataSource.data = this.FilterData.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t);
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
onActive(){
  this.dataSource.data = this.FilterData.filter((f: any) => f.status.search(new RegExp('1', 'i')) > -1).map((t: any) => t);
  
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
onPending(){
  this.dataSource.data = this.FilterData.filter((f: any) => f.status.search(new RegExp('0', 'i')) > -1).map((t: any) => t);
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }}  

  onPendingAcmission(){
  this.dataSource.data = this.FilterData.filter((f: any) => f.total_admission.search(new RegExp('0', 'i')) > -1).map((t: any) => t);
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }}  
}