import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/manage.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-employee-login',
  templateUrl: './employee-login.component.html',
  styleUrls: ['./employee-login.component.css']
})
export class EmployeeLoginComponent implements OnInit {
  hide = true
  emploginform !: FormGroup
  constructor(
    private popup: NgToastService,
    private dailog: MatDialog,
    private FromBuilder: FormBuilder,
    private service: ManageService,
    private Router: Router
  ) {
    localStorage.removeItem
    localStorage.clear()
  }

  ngOnInit(): void {
    this.emploginform = this.FromBuilder.group({
      username: ['', Validators.required],
      emp_password: ['', Validators.required],
    })
  }

  employee_login() {
    console.log(this.emploginform.value)
    if (this.emploginform.valid) {
      this.service.post_employee_login(this.emploginform.value).subscribe(
        (res: any) => {
          console.log(res)
          if (res.success) {
            localStorage.setItem('Token', JSON.stringify(res.uid[0]));
              this.Router.navigate(['/employeehome']);
              this.popup.success({ detail: 'Success', summary: 'Login Successfully...', })
            }
            else{
              this.popup.error({ detail: 'Failed', summary: 'Invalid Username or Password...' })
            }
          },
          (error: any) => {
            console.log(error)
            this.popup.error({ detail: 'Failed', summary: 'Invalid Username or Password...' })
          }
        )
      }
      else {
        this.popup.error({ detail: 'Failed', summary: 'Please fill mandatory fields' })
      }
    }
  }
  