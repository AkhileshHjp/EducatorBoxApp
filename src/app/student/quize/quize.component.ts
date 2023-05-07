import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { ManageService } from 'src/app/manage.service';
@Component({
  selector: 'app-quize',
  templateUrl: './quize.component.html',
  styleUrls: ['./quize.component.css']
})

export class QuizeComponent implements OnInit {
  quizfrom !: FormGroup
  admin: any = 1
  count_ques: number = 0;
  quizQuestion: any
  quiz_option_a: string = "A"
  quiz_option_b: string = "B"
  quiz_option_c: string = "C"
  quiz_option_d: string = "D"
  quiz_description: any
  color1: string = ""
  color2: string = ""
  color3: string = ""
  color4: string = ""
  score: number = 0
  currentQuestion: number = 0
  hidden: boolean = true;
  course_data: any
  inst_id: any
  interval: any
  counter = 5
  backgroundColor1: string = ""
  backgroundColor2: string = ""
  backgroundColor3: string = ""
  backgroundColor4: string = ""
  questionlist: any = [];
  answer: any;
  correctanswer: Number = 0
  login_deatils: any;
  login: any;
  std_id: any;
  quizscore_id: any
  // std_data = Array<{std_id: number, course_id_fk: number}>;

  constructor(
    private service: ManageService,
    private router: Router,
    private FromBuilder: FormBuilder,
  ) {

    const navigation = this.router.getCurrentNavigation();
    this.course_data = navigation?.extras

    this.login_deatils = localStorage.getItem('Token')
    this.login = JSON.parse(this.login_deatils)
    this.std_id = this.login.std_id
  }
  ngOnInit(): void {

    const fromdata = new FormData()
    fromdata.append("course_id", this.course_data.course_id)
    fromdata.append("inst_id", this.course_data.institute_id_fk)
    this.service.get_quiz_by_inst_id(fromdata).subscribe(
      (res: any) => {
        this.questionlist = res.data
        this.quiz_description = res.data[0].quiz_description
        this.count_ques = res.data.length
      }
    )

    this.quizfrom = this.FromBuilder.group({
      quiz_option_a: ['', Validators.required],
      quiz_option_b: ['', Validators.required],
      quiz_option_c: ['', Validators.required],
      quiz_option_d: ['', Validators.required],
      institute_id_fk: ['', Validators.required],
      course_id_fk: ['', Validators.required],
      student_id_fk: ['', Validators.required],
      admin_id_fk: ['', Validators.required],
    })

  }

  postQuizResult(correctanswer: any) {
    const quizfromdata = new FormData()
    quizfromdata.append("institute_id_fk", this.course_data.institute_id_fk)
    quizfromdata.append("student_id_fk", this.std_id)
    quizfromdata.append("course_id_fk", this.course_data.course_id)
    quizfromdata.append("quiz_id_fk", this.questionlist[this.currentQuestion]?.quiz_id)
    quizfromdata.append("quiz_answer", this.questionlist[this.currentQuestion]?.quiz_answer)
    quizfromdata.append("correctanswer", correctanswer)
    quizfromdata.append("admin_id_fk", this.admin)
    this.service.check_quiz_by_std_id(quizfromdata).subscribe(
      (res: any) => {
        console.log(res.data)
        this.quizscore_id = res.data[0].quizscore_id
        if (res.data[0].count == 0) {
          this.service.std_quiz_insert(quizfromdata).subscribe(
            (res: any) => {
              console.log(res)
            }
          )
        }
        else {
          const updaetdata = new FormData()
          updaetdata.append('quizscore_id', this.quizscore_id)
          updaetdata.append('correctanswer', correctanswer)
          this.service.quiz_update_by_std(updaetdata).subscribe(
            (res: any) => {
              console.log(res)
            }
          )
        }
      }
    )




  }

