import { Component, OnInit,Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { DataService } from '../data.service'
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component'

@Component({
  selector: 'app-student-class',
  templateUrl: './student-class.component.html',
  styleUrls: ['./student-class.component.css']
})
export class StudentClassComponent implements OnInit {
  
    errorMessage: string;
    successMessage: string;
    studentClasses: any[];
    mode = 'Observable';
   
    constructor (private dataService: DataService, public dialog: MdDialog) {}
   
    ngOnInit() { this.getStudentClasses(); }
   
    getStudentClasses() {
      this.dataService.getRecords("studentClass")
        .subscribe(
          studentClasses => this.studentClasses = studentClasses,
          error =>  this.errorMessage = <any>error);
    }
  
    deleteStudentClasses(id:number) {
  
      let dialogRef = this.dialog.open(DeleteConfirmComponent);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.dataService.deleteRecord("studentClass", id)
            .subscribe(
              studentClass => {this.successMessage = "Record(s) deleted succesfully"; this.getStudentClasses(); },
              error =>  this.errorMessage = <any>error);
        }
      });
    }
  
  }
