import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';
import { fadeInAnimation } from '../animations/fade-in.animation';

import { DataService } from '../data.service'

@Component({
  selector: 'app-klass-form',
  templateUrl: './klass-form.component.html',
  styleUrls: ['./klass-form.component.css'],
  animations: [fadeInAnimation]
})
export class KlassFormComponent implements OnInit {
  
    successMessage: string;
    errorMessage: string;

    instructors: any[];
    
    klassData: object;

    classForm: NgForm;
    @ViewChild('classForm') currentForm: NgForm;
  
    getRecordForEdit(){
      this.route.params
        .switchMap((params: Params) => this.dataService.getRecord("class", +params['id']))
        .subscribe(klass => this.klassData = klass);
    }

    getInstructors() {
      this.dataService.getRecords("instructor")
        .subscribe(
          instructors => this.instructors = instructors,
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
        this.getInstructors();
    }
  
    saveClass(klass: NgForm){
      if(typeof klass.value.class_id === "number"){
        this.dataService.editRecord("class", klass.value, klass.value.class_id)
            .subscribe(
              klass => this.successMessage = "Record updated succesfully",
              error =>  this.errorMessage = <any>error);
      }else{
        this.dataService.addRecord("class", klass.value)
            .subscribe(
              klass => this.successMessage = "Record added succesfully",
              error =>  this.errorMessage = <any>error);
              this.klassData = {};
      }
  
    }

    ngAfterViewChecked() {
      this.formChanged();
    }
  
    formChanged() {
      this.classForm = this.currentForm;
      this.classForm.valueChanges
        .subscribe(
          data => this.onValueChanged(data)
        );
    }
  
    onValueChanged(data?: any) {
      let form = this.classForm.form;
  
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
      'subject': '',
      'course': ''
    };
  
    validationMessages = {
      'subject': {
        'required': 'Subject is required.',
        'minlength': 'Subject must be at least 2 characters long.',
        'maxlength': 'Subject cannot be more than 30 characters long.'
      },
      'course': {
        'required': 'Course is required.',
        'pattern': 'Course number must be 3 digits'
      }
    };
  
  
  }