  option1(event: any) {
    if (this.quiz_option_a == this.questionlist[this.currentQuestion]?.quiz_answer) {
      this.backgroundColor1 = "green"
      this.color1 = "white"
      this.hidden = false
      this.score++
      this.correctanswer = 1
      this.postQuizResult(this.correctanswer)
    }
    else {
      this.backgroundColor1 = "red"
      this.color1 = "white"

      if (this.quiz_option_b == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor2 = "green"
        this.color2 = "white"
        this.correctanswer = 0
        this.postQuizResult(this.correctanswer)
        this.hidden = false
      }

      if (this.quiz_option_c == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor3 = "green"
        this.color3 = "white"
        this.hidden = false
        this.correctanswer = 0
      }

      if (this.quiz_option_d == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor4 = "green"
        this.color4 = "white"
        this.hidden = false
        this.correctanswer = 0
      }
    }
  }

  option2(event: any) {
    if (this.quiz_option_b == this.questionlist[this.currentQuestion]?.quiz_answer) {
      this.backgroundColor2 = "green"
      this.color2 = "white"
      this.hidden = false
      this.score++
      this.correctanswer = 1
      this.postQuizResult(this.correctanswer)

    }
    else {
      this.backgroundColor2 = "red"
      this.color2 = "white"
      if (this.quiz_option_a == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor1 = "green"
        this.color1 = "white"
        this.hidden = false
        this.correctanswer = 0
        this.postQuizResult(this.correctanswer)
      }

      if (this.quiz_option_c == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor3 = "green"
        this.color3 = "white"
        this.hidden = false
        this.correctanswer = 0
      }

      if (this.quiz_option_d == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor4 = "green"
        this.color4 = "white"
        this.hidden = false
        this.correctanswer = 0

      }
    }
  }

  option3(event: any) {
    if (this.quiz_option_c == this.questionlist[this.currentQuestion]?.quiz_answer) {
      this.backgroundColor3 = "green"
      this.color3 = "white"
      this.hidden = false
      this.score++
      this.correctanswer = 1
      this.postQuizResult(this.correctanswer)
    }
    else {
      this.backgroundColor3 = "red"
      this.color3 = "white"
      if (this.quiz_option_a == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor1 = "green"
        this.color1 = "white"
        this.hidden = false
        this.correctanswer = 0
        this.postQuizResult(this.correctanswer)
      }

      if (this.quiz_option_b == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor2 = "green"
        this.color2 = "white"
        this.hidden = false
        this.correctanswer = 0
      }

      if (this.quiz_option_d == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor4 = "green"
        this.color4 = "white"
        this.hidden = false
        this.correctanswer = 0

      }

    }
  }

  option4(event: any) {
    if (this.quiz_option_d == this.questionlist[this.currentQuestion]?.quiz_answer) {
      this.backgroundColor4 = "green"
      this.color4 = "white"
      this.hidden = false
      this.score++
      this.correctanswer = 1
      this.postQuizResult(this.correctanswer)
    }

    else {
      this.backgroundColor4 = "red"
      this.color4 = "white"
      if (this.quiz_option_a == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor1 = "green"
        this.color1 = "white"
        this.hidden = false
        this.correctanswer = 0
        this.postQuizResult(this.correctanswer)

      }

      if (this.quiz_option_b == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor2 = "green"
        this.color2 = "white"
        this.hidden = false
        this.correctanswer = 0

      }

      if (this.quiz_option_c == this.questionlist[this.currentQuestion]?.quiz_answer) {
        this.backgroundColor3 = "green"
        this.color3 = "white"
        this.hidden = false
        this.correctanswer = 0

      }

    }
  }




  nextQues() {
    this.currentQuestion++
    this.counter = 5
    this.backgroundColor1 = ""
    this.backgroundColor2 = ""
    this.backgroundColor3 = ""
    this.backgroundColor4 = ""
    this.color1 = ""
    this.color2 = ""
    this.color3 = ""
    this.color4 = ""
    this.hidden = true
    if (this.currentQuestion == this.count_ques) {
      this.router.navigate(['/studenthome/quizresult'], this.course_data.course_id);
    }

  }

  previewsQues() {
    this.currentQuestion--
    this.counter = 5
  }



}




