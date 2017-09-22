import { Component, OnInit,Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { DataService } from '../data.service'
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component'

@Component({
  selector: 'app-major-class',
  templateUrl: './major-class.component.html',
  styleUrls: ['./major-class.component.css']
})
export class MajorClassComponent implements OnInit {
  
    errorMessage: string;
    successMessage: string;
    majorClasses: any[];
    mode = 'Observable';
   
    constructor (private dataService: DataService, public dialog: MdDialog) {}
   
    ngOnInit() { this.getMajorClasses(); }
   
    getMajorClasses() {
      this.dataService.getRecords("majorClass")
        .subscribe(
          majorClasses => this.majorClasses = majorClasses,
          error =>  this.errorMessage = <any>error);
    }
  
    deleteMajorClasses(id:number) {
  
      let dialogRef = this.dialog.open(DeleteConfirmComponent);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.dataService.deleteRecord("majorClass", id)
            .subscribe(
              majorClass => {this.successMessage = "Record(s) deleted succesfully"; this.getMajorClasses(); },
              error =>  this.errorMessage = <any>error);
        }
      });
    }
  
  }
