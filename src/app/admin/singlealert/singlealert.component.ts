import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-singlealert',
  templateUrl: './singlealert.component.html',
  styleUrls: ['./singlealert.component.css']
})
export class SinglealertComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matref: MatDialogRef<SinglealertComponent>

  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  onNoClick(){
    this.matref.close()
  }
}
