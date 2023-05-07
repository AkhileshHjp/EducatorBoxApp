import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
@Component({
  selector: 'app-converttoadmission',
  templateUrl: './converttoadmission.component.html',
  styleUrls: ['./converttoadmission.component.css']
})
export class ConverttoadmissionComponent implements OnInit {
  student_form!: FormGroup;
  upload: any;
  hide = true;
  ActionBtn: string = 'Add'
  heading_act: string = 'Convert To Registration'
  admin = 1;
  institute_id: any;
  selectedImage: any = 'https://educatorbox.com/assets/user.png';
  status: any = 1
  login_deatils: any
  login: any
  student_id: Number = 0
  inst_id: any;
  std_data: any;
  std: any = 1;
  autoselect = 'Male'
  std_id: any = 0
  state_data: any
  district_data: any
  image_select:any = null
  image_url:any = "assets/profile.jpg"
  url:string = 'assets/'
  constructor(
    private popup: NgToastService,
    private fb: FormBuilder,
    private service: ManageService,
    private router: Router,
    private matref: MatDialogRef<ConverttoadmissionComponent>,
    @Inject(MAT_DIALOG_DATA) public edit_std: any,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.inst_id = this.login.inst_id
  }

  ngOnInit(): void {
    this.student_form = this.fb.group({
      std_id: [''],
      std_name: ['', Validators.required],
      std_father_name: ['', Validators.required],
      std_father_occupation: ['', Validators.required],
      std_whatsapp_no: ['', Validators.required],
      std_aadhar: ['', Validators.required],
      std_email: ['', Validators.required],
      std_dob: ['', Validators.required],
      std_gender: ['', Validators.required],
      std_state: ['', Validators.required],
      std_district: ['', Validators.required],
      std_regist_date: ['', Validators.required],
      std_img: ['', Validators.required],
      std_address: ['', Validators.required],
      std_password: ['', Validators.required],
      std_regist_no: ['', Validators.required],
      institute_id_fk: ['', Validators.required],
      admin_id_fk: ['', Validators.required],
      center_reg_no: ['']
    })
    const fromdata = new FormData()
    fromdata.append('country_name', 'India')
    this.service.get_state_by_country(fromdata).subscribe(
      (state: any) => {
        this.state_data = state.data
      }
    )
   

    this.regist_no_generate()
    this.student_form.controls['std_regist_date'].setValue(new Date().toISOString().slice(0, 10));
    this.student_form.controls['std_dob'].setValue(new Date().toISOString().slice(0, 10));

    // for enquery to insert 
    if (this.edit_std) {
      this.regist_no_generate()
      this.student_form.controls['std_name'].setValue(this.edit_std.std_name);
      this.student_form.controls['std_father_name'].setValue(this.edit_std.std_father_name);
      this.student_form.controls['std_whatsapp_no'].setValue(this.edit_std.std_whatsapp_no);
      this.student_form.controls['std_gender'].setValue(this.edit_std.std_gender);
      this.student_form.controls['std_regist_date'].setValue(this.edit_std.std_regist_date);
      this.student_form.controls['std_address'].setValue(this.edit_std.std_address);
    }
    this.student_form.controls['institute_id_fk'].setValue(this.login.inst_id);
 }

  student_btn() {

      const fromdata = new FormData()
      fromdata.append('inst_id', this.inst_id)
      fromdata.append('std_email', this.student_form.get('std_email')?.value)
      this.service.std_email_verfiy(fromdata).subscribe(
        (res: any) => {
          if (res.success) {
            this.popup.warning({ detail: 'Warning', summary: 'this email already exists ' + res.data[0].std_name, })
          }
          else {

            this.final_submit()
          }
        },
        (error: any) => {
        }
      )
    
  }

