import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddEditPaymentRecivedComponent } from '../add-edit-payment-recived/add-edit-payment-recived.component';
import { ManageService } from 'src/app/manage.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-payment-received',
  templateUrl: './payment-received.component.html',
  styleUrls: ['./payment-received.component.css']
})
export class PaymentReceivedComponent implements OnInit {

  displayedColumns: string[] = ['payment_id', 'reg_no', 'std_photo', 'std_name', 'std_whatsapp_no', 'course_id_fk', 'batch_id_fk', 'roll_no', 'fee_type', 'fee_monthly', 'fee_amount', 'discount', 'net_amount', 'fee_date', 'fee_description'];
  dataSource = new MatTableDataSource();
  count_payment: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tabledata: any;
  action_btn: boolean = false
  login_deatils: any
  login: any
  inst_id: any
  std_id: any;
  imgUrl: string = 'https://educatorbox.com/assets/';
  cur_year: any = String((new Date()).getFullYear())
  frodate: any
  inst_td_height: string = 'inst_td_height'
  std_td_height: string = 'std_td_height'
  autoselect = String((new Date()).getFullYear())
  monthselect = "all"
  onform: boolean = true
  FilterData: any
  total_amount = 0
  total_discount = 0
  total_netamount = 0
  std_login:string = 'search_box_std'
  inst_login:string = 'search_box'
  constructor(
    private dailog: MatDialog,
    private router: Router,
    private service: ManageService,
    private fb: FormBuilder
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)

  }

  ngOnInit(): void {
    if (this.std_id) {
      this.displayedColumns = ['payment_id', 'reg_no', 'std_name', 'std_whatsapp_no', 'course_id_fk', 'batch_id_fk', 'roll_no', 'fee_type', 'fee_monthly', 'fee_amount', 'fee_date',];

    }
    if (this.login.inst_id > 0) {
      this.action_btn = false
      const fromdata = new FormData()
      fromdata.append("inst_id", this.login.inst_id)
      this.service.get_fee_by_inst_id(fromdata).subscribe(
        (res: any) => {
          console.log(res)
          this.FilterData = res.data
          this.dataSource.data = res.data
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.count_payment = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.net_amount).reduce((acc, value) => Number(acc) + Number(value), 0);
          this.total_netamount = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.net_amount).reduce((acc, value) => Number(acc) + Number(value), 0);
          this.total_amount = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.fee_amount).reduce((acc, value) => Number(acc) + Number(value), 0);
          this.total_discount = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.discount).reduce((acc, value) => Number(acc) + Number(value), 0);
        }
      )
    }
    else {
      const fromdata = new FormData()
      fromdata.append("std_id", this.login.std_id)
      this.service.get_fee_by_std_id(fromdata).subscribe(
        (res: any) => {
          console.log(res.data)
          this.action_btn = true
          this.dataSource.data = res.data
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.count_payment = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.net_amount).reduce((acc, value) => Number(acc) + Number(value), 0);

        }
      )
    }
  }
  add_payment() {
    this.dailog.open(AddEditPaymentRecivedComponent, {
      disableClose: true,
      panelClass: 'all_dialog'
    });
  }

  edit_enquiry(row: any) {
    this.dailog.open(AddEditPaymentRecivedComponent, {
      data: row,
      panelClass: 'all_dialog'
    });
  }

  // for searching 
  onyear(year: any) {
    console.log(this.dataSource.data.filter((f: any) => f.fee_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t));
    this.dataSource.data = this.FilterData.filter((f: any) => f.fee_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t)
    this.total_netamount = this.FilterData.filter((f: any) => f.fee_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t.net_amount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
    this.total_amount = this.FilterData.filter((f: any) => f.fee_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t.fee_amount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
    this.total_discount = this.FilterData.filter((f: any) => f.fee_date.slice(0, 4).search(new RegExp(year, 'i')) > -1).map((t: any) => t.discount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onmonth(month: any) {
    if (month == 'all') {
      this.onyear(this.cur_year)
    } else {
      const cur_month = this.cur_year + "-" + month
      this.dataSource.data = this.FilterData.filter((f: any) => f.fee_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t)
      this.count_payment = this.FilterData.filter((f: any) => f.fee_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t.net_amount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
      this.total_netamount = this.FilterData.filter((f: any) => f.fee_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t.net_amount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
      this.total_amount = this.FilterData.filter((f: any) => f.fee_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t.fee_amount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
      this.total_discount = this.FilterData.filter((f: any) => f.fee_date.slice(0, 7).search(new RegExp(cur_month, 'i')) > -1).map((t: any) => t.discount).reduce((acc: any, value: any) => Number(acc) + Number(value), 0);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

    }
  }

  fromdate(event: any) {
    this.onform = false
    this.frodate = event.target.value
  }

  todate(event: any) {
    const todate = event.target.value
    console.log(this.dataSource.data.map((t: any) => t.fee_date.slice(0, 7)));
    this.dataSource.data = this.FilterData.filter((f: any) => f.fee_date.search(new RegExp(event.target.value, 'i')) > -1).map((t: any) => t)
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.total_netamount = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.net_amount).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.total_amount = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.fee_amount).reduce((acc, value) => Number(acc) + Number(value), 0);
    this.total_discount = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.discount).reduce((acc, value) => Number(acc) + Number(value), 0);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
