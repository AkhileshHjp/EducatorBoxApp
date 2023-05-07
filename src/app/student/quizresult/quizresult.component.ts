import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/manage.service';

@Component({
  selector: 'app-quizresult',
  templateUrl: './quizresult.component.html',
  styleUrls: ['./quizresult.component.css']
})
export class QuizresultComponent implements OnInit {
  url: string = 'assets/';
  img_url: string = '';
  login_deatils: any
  login: any
  score: number = 0
  result: string = ''
  grade: number = 0
  std_data:any
  std_name:any
  inst_name:any
  course_id_fk :any
  constructor(
    private router:Router,
    private servies:ManageService
  ) { 
    this.course_id_fk  =  this.router.getCurrentNavigation()?.extras
    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
  }

  ngOnInit(): void {
    const stddata = new FormData()
    stddata.append('student_id_fk',this.login.std_id)
    stddata.append('course_id_fk',this.course_id_fk)
    // this.servies.get_student_by_std_id(stddata).subscribe(
    //   (res:any)=>{
    //     this.std_data = res.data
    //     this.std_name = res.data.std_name
    //     this.inst_name = res.data.inst_name
    //   }
    // )
    const get_total_qyt =  new FormData()
    get_total_qyt.append('inst_id',this.login.institute_id_fk)
    get_total_qyt.append('course_id',this.course_id_fk)
    this.servies.get_quiz_no_inst_course(get_total_qyt).subscribe(
      (red:any)=>{
        this.grade = red.data.length
      }
    )
    this.servies.get_quiz_result_by_std(stddata).subscribe(
      (result:any)=>{
        this.score = result.data[0].total_result
        if(Number(this.grade)/ 2 < Number(this.score) ){
          this.result =  'Excellent'
        }
        else{
          this.result = 'Good'
        }
      }
    )

   

    if (!this.login.std_img) {
      this.img_url = "profile.png"
    }
    else {
      this.img_url = this.login.std_img
    }

  


  }
  

}
