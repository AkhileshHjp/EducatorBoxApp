import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ManageService } from 'src/app/manage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-edit-registration',
  templateUrl: './add-edit-registration.component.html',
  styleUrls: ['./add-edit-registration.component.css']
})
export class AddEditRegistrationComponent implements OnInit {
  inst_regist_from!: FormGroup;
  admin = 1;
  hide = true;
  send_otp:any
  valid_otp:boolean = true
  otp_hidden_area: boolean = true
  disable_box:boolean = false
  action_btn :string = 'Register'
  constructor(
    private popup:NgToastService,
    private FormBuilder: FormBuilder,
    private manageservice: ManageService,
    private matref: MatDialogRef<AddEditRegistrationComponent>,
  ) { }

  ngOnInit(): void {
    this.inst_regist_from = this.FormBuilder.group({
      inst_name: ['', Validators.required],
      inst_owner_name: ['', Validators.required],
      inst_whatsapp_no: ['', Validators.required],
      inst_email: ['', Validators.required],
      inst_password: ['', Validators.required],
      inst_address: ['', Validators.required],
      inst_regist_date: ['', Validators.required],
      admin_id_fk: ['', Validators.required],
      otp_recive: [''],
    })
    this.inst_regist_from.controls['inst_regist_date'].setValue(new Date().toISOString().slice(0, 10));
  }

  inst_regist() {
    this.send_otp =  Math.floor(100000 + Math.random() * 900000);
    const formdata = new FormData()
    formdata.append("send_otp", this.send_otp) ;
    formdata.append("tomail",this.inst_regist_from.get('inst_email')?.value)
    this.manageservice.inst_reg_otp(formdata).subscribe(
      (res:any)=>{
        console.log(res.success)
        if(res.success){
        this.popup.success({ detail: 'Success', summary:'OTP send on E-mail',})
          this.otp_hidden_area = false
          this.disable_box = true
        }
        else{
        this.popup.error({ detail: 'Fail', summary:'OTP send fail...',})
        }
      }
    )
  }

  final_submit(){
    if(this.send_otp == this.inst_regist_from.get('otp_recive')?.value){
      this.manageservice.inst_self_reg(this.inst_regist_from.value).subscribe(
        (result: any) => {
          console.log(result)
          this.matref.close();
          this.popup.success({ detail: 'Success', summary: 'Registration Successfully..',})
        },
        (error: any) => {
          console.log(error)
          this.popup.error({ detail: 'Fail', summary: 'Registration fail..',})
        }
      )
    }else{
      this.popup.warning({ detail: 'Warning', summary: 'Invalid OTP.',})

    }


    
   

  }

  match_otp(){
  console.log(this.inst_regist_from.get('otp_recive')?.value)
 
}
  form_reset() {
    this.inst_regist_from.reset()
  }
  
}



