import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEditInstituteComponent } from '../add-edit-institute/add-edit-institute.component';
import { ManageService } from 'src/app/manage.service';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';
import { Router } from '@angular/router';
import { ConfirmBoxComponent } from 'src/app/institute/confirm-box/confirm-box.component';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.css']
})

export class InstituteComponent implements OnInit {
  displayedColumns: string[] = ['inst_id', 'institute_name', 'institute_owner', 'institute_whatsapp', 'institute_email', 'institute_address', 'institute_logo', 'action'];
  dataSource!: MatTableDataSource<any>;
  deletevalue: any = 1
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  inst_count: any;
  imageUrl: string = 'assets/';
  
  constructor(
    private dailog: MatDialog,
    private manageservice: ManageService,
    private popup: NgToastService,
    private confirmServices: NgConfirmService,
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.manageservice.institute_view().subscribe(
      (instdata: any) => {
        console.log(instdata)
        this.dataSource = new MatTableDataSource(instdata.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.inst_count = instdata.data.length
      }
    )
  }

  add_Institute() {
    this.dailog.open(AddEditInstituteComponent, {
      disableClose: true,
      panelClass:'all_dialog'
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit_inst(row: any) {
    this.dailog.open(AddEditInstituteComponent, {
      data: row,
      panelClass:'all_dialog'
    });
  }

  deleteinst(row: any) {
    const dialogRef = this.dailog.open(ConfirmBoxComponent, {
      data: this.deletevalue,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        const deldata = new FormData();
        deldata.append('inst_id', row.inst_id);
        this.manageservice.delete_inst(deldata).subscribe(
          (res: any) => {
            console.log(res)
            this.popup.success({ detail: 'Success', summary: 'Institute Deleted', })
            this.router.navigate(['/adminhome/institute']);
          }
        )
      }
      else { }
    });
  }


  reset_all(inst_id: any) {
    const dialogRef = this.dailog.open(ConfirmBoxComponent, {
      data: this.deletevalue,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        alert(inst_id)
        const fromdata = new FormData()
        fromdata.append('inst_id', inst_id)
        this.manageservice.reset_inst_by_inst_id(fromdata).subscribe(
          (res: any) => {
            console.log(res)
          }
        )
      }
    })
  }
}
