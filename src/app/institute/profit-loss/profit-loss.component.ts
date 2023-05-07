import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/manage.service';
@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent implements OnInit {
  displayedColumns: string[] = ['enq_id', 'ledger_date', 'ledger_today_Recived', 'ledger_expence', 'profit_loss',];
  dataSource = new MatTableDataSource();
  count_enquiry: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tabledata: any;
  login_deatils: any;
  login: any
  inst_id: any
  frodate: any
  transactions: any
  onform: boolean = true
  FilterData: any
  total_expence = 0
  total_income = 0
  total_profit = 0
   cur_year: any = String((new Date()).getFullYear())
   monthselect = "all"

  constructor(
    private dailog: MatDialog,
    private router: Router,
    private service: ManageService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id = this.login.inst_id
    console.log("inst" + this.login.inst_id)
  }

  ngOnInit(): void {
    const fromdata = new FormData()
    fromdata.append('inst_id', this.login.inst_id)
    this.service.get_ledger_by_inst_id(fromdata).subscribe(
      (res: any) => {
        console.log(res)
        this.FilterData = res.data
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.total_income = this.dataSource.data.filter((f: any) => f.ledger_date.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.ledger_today_Recived).reduce((acc, value) => Number(acc) + Number(value), 0);
        this.total_expence = this.dataSource.data.filter((f: any) => f.ledger_date.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.ledger_expence).reduce((acc, value) => Number(acc) + Number(value), 0);
        this.total_profit = this.total_income - this.total_expence
      }
    )

  }

  fromdate(event: any) {
    this.frodate = false
    this.frodate = event.target.value
    this.onform = false
  }
  todate(event: any) {
    const formdatatta = new FormData()
    formdatatta.append('todate', event.target.value)
    formdatatta.append('fromdate', this.frodate)
    formdatatta.append('inst_id', this.inst_id)
    this.service.get_profit_loss_date_between(formdatatta).subscribe(
      (res: any) => {
        console.log(res)
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;


      }
    )
  }
  onyear(year: any) {
    this.cur_year = year
    this.dataSource.data = this.FilterData.filter((f: any) => f.ledger_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t)
    this.total_income = this.FilterData.filter((f: any) => f.ledger_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t.ledger_today_Recived).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
    this.total_expence = this.FilterData.filter((f: any) => f.ledger_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t.ledger_expence).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
    this.total_profit = this.total_income - this.total_expence
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onmonth(month: any) {
    if (month == 'all') {
      this.onyear(this.cur_year)
    } else {
      const cur_month = this.cur_year + "-" + month
      this.dataSource.data = this.FilterData.filter((f: any) => f.ledger_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t)
      this.total_income = this.FilterData.filter((f: any) => f.ledger_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t.ledger_today_Recived).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
      this.total_expence = this.FilterData.filter((f: any) => f.ledger_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t.ledger_expence).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
      this.total_profit = this.total_income - this.total_expence
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.total_income = this.dataSource.data.filter((f: any) => f.ledger_date.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.ledger_today_Recived).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.total_expence = this.dataSource.data.filter((f: any) => f.ledger_date.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.ledger_expence).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.total_profit = this.total_income - this.total_expence

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}