  final_submit() {
    const addharverifactionform =  new FormData()
    addharverifactionform.append('inst_id', this.inst_id)
    addharverifactionform.append('std_addhar', this.student_form.get('std_aadhar')?.value)
    this.service.aadhar_verification(addharverifactionform).subscribe(
      (red:any)=>{
        console.log(red.data[0].addhar)
       if(red.data[0].addhar > 0){
        this.popup.warning({ detail: 'Warning', summary: 'This Addhar already exists ' + red.data[0].std_name, })
        return
       }
       else{

        const formdata = new FormData();
        formdata.append('std_name', this.student_form.get('std_name')?.value)
        formdata.append('std_father_name', this.student_form.get('std_father_name')?.value)
        formdata.append('std_father_occupation', this.student_form.get('std_father_occupation')?.value)
        formdata.append('std_whatsapp_no', this.student_form.get('std_whatsapp_no')?.value)
        formdata.append('std_aadhar', this.student_form.get('std_aadhar')?.value)
        formdata.append('std_email', this.student_form.get('std_email')?.value)
        formdata.append('std_dob', this.student_form.get('std_dob')?.value)
        formdata.append('std_gender', this.student_form.get('std_gender')?.value)
        formdata.append('std_state', this.student_form.get('std_state')?.value)
        formdata.append('std_district', this.student_form.get('std_district')?.value)
        formdata.append('std_regist_date', this.student_form.get('std_regist_date')?.value)
        formdata.append('std_regist_no', this.student_form.get('std_regist_no')?.value)
        formdata.append('std_address', this.student_form.get('std_address')?.value)
        formdata.append('std_password', this.student_form.get('std_password')?.value)
        formdata.append('status', '1')
        formdata.append('profile_status', '1')
        formdata.append('institute_id_fk', this.login.inst_id)
        formdata.append('admin_id_fk', this.student_form.get('admin_id_fk')?.value)
        formdata.append('center_reg_no', this.student_form.get('center_reg_no')?.value)
        formdata.append('std_img', this.image_select)
        formdata.append('enq_id', this.edit_std.enq_id)

        if (this.student_form.valid) {
          this.service.post_student(formdata).subscribe(
            (result: any) => {
              this.matref.close();
              this.student_form.reset();
              this.popup.success({ detail: 'Success', summary: 'Student Saved', })
              this.router.navigate(['/institutehome/student'])
            },
            (error: any) => {
              this.popup.error({ detail: 'Fail', summary: 'Student Not Saved', })
            }
          )
        }
    
       }
      }
    )


  }



  regist_no_generate() {
    const stdfromdata = new FormData()
    stdfromdata.append("inst_id", this.login.inst_id)
    this.service.get_student_by_inst_id(stdfromdata).subscribe(
      (res: any) => {

        this.std_data = res.data
        if (res.success == 1) {
          this.std = res.data.length + 1
          
          this.student_form.controls['std_regist_no'].setValue(this.login.inst_id + formatDate(new Date(), 'yyyyMMdd', 'en') + this.std);
        }
      }
    )
 
    this.student_form.controls['std_regist_no'].setValue(this.login.inst_id + formatDate(new Date(), 'yyyyMMdd', 'en') + this.std);
  }


  // fro image  upload 

onimage(files:any) {
  if (files.length === 0) {
    return;
  }
  let mimeType = files[0].type;
  if (mimeType.match(/image\/*/) == null) {
    console.log('Only images are supported.');
    return;
  }
  let reader = new FileReader();
  this.image_select = files[0];
  this.student_form.get('std_img')?.setValue('01')
  reader.onload = () => {
    this.image_url = reader.result;
  };
  reader.readAsDataURL(this.image_select);
}

  convert_to_admission_data_reset() {
    this.student_form.controls['std_name'].reset()
    this.student_form.controls['std_father_name'].reset()
    this.student_form.controls['std_father_occupation'].reset()
    this.student_form.controls['std_whatsapp_no'].reset()
    this.student_form.controls['std_aadhar'].reset()
    this.student_form.controls['std_email'].reset()
    this.student_form.controls['std_password'].reset()
    this.student_form.controls['std_dob'].reset()
    this.student_form.controls['std_gender'].reset()
    this.student_form.controls['std_state'].reset()
    this.student_form.controls['std_district'].reset()
    this.selectedImage = 'assets/' + this.student_form.controls['std_img'].reset()
    this.student_form.controls['std_address'].reset()
  }

  get_district(event: any) {
    console.log(event)
    const districtformdata = new FormData();
    districtformdata.append('state_name', event)
    this.service.get_district_by_state(districtformdata).subscribe(
      (district_res: any) => {
        this.district_data = district_res.data
      }
    )
  }
}

