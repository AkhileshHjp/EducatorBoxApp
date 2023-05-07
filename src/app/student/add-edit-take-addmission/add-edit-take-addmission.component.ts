import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-edit-take-addmission',
  templateUrl: './add-edit-take-addmission.component.html',
  styleUrls: ['./add-edit-take-addmission.component.css']
})

export class AddEditTakeAddmissionComponent implements OnInit {
  addparty: any;
  admin = 1
  admissition_status = 0
  inst_id_fk: any;
  upload: any;
  actionBtn: string = 'Submit'
  admin_id: any;
  course_data: any
  batch_data: any
  login_deatils: any
  login: any
  inst_id: any
  batch: any;
  reg: boolean = false
  total_fee: any
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  resetparty() {
    throw new Error('Method not implemented.');
  }
  disableSelect = new FormControl(false);
  selector: 'radio-overview-example' | undefined
  addmission_form!: FormGroup;

  constructor(
    private popup: NgToastService,
    private fb: FormBuilder,
    private service: ManageService,
    private router: Router,
    private matref: MatDialogRef<AddEditTakeAddmissionComponent>,
    @Inject(MAT_DIALOG_DATA) public edit_addmission: any
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id = this.login.institute_id_fk
  }

  ngOnInit(): void {
    if (this.inst_id) (
      this.get_course_by_inst(this.inst_id)
    )
    if (this.edit_addmission) {
      this.get_course_by_inst(this.edit_addmission.inst_id)
    }

    this.addmission_form = this.fb.group({
      std_regist_no: ['', Validators.required],
      course_id_fk: ['', Validators.required],
      course_duration: [''],
      course_total_fee: [''],
      course_half_fee: [''],
      course_quarter_fee: [''],
      course_monthly_fee: [''],
      course_admission_fee: [''],
      batch_id_fk: ['', Validators.required],
      batch_arrival: [''],
      batch_departure: [''],
      batch_status: [''],
      batch_date: [''],
      roll_no: ['',],
      admission_date: [''],
      inst_id_fk: [''],
      std_id_fk: [''],
      description: [''],
      admin_id_fk: ['', Validators.required],
      admissition_status: ['', Validators.required]
    })

    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id_fk = this.login.institute_id_fk
    if (this.login.institute_id_fk > 0) {
      this.addmission_form.controls['std_id_fk'].setValue(this.login.std_id);
      this.addmission_form.controls['inst_id_fk'].setValue(this.login.institute_id_fk);
      this.addmission_form.controls['std_regist_no'].setValue(this.login.std_regist_no);
    }
    console.log(this.edit_addmission)
    if (this.edit_addmission) {
      this.addmission_form.controls['std_id_fk'].setValue(this.edit_addmission.std_id);
      this.addmission_form.controls['inst_id_fk'].setValue(this.edit_addmission.inst_id);
      this.addmission_form.controls['std_regist_no'].setValue(this.edit_addmission.std_regist_no);
    }
  }
  get_course_by_inst(inst_id: any) {
    const formdata = new FormData()
    formdata.append("inst_id", inst_id)
    this.service.get_course_for_std(formdata).subscribe(
      (res: any) => {
        this.course_data = res.data
      }
    )
  }

  get_course(event: any) {
    this.addmission_form.get('roll_no')?.reset()
    this.addmission_form.get('batch_arrival')?.reset() 
    this.addmission_form.get('batch_departure')?.reset()
    this.addmission_form.get('batch_status')?.reset() 
    this.addmission_form.get('batch_date')?.reset()
    this.addmission_form.get('admission_date')?.reset()
    this.addmission_form.get('description')?.reset()       
       
    const courseformdata = new FormData();
    courseformdata.append('course_id', event)
    this.service.get_batch_by_course_id(courseformdata).subscribe(
      (course_res: any) => {
        this.batch_data = course_res.data
      }
    )

    this.service.get_course_by_course_id(courseformdata).subscribe(
      (res: any) => {
        this.addmission_form.controls['course_duration'].setValue(res.data.course_duration);
        this.addmission_form.controls['course_admission_fee'].setValue(res.data.course_admission_fee);
        this.addmission_form.controls['course_total_fee'].setValue(res.data.course_total_fee);
        this.addmission_form.controls['course_half_fee'].setValue(res.data.course_half_fee);
        this.addmission_form.controls['course_quarter_fee'].setValue(res.data.course_quarter_fee);
        this.addmission_form.controls['course_monthly_fee'].setValue(res.data.course_monthly_fee);
        this.addmission_form.controls['admission_date'].setValue(new Date().toISOString().slice(0, 10));
      }
    )
  }

