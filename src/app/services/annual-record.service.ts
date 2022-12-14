import { Injectable } from '@angular/core';
import {catchError, Observable, retry, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AnnualRecordService {

  private baseUrl = "api/v1/annual-records";
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http:HttpClient) {
  }

  // API Error Handling
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Default error handling
      window.alert(`An error occurred: ${error.error.message}`)
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      // Unsuccessful Response Error Code returned from Backend
      window.alert(`Backend returned code ${error.status}, body was: ${error.error}`);
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Return Observable with Error Message to Client
    return throwError('Something happened with request, please try again later');
  }

  getAllAnnualRecords(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl, this.httpOptions).pipe(
      retry(2), catchError(this.handleError)
    );
  }

  postAnnualRecord(item:any):Observable<any>{
    return this.http.post<any>(this.baseUrl,JSON.stringify(item), this.httpOptions).pipe(
      retry(2), catchError(this.handleError)
    );
  }

  putAnnualRecord(item:any, id:number):Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/${id}`,JSON.stringify(item), this.httpOptions).pipe(
      retry(2), catchError(this.handleError)
    );
  }

  deleteAnnualRecord(id:number):Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/${id}`, this.httpOptions).pipe(
      retry(2), catchError(this.handleError)
    );
  }

}
