import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {AnnualRecordService} from "../services/annual-record.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-annual-records-view',
  templateUrl: './annual-records-view.component.html',
  styleUrls: ['./annual-records-view.component.css']
})
export class AnnualRecordsViewComponent implements OnInit {
  displayedColumns: string[] = ['year', 'state', 'category', 'item', 'amount', 'gdp', 'actions'];
  annualRecords!: any[];
  dataSource = new MatTableDataSource<AnnualRecord>(this.annualRecords);
  clickedRows = new Set<any>();
  isEdit = false;
  editId = 0;

  registerForm: FormGroup =  this.formBuilder.group({
    year: ['', {validators: [Validators.min(1900), Validators.required, Validators.pattern("^[0-9]*$"), Validators.max(2100)], updateOn: 'change'}],
    gdp: ['', {validators: [Validators.required], updateOn: 'change'}],
    amount: ['',{validators: [Validators.required], updateOn: 'change'} ],
    item: ['', {validators: [Validators.required], updateOn: 'change'}],
    category: ['', {validators: [Validators.required], updateOn: 'change'}],
    state: ['', {validators: [Validators.required], updateOn: 'change'}],
  });

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData(){
    this.annualRecordService.getAllAnnualRecords().subscribe(
      data => {
        this.annualRecords = data;
        this.dataSource = new MatTableDataSource<AnnualRecord>(this.annualRecords);
      }
    )
  }

  constructor(private annualRecordService: AnnualRecordService, private formBuilder: FormBuilder) {
    this.loadData()
  }

  ngOnInit(): void {
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.registerForm.controls;
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
    this.registerForm.controls['year'].setValue(row.year);
    this.registerForm.controls['state'].setValue(row.state);
    this.registerForm.controls['category'].setValue(row.category);
    this.registerForm.controls['item'].setValue(row.item);
    this.registerForm.controls['amount'].setValue(row.amount);
    this.registerForm.controls['gdp'].setValue(row.gdp);
    this.isEdit = true;
    console.log(row);
  }

  clearForm(){
    this.registerForm.controls['year'].setValue('');
    this.registerForm.controls['state'].setValue('');
    this.registerForm.controls['category'].setValue('');
    this.registerForm.controls['item'].setValue('');
    this.registerForm.controls['amount'].setValue('');
    this.registerForm.controls['gdp'].setValue('');
    this.editId = 0;
  }

  cancelButton(){
    // this.registerForm.controls['id'].setValue(row.id);
    this.clearForm()
    this.isEdit = false;
  }

  saveAnnualRecord(){
    let item = {
      year: this.registerForm.controls['year'].value,
      state: this.registerForm.controls['state'].value,
      category: this.registerForm.controls['category'].value,
      item: this.registerForm.controls['item'].value,
      amount: this.registerForm.controls['amount'].value,
      gdp: this.registerForm.controls['gdp'].value
    }
    console.log("Errores")
    console.log(this.findInvalidControls())
    if(this.editId!=0){
      this.annualRecordService.putAnnualRecord(item, this.editId).subscribe((response:any)=>{
        window.alert("Annual Record saved successful.");
        this.loadData();
        this.clearForm();
      });
    } else {
      this.annualRecordService.postAnnualRecord(item).subscribe((response:any)=>{
        window.alert("Annual Record updated successful.");
        this.loadData();
        this.clearForm();
      });
    }

    console.log(item);
  }

  deleteAnnualRecord(){

  }

}

export interface AnnualRecord {
  id: number;
  year: string;
  gdp: number;
  amount: number;
  item: string;
  state: number;
  category: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
//   {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
//   {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
//   {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
//   {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
//   {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
//   {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
//   {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
//   {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
//   {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
// ];
