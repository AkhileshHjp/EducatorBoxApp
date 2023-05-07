import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/manage.service';
import { NgToastService } from 'ng-angular-popup';
import { AddEditExpenceComponent } from '../add-edit-expence/add-edit-expence.component';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Component({
  selector: 'app-expence',
  templateUrl: './expence.component.html',
  styleUrls: ['./expence.component.css']
})
export class ExpenceComponent implements OnInit {

  displayedColumns: string[] = ['slno', 'expense_type', 'expense_amount', 'expense_pay_to', 'expense_mobile', 'expense_date', 'expense_desc', 'action'];
  dataSource = new MatTableDataSource();
  expence_count: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  login_deatils: any
  login: any
  inst_id: any
  inst_id_for_inst_login: any;
  deletevalue: any = 1
  frodate: any
  onfrom: boolean = true
  FilterData: any
  cur_year: any = String((new Date()).getFullYear())
  monthselect = "all"
  constructor(
    private dailog: MatDialog,
    private service: ManageService,
    private router: Router,
    private popup: NgToastService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id = this.login.institute_id_fk
    this.inst_id_for_inst_login = this.login.inst_id
  }

  ngOnInit(): void {
    const fromdata = new FormData()
    fromdata.append('inst_id', this.inst_id_for_inst_login)
    this.service.get_expence_by_inst_id(fromdata).subscribe(
      (res: any) => {
        console.log(res)
        this.FilterData = res.data
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.expence_count = this.FilterData.filter((f: any) => f.expense_type.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.expense_amount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
      }
    )
  }

  add_expense() {
    this.dailog.open(AddEditExpenceComponent, {
      disableClose: true
    });
  }
  edit_expense(row: any) {
    this.dailog.open(AddEditExpenceComponent, {
      data: row,
      disableClose: true,
    });
  }

  expence_delete(row: any) {
    const dialogRef = this.dailog.open(ConfirmBoxComponent, {
      data: this.deletevalue,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        const deldata = new FormData();
        deldata.append('expense_id', row.expense_id);
        this.service.expence_delete(deldata).subscribe(
          (res: any) => {
            console.log(res)
            this.popup.success({ detail: 'Success', summary: 'Expence Deleted', })
            this.router.navigate(['/institutehome/expence'])
          }
        )
      }
      else { }
    });
  }

  // for searching 
  onyear(year: any) {
    this.cur_year = year
    console.log(this.dataSource.data.filter((f: any) => f.expense_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t));
    this.dataSource.data = this.FilterData.filter((f: any) => f.expense_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t)
    this.expence_count = this.FilterData.filter((f: any) => f.expense_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t.expense_amount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onmonth(month: any) {
    if (month == 'all') {
      this.onyear(this.cur_year)
    } else {
      const cur_month = this.cur_year + "-" + month
      this.dataSource.data = this.FilterData.filter((f: any) => f.expense_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t)
      this.expence_count = this.FilterData.filter((f: any) => f.expense_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t.expense_amount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

    }
  }

  fromdate(event: any) {
    this.frodate = event.target.value
    this.onfrom = false
  }
  todate(event: any) {
    const formdatatta = new FormData()
    formdatatta.append('todate', event.target.value)
    formdatatta.append('fromdate', this.frodate)
    formdatatta.append('inst_id', this.login.inst_id)
    this.service.get_expence_by_date_between(formdatatta).subscribe(
      (res: any) => {
        console.log(res)
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.expence_count = this.FilterData.filter((f: any) => f.expense_type.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.expense_amount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

