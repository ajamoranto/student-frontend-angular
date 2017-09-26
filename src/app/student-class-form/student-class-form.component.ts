import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-student-class-form',
  templateUrl: './student-class-form.component.html',
  styleUrls: ['./student-class-form.component.css']
})
export class StudentClassFormComponent implements OnInit {
  
    successMessage: string;
    errorMessage: string;
  
    studentClass;
    students: any[];
    classes: any[];

    studentClassForm: NgForm;
    @ViewChild('studentClassForm') currentForm: NgForm;
  
    getRecordForEdit(){
      this.route.params
        .switchMap((params: Params) => this.dataService.getRecord("studentClass", +params['id']))
        .subscribe(studentClass => this.studentClass = studentClass);
    }

    getStudents() {
      this.dataService.getRecords("student")
        .subscribe(
          students => this.students = students,
          error =>  this.errorMessage = <any>error);
    }

    getClasses() {
      this.dataService.getRecords("class")
        .subscribe(
          classes => this.classes = classes,
          error =>  this.errorMessage = <any>error);
    }
  
    constructor(
      private dataService: DataService,
      private route: ActivatedRoute,
      private location: Location
    ) {}
  
    ngOnInit() {
      this.route.params
        .subscribe((params: Params) => {
          (+params['id']) ? this.getRecordForEdit() : null;
        });
        this.getStudents();
        this.getClasses();
    }
  
    saveStudentClass(studentClass: NgForm){
      if(typeof studentClass.value.student_class_id === "number"){
        this.dataService.editRecord("studentClass", studentClass.value, studentClass.value.student_class_id)
            .subscribe(
              studentClass => this.successMessage = "Record updated succesfully",
              error =>  this.errorMessage = <any>error);
      }else{
        this.dataService.addRecord("studentClass", studentClass.value)
            .subscribe(
              studentClass => this.successMessage = "Record added succesfully",
              error =>  this.errorMessage = <any>error);
              this.studentClass = {};
      }
  
    }



    ngAfterViewChecked() {
      this.formChanged();
    }
  
    formChanged() {
      this.studentClassForm = this.currentForm;
      this.studentClassForm.valueChanges
        .subscribe(
          data => this.onValueChanged(data)
        );
    }
  
    onValueChanged(data?: any) {
      let form = this.studentClassForm.form;
  
      for (let field in this.formErrors) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
  
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  
    formErrors = {
      'major': '',
      'sat': ''
    };
  
    validationMessages = {
      'major': {
        'required': 'Major is required.'
      },
      'sat': {
        'required': 'SAT is required.'
      }
    };
  
  }
