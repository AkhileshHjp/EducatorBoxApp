import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { ManageService } from 'src/app/manage.service';

@Component({
  selector: 'app-employee-profile-update',
  templateUrl: './employee-profile-update.component.html',
  styleUrls: ['./employee-profile-update.component.css']
})
export class EmployeeProfileUpdateComponent implements OnInit {
  empForm !: FormGroup;
  admin_id = 1;
  actionBtn: string = 'Update'
  profileI: any = null;
  photo: any
  hide = true;
  login_deatils: any;
  login: any;
  inst_id: any;
  inst_id_for_inst_login: any;
  image_url: any = "assets/img.png"
  url: string = 'https://educatorbox.com/assets/'
  image_select: any
  institute_id: any
  emp_profile_data: any
  emp_id: any
  employee_id: any

  constructor(
    private popup: NgToastService,
    private fb: FormBuilder,
    private router: Router,
    private manageService: ManageService,
    private matref: MatDialogRef<EmployeeProfileUpdateComponent>
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    console.log(this.login.emp_id)
    this.employee_id = this.login.emp_id
    if (!this.login.emp_photo) {
      this.image_url = "profile.png"
    }
    else {
      this.image_url = this.login.emp_photo
    }
  }

  ngOnInit(): void {
    this.empForm = this.fb.group({
      emp_id: ['',],
      emp_name: ['', Validators.required],
      emp_email: ['', Validators.required],
      emp_account_no: ['', Validators.required],
      emp_whatsapp: ['', Validators.required],
      emp_password: ['', Validators.required],
      emp_ac_holder_name: ['', Validators.required],
      emp_aadhar_no: ['', Validators.required],
      emp_photo: ['',],
      emp_ifsc: ['', Validators.required],
      emp_address: [''],
      institute_id_fk: ['', Validators.required],
      admin_id_fk: ['', Validators.required],
    })

    this.profile_set_data(this.employee_id)
    this.empForm.controls['institute_id_fk'].setValue(this.login.institute_id_fk);

  }
  profile_set_data(emp_id_fun: any) {
    const formdata = new FormData()
    formdata.append('emp_id', emp_id_fun)
    this.manageService.get_emp_by_emp_id(formdata).subscribe(
      (res: any) => {
        console.log(res.data)
        this.emp_profile_data = res.data
        this.empForm.controls['emp_id'].setValue(Number(this.emp_profile_data.emp_id));
        this.empForm.controls['emp_name'].setValue(this.emp_profile_data.emp_name);
        this.empForm.controls['emp_whatsapp'].setValue(this.emp_profile_data.emp_whatsapp);
        this.empForm.controls['emp_email'].setValue(this.emp_profile_data.emp_email);
        this.empForm.controls['emp_password'].setValue(this.emp_profile_data.emp_password);
        this.empForm.controls['emp_address'].setValue(this.emp_profile_data.emp_address);
        this.empForm.controls['emp_ac_holder_name'].setValue(this.emp_profile_data.emp_ac_holder_name);
        this.empForm.controls['emp_aadhar_no'].setValue(this.emp_profile_data.emp_aadhar_no);
        this.empForm.controls['emp_account_no'].setValue(this.emp_profile_data.emp_account_no);
        this.empForm.controls['emp_ifsc'].setValue(this.emp_profile_data.emp_ifsc);
        this.empForm.controls['institute_id_fk'].setValue(this.emp_profile_data.institute_id_fk);
        this.empForm.controls['admin_id_fk'].setValue(this.emp_profile_data.admin_id_fk);
        this.image_url = this.url + this.emp_profile_data.emp_photo
        this.image_select = this.emp_profile_data.emp_photo
      })
  }

  profileupdate() {
    console.log(this.empForm.value)
    const formdataedit = new FormData();
    formdataedit.append('emp_id', this.empForm.get('emp_id')?.value)
    formdataedit.append('emp_name', this.empForm.get('emp_name')?.value)
    formdataedit.append('emp_aadhar_no', this.empForm.get('emp_aadhar_no')?.value)
    formdataedit.append('emp_ac_holder_name', this.empForm.get('emp_ac_holder_name')?.value)
    formdataedit.append('emp_account_no', this.empForm.get('emp_account_no')?.value)
    formdataedit.append('emp_address', this.empForm.get('emp_address')?.value)
    formdataedit.append('emp_email', this.empForm.get('emp_email')?.value)
    formdataedit.append('emp_ifsc', this.empForm.get('emp_ifsc')?.value)
    formdataedit.append('emp_password', this.empForm.get('emp_password')?.value)
    formdataedit.append('emp_photo', this.empForm.get('emp_photo')?.value)
    formdataedit.append('emp_whatsapp', this.empForm.get('emp_whatsapp')?.value)
    formdataedit.append('institute_id_fk', this.emp_profile_data.institute_id_fk)
    formdataedit.append('admin_id_fk', this.empForm.get('admin_id_fk')?.value)
    formdataedit.append('emp_photo', this.image_select)
    this.manageService.putEmployee(formdataedit).subscribe({
      next: (res) => {
        console.log(res)
        this.matref.close();
        this.profile_set_data(this.emp_id)
        this.popup.success({ detail: 'Success', summary: 'Employee Updated' })
        this.router.navigate(['employeehome/employeedashboard'])
      },
      error: (error) => {
        console.log(error)
        this.popup.error({ detail: 'Error', summary: 'Employee Not Updated' })
      }
    })
  }
  employee_data_reset() {
    this.empForm.reset()
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
    reader.onload = () => {
      this.image_url = reader.result;
    };
    reader.readAsDataURL(this.image_select);
  }
}
