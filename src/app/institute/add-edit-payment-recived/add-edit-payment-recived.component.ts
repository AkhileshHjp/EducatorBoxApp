import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-edit-payment-recived',
  templateUrl: './add-edit-payment-recived.component.html',
  styleUrls: ['./add-edit-payment-recived.component.css']
})
export class AddEditPaymentRecivedComponent implements OnInit {
  disableSelect = new FormControl(false);
  fee_form!: FormGroup;
  admin = 1;
  upload: any;
  actionBtn: string = 'Add'
  fee_heading: string = 'Fee'
  student_data: any;
  course_data: any;
  batch_data: any;
  student_single_data: any;
  course_single_data: any;
  monthly_act: boolean = true;
  current_act: boolean = true;
  setvalue: any;
  imgUrl: string = 'assets/profile.png';
  login_deatils: any;
  login: any;
  inst_id: any;
  inst_id_for_inst_login: any;
  autoselect = 'Offline'
  action: boolean = false
  dues_amount: any = 0

  constructor(
    private popup: NgToastService,
    private fb: FormBuilder,
    private service: ManageService,
    private router: Router,
    private matref: MatDialogRef<AddEditPaymentRecivedComponent>,
    @Inject(MAT_DIALOG_DATA) public fee_data: any,

  ) {
    console.log(fee_data)
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id = this.login.inst_id
    this.inst_id_for_inst_login = this.login.inst_id
  }

  ngOnInit(): void {
    this.fee_form = this.fb.group({
      std_reg: ['',],
      fee_id: ['',],
      student_id_fk: ['', Validators.required],
      std_father_name: [''],
      std_whatsapp_no: [''],
      std_address: [''],
      std_img: [''],
      course_id_fk: ['', Validators.required],
      course_total_fee: [''],
      course_half_fee: [''],
      course_quarter_fee: [''],
      course_monthly_fee: [''],
      course_admission_fee: [''],
      fee_type: ['', Validators.required],
      fee_monthly: [''],
      fee_mode: ['', Validators.required],
      fee_amount: ['', Validators.required],
      fee_description: [''],
      fee_date: ['', Validators.required],
      batch_id_fk: ['', Validators.required],
      institute_id_fk: [''],
      admin_id_fk: ['', Validators.required],
      roll_no: [''],
      net_amt: [''],
      dist_amt: [''],
      dues_amt: [''],
    })
    this.fee_form.controls['fee_date'].setValue(new Date().toISOString().slice(0, 10));
    if (this.fee_data) {
      this.fee_form.controls['std_reg'].setValue(this.fee_data.std_regist_no);
      this.fee_form.controls['student_id_fk'].setValue(this.fee_data.std_name);
      this.fee_form.controls['std_father_name'].setValue(this.fee_data.std_father_name);
      this.fee_form.controls['std_whatsapp_no'].setValue(this.fee_data.std_whatsapp_no);
      this.fee_form.controls['std_address'].setValue(this.fee_data.std_address);
      this.fee_form.controls['course_id_fk'].setValue(this.fee_data.course_name);
      this.fee_form.controls['course_total_fee'].setValue(this.fee_data.course_total_fee);
      this.fee_form.controls['course_half_fee'].setValue(this.fee_data.course_half_fee);
      this.fee_form.controls['course_quarter_fee'].setValue(this.fee_data.course_quarter_fee);
      this.fee_form.controls['course_monthly_fee'].setValue(this.fee_data.course_monthly_fee);
      this.fee_form.controls['course_admission_fee'].setValue(this.fee_data.course_admission_fee);
      this.fee_form.controls['fee_amount'].setValue(this.fee_data.fee_amount);
      this.fee_form.controls['net_amt'].setValue(this.fee_data.net_amt);
      this.fee_form.controls['std_img'].setValue(this.fee_data.std_img);
      this.imgUrl = 'https://educatorbox.com/assets/' + this.fee_data.std_img;
      this.fee_form.controls['batch_id_fk'].setValue(this.fee_data.batch_name);
      this.fee_form.controls['roll_no'].setValue(this.fee_data.roll_no);
      this.fee_form.controls['dues_amt'].setValue(this.fee_data.dues_amount);
    }
  }


