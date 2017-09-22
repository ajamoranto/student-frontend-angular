import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'

@Component({
  selector: 'app-klass-form',
  templateUrl: './klass-form.component.html',
  styleUrls: ['./klass-form.component.css']
})
export class KlassFormComponent implements OnInit {
  
    successMessage: string;
    errorMessage: string;

    instructors: any[];
    
    klassData: object;
  
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
  
  }
