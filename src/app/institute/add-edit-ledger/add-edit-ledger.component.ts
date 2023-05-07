import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ManageService } from 'src/app/manage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-ledger',
  templateUrl: './add-edit-ledger.component.html',
  styleUrls: ['./add-edit-ledger.component.css']
})
export class AddEditLedgerComponent implements OnInit {
  hide = true;
  FromBuilder: any;
  Ledger_Form: any;
  actionBtn: string = 'Add'
  admin = 1;
  profit_loss = 0;
  login_deatils: any
  login: any
  inst_id: any
  inst_id_for_inst_login: any

  constructor(
    private fb: FormBuilder,
    private services: ManageService,
    private router: Router,
    private popup: NgToastService,
    private matref: MatDialogRef<AddEditLedgerComponent>,
    @Inject(MAT_DIALOG_DATA) public edit_ledger: any

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id = this.login.inst_id
    this.inst_id_for_inst_login = this.login.inst_id
  }
  ngOnInit(): void {
    this.Ledger_Form = this.fb.group({
      ledger_cash_in_hand: ['', Validators.required],
      ledger_deposit_bank: ['', Validators.required],
      ledger_closing_amount: ['', Validators.required],
      ledger_description: [''],
      ledger_expence: ['', Validators.required],
      ledger_today_Recived: ['', Validators.required],
      ledger_date: ['',],
      profit_loss: ['0'],
      institute_id_fk: ['', Validators.required],
      admin_id_fk: ['']
    })

    // this.Ledger_Form.controls['ledger_date'].setValue(new Date().toISOString().slice(0, 10));
    this.Ledger_Form.controls['institute_id_fk'].setValue(this.login.inst_id);
  }
  addBtn() {
    const checkdata = new FormData()
    checkdata.append('cur_date', this.Ledger_Form.get('ledger_date')?.value)
    checkdata.append('inst_id', this.login.inst_id)
    this.services.checkdataleadger(checkdata).subscribe(
      (res: any) => {
        if (res.data.total == 1) {
          this.popup.warning({ detail: 'Warning', summary: 'Already Submited', })
          return
        }
        else {
          this.services.post_ledger(this.Ledger_Form.value).subscribe(
            (res: any) => {
              console.log(res)
              this.matref.close()
              this.popup.success({ detail: 'Success', summary: 'Ledger Saved', })
              this.router.navigate(['/institutehome/ledger'])
            },
            (error: any) => {
              console.log(error)
              this.popup.error({ detail: 'Fail', summary: 'Ledger Not Saved', })
            }
          )
        }
      }
    )
  }

  CurDate(event: any) {
    this.ledger_form_reset()
    const formdata = new FormData()
    formdata.append('cur_date', event.target.value)
    formdata.append('inst_id', this.inst_id)
    this.services.get_account_calc(formdata).subscribe(
      (res: any) => {
        if (res.data[0].closing_amount == null) {
          this.Ledger_Form.controls['ledger_cash_in_hand'].setValue(0)
        }
        else {
          this.Ledger_Form.controls['ledger_cash_in_hand'].setValue(res.data[0].closing_amount)

        }
        if (res.data[0].expense_amount == null) {
          this.Ledger_Form.controls['ledger_expence'].setValue(0)
        }
        else {
          this.Ledger_Form.controls['ledger_expence'].setValue(res.data[0].expense_amount)

        }
        if (res.data[0].fee_amount == null) {
          this.Ledger_Form.controls['ledger_today_Recived'].setValue(0)
        }
        else {
          this.Ledger_Form.controls['ledger_today_Recived'].setValue(res.data[0].fee_amount)
        }
        this.Ledger_Form.controls['profit_loss'].setValue(res.data[0].fee_amount - res.data[0].expense_amount)

      }
    )
  }
  disp_in_bank() {
    this.Ledger_Form.controls['ledger_closing_amount'].reset()
    this.Ledger_Form.controls['ledger_closing_amount'].setValue(((((Number(this.Ledger_Form.get('ledger_today_Recived')?.value) + Number(this.Ledger_Form.get('ledger_cash_in_hand')?.value)) - Number(this.Ledger_Form.get('ledger_expence')?.value)) - Number(this.Ledger_Form.get('ledger_deposit_bank')?.value))).toFixed(3))
  }
  ledger_form_reset() {
    this.Ledger_Form.controls['ledger_cash_in_hand'].reset()
    this.Ledger_Form.controls['ledger_deposit_bank'].reset()
    this.Ledger_Form.controls['ledger_closing_amount'].reset()
    this.Ledger_Form.controls['ledger_description'].reset()
    this.Ledger_Form.controls['ledger_expence'].reset()
    this.Ledger_Form.controls['ledger_today_Recived'].reset()
  }



}
