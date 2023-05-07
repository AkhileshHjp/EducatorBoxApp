import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddEditLedgerComponent } from '../add-edit-ledger/add-edit-ledger.component';
import { ManageService } from 'src/app/manage.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {
  displayedColumns: string[] = ['ledger_id', 'ledger_cash_in_hand', 'ledger_today_Recived', 'ledger_expence', 'ledger_deposit_bank', 'ledger_closing_amount', 'ledger_date', 'ledger_description', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  count_ledger: string = '0'
  login_deatils: any
  login: any
  inst_id: any
  inst_id_for_inst_login: any
  deletevalue: any = 1
  curent_date  = new Date().toISOString().slice(0, 10)
  
  constructor(
    private matdialog: MatDialog,
    private service: ManageService,
    private popup: NgToastService,
    private router: Router
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
    this.service.get_ledger_by_inst_id(fromdata).subscribe(
      (res: any) => {
        console.log(res)
        this.dataSource.data = res.data
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.count_ledger = res.data.length
      }
    )
  }

  delete_ledger(row: any) {
    const dialogRef = this.matdialog.open(ConfirmBoxComponent, {
      data: this.deletevalue,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.deletevalue == result) {
        const deldata = new FormData();
        deldata.append('ledger_id', row.ledger_id);
        this.service.delete_ledger(deldata).subscribe(
          (res: any) => {
            console.log(res)
            this.popup.success({ detail: 'Success', summary: 'Ledger Deleted', })
            this.router.navigate(['/institutehome/ledger'])
          }
        )
      }
      else { }
    });
  }

  add_ledger() {
    this.matdialog.open(AddEditLedgerComponent)
  }
  edit_ledger(row: any) {
    this.matdialog.open(AddEditLedgerComponent, {
      data: row,
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