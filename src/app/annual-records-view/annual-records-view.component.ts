import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {AnnualRecordService} from "../services/annual-record.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-annual-records-view',
  templateUrl: './annual-records-view.component.html',
  styleUrls: ['./annual-records-view.component.css']
})
export class AnnualRecordsViewComponent implements OnInit {
  displayedColumns: string[] = ['year', 'state', 'category', 'item', 'amount', 'gdp', 'actions'];
  annualRecords!: any[];
  dataSource = new MatTableDataSource<AnnualRecord>(this.annualRecords);
  isEdit = false;
  editId = 0;

  annualRecordForm: FormGroup =  this.formBuilder.group({
    year: ['', {validators: [Validators.min(1900), Validators.required, Validators.pattern("^[0-9]*$"), Validators.max(2100)], updateOn: 'change'}],
    gdp: ['', {validators: [Validators.required], updateOn: 'change'}],
    amount: ['',{validators: [Validators.required], updateOn: 'change'} ],
    item: ['', {validators: [Validators.required], updateOn: 'change'}],
    category: ['', {validators: [Validators.required], updateOn: 'change'}],
    state: ['', {validators: [Validators.required], updateOn: 'change'}],
  });

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(){
    this.annualRecordService.getAllAnnualRecords().subscribe(
      data => {
        this.annualRecords = data;
        this.dataSource = new MatTableDataSource<AnnualRecord>(this.annualRecords);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(private annualRecordService: AnnualRecordService, private formBuilder: FormBuilder) {
    this.loadData()
  }

  ngOnInit(): void {
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.annualRecordForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  selectAnnualRecord(row: any){
    this.editId = row.id;
    // this.registerForm.controls['id'].setValue(row.id);
    this.annualRecordForm.controls['year'].setValue(row.year);
    this.annualRecordForm.controls['state'].setValue(row.state);
    this.annualRecordForm.controls['category'].setValue(row.category);
    this.annualRecordForm.controls['item'].setValue(row.item);
    this.annualRecordForm.controls['amount'].setValue(row.amount);
    this.annualRecordForm.controls['gdp'].setValue(row.gdp);
    this.isEdit = true;
    console.log(row);
  }

  clearForm(){

    this.annualRecordForm.controls['year'].setValue('');
    this.annualRecordForm.controls['state'].setValue('');
    this.annualRecordForm.controls['category'].setValue('');
    this.annualRecordForm.controls['item'].setValue('');
    this.annualRecordForm.controls['amount'].setValue('');
    this.annualRecordForm.controls['gdp'].setValue('');

    this.annualRecordForm.controls['year'].setErrors(null);
    this.annualRecordForm.controls['state'].setErrors(null);
    this.annualRecordForm.controls['category'].setErrors(null);
    this.annualRecordForm.controls['item'].setErrors(null);
    this.annualRecordForm.controls['amount'].setErrors(null);
    this.annualRecordForm.controls['gdp'].setErrors(null);

    this.annualRecordForm.setErrors({'invalid':true})

    // this.registerForm.controls['year'].updateValueAndValidity();
    // this.registerForm.controls['state'].updateValueAndValidity();
    // this.registerForm.controls['category'].updateValueAndValidity();
    // this.registerForm.controls['item'].updateValueAndValidity();
    // this.registerForm.controls['amount'].updateValueAndValidity();
    // this.registerForm.controls['gdp'].updateValueAndValidity();

    this.editId = 0;
    this.isEdit = false;
  }

  cancelButton(){
    // this.registerForm.controls['id'].setValue(row.id);
    this.clearForm()
  }

  saveAnnualRecord(){
    let item = {
      year: this.annualRecordForm.controls['year'].value,
      state: this.annualRecordForm.controls['state'].value,
      category: this.annualRecordForm.controls['category'].value,
      item: this.annualRecordForm.controls['item'].value,
      amount: this.annualRecordForm.controls['amount'].value,
      gdp: this.annualRecordForm.controls['gdp'].value/100
    }
    if(this.editId!=0){
      this.annualRecordService.putAnnualRecord(item, this.editId).subscribe((response:any)=>{
        window.alert("Annual Record updated successful.");
        this.loadData();
        this.clearForm();
      });
    } else {
      this.annualRecordService.postAnnualRecord(item).subscribe((response:any)=>{
        window.alert("Annual Record saved successful.");
        this.loadData();
        this.clearForm();
      });
    }

    console.log(item);
  }

  deleteAnnualRecord(id: number){
    this.annualRecordService.deleteAnnualRecord(id).subscribe(
      (response:any) =>{
        window.alert("Annual Record delete successful.");
        this.loadData();
      }
    )
  }

}

export interface AnnualRecord {
  id: number;
  year: number;
  gdp: number;
  amount: number;
  item: string;
  state: number;
  category: string;
}