  fee_btn() {
    if (this.fee_form.get('fee_type')?.value == "Monthly Fee") {
      if (this.fee_form.get('fee_monthly')?.value == "") {
        this.popup.warning({ detail: 'Warning', summary: 'Please Select Month', })
        return
      }
    }



    if (Number(this.fee_form.get('fee_amount')?.value) > Number(this.fee_form.get('dues_amt')?.value)) {
      this.popup.warning({ detail: 'Warning', summary: 'Enter Correct Amount', })
      return
    }
    else {
      const formadd = new FormData();
      formadd.append('student_id_fk', this.fee_data.std_id_fk)
      formadd.append('course_id_fk', this.fee_data.course_id_fk)
      formadd.append('fee_type', this.fee_form.get('fee_type')?.value)
      formadd.append('fee_monthly', this.fee_form.get('fee_monthly')?.value)
      formadd.append('fee_mode', this.fee_form.get('fee_mode')?.value)
      formadd.append('fee_amount', this.fee_form.get('fee_amount')?.value)
      formadd.append('fee_description', this.fee_form.get('fee_description')?.value)
      formadd.append('fee_date', this.fee_form.get('fee_date')?.value)
      formadd.append('batch_id_fk', this.fee_data.batch_id_fk)
      formadd.append('institute_id_fk', this.fee_data.inst_id)
      formadd.append('admin_id_fk', this.fee_form.get('admin_id_fk')?.value)
      formadd.append('roll_no', this.fee_form.get('roll_no')?.value)
      formadd.append('net_amt', this.fee_form.get('net_amt')?.value)
      formadd.append('discount', this.fee_form.get('dist_amt')?.value)
      if (this.fee_form.valid) {
        this.service.post_fee(formadd).subscribe(
          (res: any) => {
            this.matref.close();
            this.popup.success({ detail: 'Success', summary: 'Payment Saved', })
            this.router.navigate(['/institutehome/fee'])
          },
          (error: any) => {
            this.popup.error({ detail: 'Unsuccess', summary: 'Payment Not Saved', })
          }
        )
      }
    }
  }
  select_fee_type(event: any) {
    if (event == "Monthly Fee") {
      this.monthly_act = false
    }
    else {
      this.monthly_act = true
    }
    if (event == "Other Fee") {
      this.current_act = false
    }
    else {
      this.current_act = true
    }
    if (event == "Admission Fee") {
      this.fee_form.controls['fee_amount'].setValue(this.fee_form.get('course_admission_fee')?.value);
      this.fee_form.controls['net_amt'].setValue(this.fee_form.get('course_admission_fee')?.value);
      this.fee_type("Admission Fee")
    }
    if (event == "Total Fee") {
      this.fee_form.controls['fee_amount'].setValue(this.fee_form.get('course_total_fee')?.value);
      this.fee_form.controls['net_amt'].setValue(this.fee_form.get('course_total_fee')?.value);
      this.fee_type("Total Fee")
    }
    if (event == "Half Fee") {
      this.fee_form.controls['fee_amount'].setValue(this.fee_form.get('course_half_fee')?.value);
      this.fee_form.controls['net_amt'].setValue(this.fee_form.get('course_half_fee')?.value);
    }
    if (event == "Quarter Fee") {
      this.fee_form.controls['fee_amount'].setValue(this.fee_form.get('course_quarter_fee')?.value);
      this.fee_form.controls['net_amt'].setValue(this.fee_form.get('course_quarter_fee')?.value);
    }

    if (event == "Monthly Fee") {
      this.fee_form.controls['fee_amount'].setValue(this.fee_form.get('course_monthly_fee')?.value);
      this.fee_form.controls['net_amt'].setValue(this.fee_form.get('course_monthly_fee')?.value);

    }

    this.fee_form.controls['dist_amt'].setValue(0)
  }

  fee_type(fee_type: any) {
    console.log(this.fee_data)
    const feetype = new FormData()
    feetype.append('fee_type', fee_type)
    feetype.append('batch_id', this.fee_data.batch_id_fk)
    feetype.append('std_id', this.fee_data.std_id_fk)
    feetype.append('inst_id', this.fee_data.inst_id)
    this.service.check_fee_type_pay(feetype).subscribe(
      (res: any) => {
        console.log(res)
        if (res.success == 1) {
          this.popup.warning({ detail: 'Warning', summary: 'Fee Type Already Exists', })
          this.fee_form.controls['fee_amount'].reset()
          this.fee_form.controls['net_amt'].reset()
          this.fee_form.controls['fee_type'].reset()
        }
      }
    )
  }

  select_month(event: any) {
    const feecheckdata = new FormData()
    feecheckdata.append('month_name', event)
    feecheckdata.append('batch_id', this.fee_data.batch_id_fk)
    feecheckdata.append('std_id', this.fee_data.std_id_fk)
    feecheckdata.append('inst_id', this.fee_data.inst_id)

    this.service.check_month_pay(feecheckdata).subscribe(
      (result: any) => {
        console.log(result)
        if (result.data[0].fee_id > 0) {
          this.popup.warning({ detail: 'Warning', summary: 'payment already done ', })
          this.fee_form.controls['fee_monthly'].reset()

        }
      }
    )
  }

  amount_calc() {
    this.fee_form.controls['dist_amt'].reset()
    this.fee_form.controls['net_amt'].setValue(this.fee_form.get('fee_amount')?.value)
    if (this.fee_form.get('dues_amt')?.value < this.fee_form.get('fee_amount')?.value) {
      this.popup.warning({ detail: 'Warning', summary: 'Enter Correct Amount', })
      this.fee_form.controls['fee_amount'].reset()
    }
  }
  discount_calc() {
    this.fee_form.controls['net_amt'].setValue((this.fee_form.get('fee_amount')?.value - this.fee_form.get('dist_amt')?.value))
  }
}