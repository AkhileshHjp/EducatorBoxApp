import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageService } from 'src/app/manage.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
@Component({
  selector: 'app-institute-update-profile',
  templateUrl: './institute-update-profile.component.html',
  styleUrls: ['./institute-update-profile.component.css']
})
export class InstituteUpdateProfileComponent implements OnInit {
  admin = 1;
  InstForm !: FormGroup;
  hide = true;
  actionBtn: string = 'Update'
  instupdate: string = 'Profile Update'
  imgUrl: string = 'https://educatorbox.com/assets/';
  institute_profile_data: any
  institute_id: any;
  login_deatils: any;
  login: any;
  country_data: any;
  district_data: any;
  state_data: any;
  document_url: any = "assets/doc.png"
  document_select: any
  logo_url: any = 'assets/user.png';
  logo_select: any
  constructor(
    @Inject(MAT_DIALOG_DATA) public editinst: any,
    private matref: MatDialogRef<InstituteUpdateProfileComponent>,
    private FromBuilder: FormBuilder,
    private service: ManageService,
    private popup: NgToastService,
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    console.log(this.login.inst_id)
    this.institute_id = this.login.inst_id
  }

  ngOnInit(): void {
    this.InstForm = this.FromBuilder.group({
      inst_id: [''],
      inst_name: ['', Validators.required],
      inst_owner_name: ['', Validators.required],
      inst_whatsapp_no: ['', Validators.required],
      inst_email: ['', Validators.required],
      inst_password: ['', Validators.required],
      inst_country: ['', Validators.required],
      inst_state: ['', Validators.required],
      inst_district: ['', Validators.required],
      inst_address: ['', Validators.required],
      center_code: ['0',],
      account_no: [''],
      inst_ifsc: [''],
      account_holder: [''],
      inst_logo: [''],
      inst_doct: ['', Validators.required],
      inst_doct_number: ['', Validators.required],
      inst_doct_img: ['',],
      admin_id_fk: ['', Validators.required]
    })

    this.service.get_country().subscribe(
      (state_res: any) => {
        this.country_data = state_res.data
      }
    )
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
    this.profile_set_data()
  }
  profile_set_data() {
    const formdata = new FormData()
    formdata.append('inst_id', this.institute_id)
    this.service.get_inst_by_inst_id(formdata).subscribe(
      (res: any) => {
        console.log(res.data)
        this.institute_profile_data = res.data
        this.InstForm.controls['inst_name'].setValue(this.institute_profile_data.inst_name);
        this.InstForm.controls['inst_owner_name'].setValue(this.institute_profile_data.inst_owner_name);
        this.InstForm.controls['inst_whatsapp_no'].setValue(this.institute_profile_data.inst_whatsapp_no);
        this.InstForm.controls['inst_email'].setValue(this.institute_profile_data.inst_email);
        this.InstForm.controls['inst_password'].setValue(this.institute_profile_data.inst_password);
        this.InstForm.controls['inst_country'].setValue(this.institute_profile_data.inst_country);
        this.InstForm.controls['inst_state'].setValue(this.institute_profile_data.inst_state);
        this.InstForm.controls['inst_district'].setValue(this.institute_profile_data.inst_district);
        this.InstForm.controls['inst_address'].setValue(this.institute_profile_data.inst_address);
        this.InstForm.controls['account_no'].setValue(this.institute_profile_data.account_no);
        this.InstForm.controls['inst_ifsc'].setValue(this.institute_profile_data.inst_ifsc);
        this.InstForm.controls['account_holder'].setValue(this.institute_profile_data.account_holder);
        this.InstForm.controls['center_code'].setValue(this.institute_profile_data.center_code);
        this.InstForm.controls['inst_doct'].setValue(this.institute_profile_data.inst_doct);
        this.InstForm.controls['inst_doct_number'].setValue(this.institute_profile_data.inst_doct_number);
        this.InstForm.controls['inst_logo'].setValue(this.institute_profile_data.inst_logo);
        this.InstForm.controls['inst_doct_img'].setValue(this.institute_profile_data.inst_doct_img);

        console.log(this.institute_profile_data)
        if (this.institute_profile_data.inst_doct_img ) {
          this.document_url = 'https://educatorbox.com/assets/' + this.institute_profile_data.inst_doct_img
        }
        if (this.institute_profile_data.inst_logo) {
          this.logo_url = 'https://educatorbox.com/assets/' + this.institute_profile_data.inst_logo
        }
      })
  }

  update_profile() {
    console.log(this.InstForm.value)
    const updatedata = new FormData();
    updatedata.append('inst_id', (this.institute_profile_data.inst_id))
    updatedata.append('inst_name', this.InstForm.get('inst_name')?.value)
    updatedata.append('inst_owner_name', this.InstForm.get('inst_owner_name')?.value)
    updatedata.append('inst_whatsapp_no', this.InstForm.get('inst_whatsapp_no')?.value)
    updatedata.append('inst_email', this.InstForm.get('inst_email')?.value)
    updatedata.append('inst_password', this.InstForm.get('inst_password')?.value)
    updatedata.append('inst_country', this.InstForm.get('inst_country')?.value)
    updatedata.append('inst_state', this.InstForm.get('inst_state')?.value)
    updatedata.append('inst_district', this.InstForm.get('inst_district')?.value)
    updatedata.append('inst_address', this.InstForm.get('inst_address')?.value)
    updatedata.append('account_no', this.InstForm.get('account_no')?.value)
    updatedata.append('inst_ifsc', this.InstForm.get('inst_ifsc')?.value)
    updatedata.append('account_holder', this.InstForm.get('account_holder')?.value)
    updatedata.append('inst_doct', this.InstForm.get('inst_doct')?.value)
    updatedata.append('inst_doct_number', this.InstForm.get('inst_doct_number')?.value)
    updatedata.append('center_code', this.InstForm.get('center_code')?.value)
    updatedata.append('admin_id_fk', this.InstForm.get('admin_id_fk')?.value)
    updatedata.append('inst_logo', this.logo_select)
    updatedata.append('inst_doct_img', this.document_select)

    if (this.InstForm.valid) {
      console.log(this.InstForm)
      this.service.put_inst(updatedata).subscribe(
        (result: any) => {
          console.log(result)
          this.matref.close();
          this.popup.success({ detail: 'Success', summary: 'Profile Updated', })
          this.router.navigate(['/institutehome/dashboard'])
        },
        (error: any) => {
          console.log(error)
          this.popup.error({ detail: 'Unsuccess', summary: 'Profile Not Updated', })
        }
      )
    }
  }

  get_state(event: any) {
    console.log(event)
    const stateformdata = new FormData();
    stateformdata.append('country_name', event)
    this.service.get_state_by_country(stateformdata).subscribe(
      (state_res: any) => {
        this.state_data = state_res.data
      }
    )
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

  // fro document upload 
  ondocument(files: any) {
    if (files.length === 0) {
      return;
    }
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      console.log('Only images are supported.');
      return;
    }
    let reader = new FileReader();
    this.document_select = files[0];
    reader.onload = () => {
      this.document_url = reader.result;
    };
    reader.readAsDataURL(this.document_select);
  }

  // fro logo  upload 
  onlogo(files: any) {
    if (files.length === 0) {
      return;
    }
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      console.log('Only images are supported.');
      return;
    }
    let reader = new FileReader();
    this.logo_select = files[0];
    reader.onload = () => {
      this.logo_url = reader.result;
    };
    reader.readAsDataURL(this.logo_select);
  }

}
