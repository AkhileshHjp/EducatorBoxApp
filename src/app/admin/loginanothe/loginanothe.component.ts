import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loginanothe',
  templateUrl: './loginanothe.component.html',
  styleUrls: ['./loginanothe.component.css']
})
export class LoginanotheComponent implements OnInit {

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matref: MatDialogRef<LoginanotheComponent>

  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  onNoClick(){
    this.matref.close()
  }
}
