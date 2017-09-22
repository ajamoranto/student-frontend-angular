import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-major-class-form',
  templateUrl: './major-class-form.component.html',
  styleUrls: ['./major-class-form.component.css']
})
export class MajorClassFormComponent implements OnInit {
  
    successMessage: string;
    errorMessage: string;
  
    majorClass;
    classes: any[];
    majors: any[];
  
    getRecordForEdit(){
      this.route.params
        .switchMap((params: Params) => this.dataService.getRecord("majorClass", +params['id']))
        .subscribe(majorClass => this.majorClass = majorClass);
    }

    getClasses() {
      this.dataService.getRecords("class")
        .subscribe(
          classes => this.classes = classes,
          error =>  this.errorMessage = <any>error);
    }

    getMajors() {
      this.dataService.getRecords("major")
        .subscribe(
          majors => this.majors = majors,
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
        this.getClasses();
        this.getMajors();
    }
  
    saveMajorClass(majorClass: NgForm){
      if(typeof majorClass.value.major_class_id === "number"){
        this.dataService.editRecord("majorClass", majorClass.value, majorClass.value.major_class_id)
            .subscribe(
              majorClass => this.successMessage = "Record updated succesfully",
              error =>  this.errorMessage = <any>error);
      }else{
        this.dataService.addRecord("majorClass", majorClass.value)
            .subscribe(
              majorClass => this.successMessage = "Record added succesfully",
              error =>  this.errorMessage = <any>error);
              this.majorClass = {};
      }
  
    }
  
  }
