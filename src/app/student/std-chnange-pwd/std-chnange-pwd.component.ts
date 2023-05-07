import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, RouterLinkWithHref } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ManageService } from 'src/app/manage.service';

@Component({
  selector: 'app-std-chnange-pwd',
  templateUrl: './std-chnange-pwd.component.html',
  styleUrls: ['./std-chnange-pwd.component.css']
})
export class StdChnangePwdComponent implements OnInit {
  passwordbox: boolean = true
  otpaction: boolean = true
  disableSelect = new FormControl(false);
  ForgotPassword!: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true
  send_otp: any
  std_id: any
  disable_box: boolean = false
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private servies: ManageService,
    private popup: NgToastService,
    private matref: MatDialogRef<StdChnangePwdComponent>,
    @Inject(MAT_DIALOG_DATA) public edit_batch: any
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }
  ngOnInit(): void {
    this.ForgotPassword = this.fb.group({
      std_email: ['', Validators.required],
      std_aadhar: ['', Validators.required],
      std_dob: ['', Validators.required],
      otp_recive: [''],
      std_password: [''],

    })
  }


  onreset() {
    const verifiydata = new FormData()
    verifiydata.append('std_email', this.ForgotPassword.get('std_email')?.value)
    verifiydata.append('std_aadhar', this.ForgotPassword.get('std_aadhar')?.value)
    verifiydata.append('std_dob', this.ForgotPassword.get('std_dob')?.value)
    this.servies.std_verifiy_forgot(verifiydata).subscribe(
      (res: any) => {
        this.std_id = res.data[0].std_id
        if (!res.success) {
          this.popup.warning({ detail: 'Warning', summary: 'Wrong information...', })
        }
        else {
          this.send_otp = Math.floor(100000 + Math.random() * 900000);
          const formdata = new FormData()
          formdata.append("send_otp", this.send_otp);
          formdata.append("tomail", this.ForgotPassword.get('std_email')?.value)
          this.servies.inst_reg_otp(formdata).subscribe(
            (res: any) => {
              if (res.success) {
                this.popup.success({ detail: 'Success', summary: 'OTP Send Sucessfully...', })
                this.otpaction = false
                this.disable_box = true
              }
              else {
              }
            }
          )
        }
      },     
    )

  }


  verifyotp() {
    if (this.send_otp == this.ForgotPassword.get('otp_recive')?.value) {
      this.passwordbox = false
    } else {
      this.popup.warning({ detail: 'Warning', summary: 'Enter Valid OTP ...', })

    }
  }

  chnagepass() {
    const chnageform = new FormData()
    chnageform.append('std_password', this.ForgotPassword.get('std_password')?.value)
    chnageform.append('std_id', this.std_id)
    this.servies.std_chnage_password(chnageform).subscribe(
      (res: any) => {
        this.popup.success({ detail: 'Success', summary: 'Password Change Sucessfully...', })
        this.matref.close()
        console.log(res)
      }
    )

  }



}