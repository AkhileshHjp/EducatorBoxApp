import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmBoxComponent } from 'src/app/institute/confirm-box/confirm-box.component';
@Component({
  selector: 'app-home-enquiry',
  templateUrl: './home-enquiry.component.html',
  styleUrls: ['./home-enquiry.component.css']
})
export class HomeEnquiryComponent implements OnInit {
  displayedColumns: string[] = ['enq_id', 'enq_name', 'enq_email', 'enq_phone', 'enq_msg', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  enquiry_count = 0
  deletevalue: any =1;
  constructor(
    private dailog: MatDialog,
    private manageservice: ManageService,
    private router: Router,
    private popup: NgToastService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.manageservice.get_admin_enquiry().subscribe(
      (enqdata: any) => {
        this.dataSource = new MatTableDataSource(enqdata.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.enquiry_count = enqdata.data.length
      }
    )
  }

  delete_admin_enquiry(row: any) {
    const dialogRef = this.dailog.open(ConfirmBoxComponent, {
      data: this.deletevalue,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        const deldata = new FormData();
        deldata.append('enq_id', row.enq_id);
        this.manageservice.admin_delete_enquiry(deldata).subscribe(
          (res: any) => {
            console.log(res)
            this.popup.success({ detail: 'Success', summary: 'Admin enquiry deleted', })
            this.router.navigate(['/adminhome/homeenquiry']);
          }
        )
      }
      else {
       }
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
