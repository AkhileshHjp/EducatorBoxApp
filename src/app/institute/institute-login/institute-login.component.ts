import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageService } from 'src/app/manage.service';
import { AddEditRegistrationComponent } from '../add-edit-registration/add-edit-registration.component';
import { NgToastService } from 'ng-angular-popup';
import { InstChangePasswordComponent } from '../inst-change-password/inst-change-password.component';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { LoginanotheComponent } from 'src/app/admin/loginanothe/loginanothe.component';


@Component({
  selector: 'app-institute-login',
  templateUrl: './institute-login.component.html',
  styleUrls: ['./institute-login.component.css']
})
export class InstituteLoginComponent implements OnInit {
  hide = true;
  deletevalue = 1
  inst_login_form !: FormGroup
  constructor(
    private popup: NgToastService,
    private dailog: MatDialog,
    private FromBuilder: FormBuilder,
    private service: ManageService,
    private router: Router

  ) {
    localStorage.removeItem
    localStorage.clear()
  }

  ngOnInit(): void {
    this.inst_login_form = this.FromBuilder.group({
      username: ['', Validators.required],
      inst_password: ['', Validators.required],
    })
  }


  new_account(): any {
    this.dailog.open(AddEditRegistrationComponent, {
      disableClose: true,
      panelClass:'all_dialog'
    })
    localStorage.removeItem
    localStorage.clear()
  }

  forgot_password(): any {
    this.dailog.open(InstChangePasswordComponent, {
      disableClose: true
    }
    )
  }

  inst_login() {
    if (this.inst_login_form.valid) {
      this.service.inst_login(this.inst_login_form.value).subscribe(
        (res: any) => {

          if (res.success) {
            localStorage.setItem('Token', JSON.stringify(res.uid[0]));
            this.router.navigate(['/institutehome']);
            this.popup.success({ detail: 'Success', summary: 'Login Successfull...', })

          }
          else {
            this.popup.error({ detail: 'Failed', summary: 'Invalid Username or Password...' })
          }
        },
        (error: any) => {
          this.popup.error({ detail: 'Failed', summary: 'Invalid Username or Password...' })
        }
      )
    }
    else {
      this.popup.error({ detail: 'Failed', summary: 'Please fill mandatory fields' })
    }
  }
}
