import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

export class StudentProfileComponent implements OnInit {
  student_form!: FormGroup;
  admin = 1;
  hide = true
  imgurl: any = 'profile.png';
  login_deatils: any
  login: any
  student_id: any
  student_profile_data: any
  status: any = 1
  autoselect = 'Male'
  state_data: any;
  district_data: any
  image_url: any = "assets/profile.jpg"
  image_select: any 

  constructor(
    private popup: NgToastService,
    private service: ManageService,
    private FormBuilder: FormBuilder,
    private router: Router,
    private matref: MatDialogRef<StudentProfileComponent>
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.student_id = this.login.std_id
    console.log("std regist" + this.login.std_regist_no)
    console.log("inst" + this.login.institute_id_fk)
  
    if (this.login.std_img) {
      this.imgurl = this.login.std_img

    }
  
  }

  ngOnInit(): void {
    this.student_form = this.FormBuilder.group({
      std_id: [''],
      std_name: ['', Validators.required],
      std_father_name: ['', Validators.required],
      std_father_occupation: [''],
      std_whatsapp_no: ['', Validators.required],
      std_aadhar: ['', Validators.required],
      std_email: ['', Validators.required],
      std_dob: ['', Validators.required],
      std_gender: ['', Validators.required],
      std_state: ['', Validators.required],
      std_district: ['', Validators.required],
      std_regist_date: ['', Validators.required],
      std_regist_no: ['', Validators.required],
      std_img: ['', Validators.required],
      std_address: ['', Validators.required],
      status: ['1', Validators.required],
      institute_id_fk: ['', Validators.required],
      admin_id_fk: ['', Validators.required],
      center_reg_no: ['',]
    })
    this.profile_set_data(this.student_id)
    this.student_form.controls['institute_id_fk'].setValue(this.login.institute_id_fk);
    this.student_form.controls['std_regist_no'].setValue(this.login.std_regist_no);

    this.service.get_state().subscribe(
      (state: any) => {
        this.state_data = state.data
      }
    )
    this.service.get_district().subscribe(
      (district_res: any) => {
        this.district_data = district_res.data
      }
    )
  }

  profile_set_data(std_id_fun: any) {
    const formdata = new FormData()
    formdata.append('std_id', std_id_fun)
    this.service.get_student_by_std_id(formdata).subscribe(
      (res: any) => {
        console.log(res)
        this.student_profile_data = res.data
        this.student_form.controls['center_reg_no'].setValue(this.student_profile_data.center_reg_no);
        this.student_form.controls['std_address'].setValue(this.student_profile_data.std_address);
        this.student_form.controls['std_id'].setValue(this.student_profile_data.std_id);
        this.student_form.controls['std_name'].setValue(this.student_profile_data.std_name);
        this.student_form.controls['std_father_name'].setValue(this.student_profile_data.std_father_name);
        this.student_form.controls['std_father_occupation'].setValue(this.student_profile_data.std_father_occupation);
        this.student_form.controls['std_whatsapp_no'].setValue(this.student_profile_data.std_whatsapp_no);
        this.student_form.controls['std_aadhar'].setValue(this.student_profile_data.std_aadhar);
        this.student_form.controls['std_email'].setValue(this.student_profile_data.std_email);
        this.student_form.controls['std_dob'].setValue(this.student_profile_data.std_dob);
        this.student_form.controls['std_gender'].setValue(this.student_profile_data.std_gender);
        this.student_form.controls['std_state'].setValue(this.student_profile_data.std_state);
        this.student_form.controls['std_district'].setValue(this.student_profile_data.std_district);
        this.student_form.controls['std_regist_date'].setValue(this.student_profile_data.std_regist_date);
        this.student_form.controls['std_regist_no'].setValue(this.student_profile_data.std_regist_no);
        this.student_form.controls['std_img'].setValue(this.student_profile_data.std_img);
        this.student_form.controls['institute_id_fk'].setValue(this.login.institute_id_fk);
        this.student_form.controls['admin_id_fk'].setValue(this.student_profile_data.admin_id_fk);
          this.autoselect = this.student_profile_data.std_gender
        if(this.student_profile_data.std_img){
          this.image_url = 'assets/' + this.student_profile_data.std_img
        }

      })
  }

  update_profile() {
    const addharverifactionform = new FormData()
    addharverifactionform.append('inst_id', this.login.institute_id_fk)
    addharverifactionform.append('std_addhar', this.student_form.get('std_aadhar')?.value)
    this.service.aadhar_verification(addharverifactionform).subscribe(
      (red: any) => {
        console.log(red.data[0].addhar)
        if (red.data[0].addhar > 0) {
          this.popup.warning({ detail: 'Warning', summary: 'This Addhar already exists ' + red.data[0].std_name, })
          return
        }

        else {
          const formdata = new FormData();
          formdata.append('std_id', (this.student_profile_data.std_id))
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
          formdata.append('std_regist_no', this.login.std_regist_no)
          formdata.append('std_address', this.student_form.get('std_address')?.value)
          formdata.append('status', this.status)
          formdata.append('institute_id_fk', (this.login.institute_id_fk))
          formdata.append('admin_id_fk', this.student_form.get('admin_id_fk')?.value)
          formdata.append('center_reg_no', this.student_form.get('center_reg_no')?.value)
          formdata.append('std_img', this.image_select)

          console.log(this.student_form.value)
          if (this.student_form.valid) {
            this.service.put_student(formdata).subscribe(
              (result: any) => {
                console.log(result)
                this.popup.success({ detail: 'Success', summary: 'Profile Update Successfully..', })
                this.profile_set_data(this.student_id)
                this.router.navigate(['studenthome/dashboard'])
                this.matref.close()
              },
              (error: any) => {
                console.log(error)
                this.popup.error({ detail: 'Unsuccess', summary: 'Profile Not Update..', })
              }
            )
          }
          this.popup.warning({ detail: 'Warning', summary: 'Fill all the filds..', })

        }
      })
  }

  onimage(files: any) {
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
    this.student_form.get('std_img')?.setValue(this.image_select)
    reader.onload = () => {
      this.image_url = reader.result;
    };
    reader.readAsDataURL(this.image_select);
  }

  reset() {

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