  get_batch(event: any) {
    this.addmission_form.controls['batch_arrival'].reset()
    this.addmission_form.controls['batch_status'].reset()
    this.addmission_form.controls['batch_departure'].reset()
    this.addmission_form.controls['batch_date'].reset()
    this.addmission_form.controls['roll_no'].reset()
    const batchfromdata = new FormData();
    batchfromdata.append('batch_id', event)
    if (this.login.inst_id > 0) {
      batchfromdata.append('inst_id', this.login.inst_id)
    }
    if (this.login.institute_id_fk > 0) {
      batchfromdata.append('inst_id', this.login.institute_id_fk)
    }
    this.service.get_batch_by_batch_id(batchfromdata).subscribe(
      (batch_res: any) => {
        this.addmission_form.controls['batch_arrival'].setValue(batch_res.data.batch_arrival);
        this.addmission_form.controls['batch_departure'].setValue(batch_res.data.batch_departure);
        this.addmission_form.controls['batch_status'].setValue(batch_res.data.batch_status);
        this.addmission_form.controls['batch_date'].setValue(batch_res.data.batch_date);
      }
    )


    if (this.login.inst_id > 0) {
      this.service.count_roll_no_by_batch(batchfromdata).subscribe(
        (result: any) => {
          console.log(result.data[0].total_roll)
          const roll_no = Number(result.data[0].total_roll)+ Number(1)
          this.addmission_form.controls['roll_no'].setValue(roll_no)
        }
      )
      this.addmission_form.controls['roll_no'].setValue(1)
    }
    else{
      // this.addmission_form.controls['roll_no'].setValue('')
    }
   

    // for addmisstion check 
    const fromdata = new FormData()
    if (this.edit_addmission) {
      fromdata.append('std_id', this.edit_addmission.std_id)
    }
    if (this.inst_id) {
      fromdata.append('std_id', this.login.std_id)
    }
    fromdata.append('batch_id', event)
    this.service.duplicate_addmission(fromdata).subscribe(
      (result: any) => {
        if (result.data.admission_id > 0) {
          this.popup.error({ detail: 'Already Admission', summary: 'Already Taken Admission ' })
          this.addmission_form.controls['batch_id_fk'].reset()
          this.addmission_form.controls['batch_arrival'].reset()
          this.addmission_form.controls['batch_status'].reset()
          this.addmission_form.controls['roll_no'].reset()
        }
      }
    )
  }

  addstd() {
    const formdata = new FormData();
    formdata.append('std_regist_no', this.addmission_form.get('std_regist_no')?.value)
    formdata.append('inst_id_fk', this.addmission_form.get('inst_id_fk')?.value)
    formdata.append('std_id_fk', this.addmission_form.get('std_id_fk')?.value)
    formdata.append('course_id_fk', this.addmission_form.get('course_id_fk')?.value)
    formdata.append('batch_id_fk', this.addmission_form.get('batch_id_fk')?.value)
    formdata.append('admission_date', this.addmission_form.get('admission_date')?.value)
    formdata.append('admin_id_fk', this.addmission_form.get('admin_id_fk')?.value)
    formdata.append('description', this.addmission_form.get('description')?.value)
    formdata.append('admissition_status', this.addmission_form.get('admissition_status')?.value)
    formdata.append('discount', this.addmission_form.get('admissition_status')?.value)
    this.total_fee = Number(this.addmission_form.get('course_total_fee')?.value) + Number(this.addmission_form.get('course_admission_fee')?.value)
    formdata.append('total_fee', this.total_fee)

    if (this.edit_addmission) {
      formdata.append('admissition_status', '1')
    }
    if (this.inst_id) {
      formdata.append('admissition_status', '0')
    }
    if(this.login.inst_id){
      formdata.append('roll_no', this.addmission_form.get('roll_no')?.value)
    }
    

    this.service.std_admission(formdata).subscribe(
      (result: any) => {
        console.log(result)
        this.addmission_form.reset();
        this.matref.close(0)
        this.popup.success({ detail: 'Success', summary: 'Admission Successfully..' })
        if (this.edit_addmission) {
          this.router.navigate(['/institutehome/admission'])
        }
        if (this.inst_id) {
          this.router.navigate(['/studenthome/takeaddmission'])
        }
      },
      (error: any) => {
        console.log(error)
        this.popup.error({ detail: 'Unsuccess', summary: 'Admission Unsuccess..' })
      }
    )
  }

 
}