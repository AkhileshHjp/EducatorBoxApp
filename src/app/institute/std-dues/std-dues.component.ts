import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
import { AddEditPaymentRecivedComponent } from '../add-edit-payment-recived/add-edit-payment-recived.component';

@Component({
  selector: 'app-std-dues',
  templateUrl: './std-dues.component.html',
  styleUrls: ['./std-dues.component.css']
})
export class StdDuesComponent implements OnInit {
  displayedColumns: string[] = ['enq_id', 'std_reg', 'image', 'std_name', 'roll_no', 'mobile', 'course', 'batch', 'current_dues', 'date', 'action'];
  dataSource = new MatTableDataSource();
  count_dues: number = 0;
  cur_year: any
  frodate: any
  imgUrl: string = 'https://educatorbox.com/assets/';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  tabledata: any;
  login_deatils: any
  login: any
  users: any
  inst_td_height: string = 'inst_td_height'
  std_td_height: string = 'std_td_height'
  constructor(
    private dailog: MatDialog,
    private servies: ManageService
  ) {

    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    console.log(this.login.inst_id)
  }

  ngOnInit(): void {
    if (this.login.inst_id) {
      this.get_dues(this.login.inst_id)
    }
    if (this.login.institute_id_fk) {
      this.get_dues_by_std_id(this.login.std_id)
      this.displayedColumns = ['enq_id', 'std_name', 'std_reg', 'roll_no', 'mobile', 'course', 'batch', 'current_dues', 'date'];
    }
    if (this.login.inst_id) {
      this.get_dues(this.login.inst_id)
    }

    if (this.login.institute_id_fk) {
      this.get_dues_by_std_id(this.login.std_id)
      this.displayedColumns = ['enq_id', 'std_name', 'std_reg', 'roll_no', 'mobile', 'course', 'batch', 'current_dues', 'date'];
    }
  }
  get_dues(inst_id: any) {
    const fromdata = new FormData()
    fromdata.append('inst_id', inst_id)
    this.servies.get_dues_by_inst_id(fromdata).subscribe(
      (res: any) => {
        console.log(res.data)
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.count_dues = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.dues_amount).reduce((acc, value) => Number(acc) + Number(value), 0);

      }
    )
  }
  get_dues_by_std_id(std: any) {
    const fromdata = new FormData()
    fromdata.append('std_id', std)
    this.servies.get_dues_by_std_id(fromdata).subscribe(
      (res: any) => {
        console.log(res.data)
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.count_dues = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.dues_amount).reduce((acc, value) => Number(acc) + Number(value), 0);
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.count_dues = this.dataSource.data.filter((f: any) => f.std_name.search(new RegExp(this.dataSource.filter, 'i')) > -1).map((t: any) => t.dues_amount).reduce((acc, value) => Number(acc) + Number(value), 0);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onpaymet(row: any) {
    this.dailog.open(AddEditPaymentRecivedComponent, {
      data: row,
      disableClose: true,
      panelClass: 'all_dialog'
    }
    )
  }
}