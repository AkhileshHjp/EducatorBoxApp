import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, RouterLinkWithHref } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ManageService } from 'src/app/manage.service';

@Component({
  selector: 'app-inst-change-password',
  templateUrl: './inst-change-password.component.html',
  styleUrls: ['./inst-change-password.component.css']
})
export class InstChangePasswordComponent implements OnInit {
  disableSelect = new FormControl(false);
  ForgotPassword!: FormGroup;
  hide = true
  otpaction1: boolean = true
  otpaction: boolean = true
  send_otp: any
  email_box: boolean = false
  inst_id: any = 0
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private popup: NgToastService,
    private servies: ManageService,
    private matref: MatDialogRef<InstChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public edit_batch: any
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.ForgotPassword = this.fb.group({
      inst_email: ['', Validators.required],
      document_no: ['', Validators.required],
      otp_recive: [''],
      inst_password: [''],
    })
  }

  onreset() {
    const verifiydata = new FormData()
    verifiydata.append('inst_email', this.ForgotPassword.get('inst_email')?.value)
    verifiydata.append('document_no', this.ForgotPassword.get('document_no')?.value)
    this.servies.verifiy_forgot(verifiydata).subscribe(
      (res: any) => {
        if(res.success == 0){
          this.popup.warning({ detail: 'Warning', summary: 'Wrong information...', })
          return
        }
        console.log(res)
        this.inst_id = res.data[0].inst_id
        if (!res.success) {
          this.popup.warning({ detail: 'Warning', summary: 'Wrong information...', })
        }
        else {
          this.send_otp = Math.floor(100000 + Math.random() * 900000);
          const formdata = new FormData()
          formdata.append("send_otp", this.send_otp);
          formdata.append("tomail", this.ForgotPassword.get('inst_email')?.value)
          this.servies.inst_reg_otp(formdata).subscribe(
            (res: any) => {
              if (res.success) {
                this.popup.success({ detail: 'Success', summary: 'OTP send on E-mail', })
                this.otpaction = false
                this.email_box = true
              }

              else {
                this.popup.warning({ detail: 'Warning', summary: 'Wrong information...', })

              }
            }
          )
          
        }
       
      },
      (error:any)=>{
        this.popup.warning({ detail: 'Warning', summary: 'Wrong information...', })

      }
      
    )

  }


  verifyotp() {
    if (this.send_otp == this.ForgotPassword.get('otp_recive')?.value) {
      this.otpaction1 = false
    } else {
      this.popup.warning({ detail: 'Warning', summary: 'Enter Valid OTP ...', })

    }
  }

  chnagepass() {
    const chnageform = new FormData()
    chnageform.append('inst_password', this.ForgotPassword.get('inst_password')?.value)
    chnageform.append('inst_id', this.inst_id)
    this.servies.inst_chnage_password(chnageform).subscribe(
      (res: any) => {
        console.log(res)
        this.popup.success({ detail: 'Success', summary: 'Password Change Sucessfully...', })
        this.matref.close()
      }
    )

  }

}