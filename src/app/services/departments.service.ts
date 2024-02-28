import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, tap } from 'rxjs';
import { Department } from '../model/department';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  readonly url = 'http://localhost:3000/departments';

  private departmentsSubjects$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);
  private loaded: boolean = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Department[]> {
    if(!this.loaded) {
      this.http.get<Department[]>(this.url)
        .pipe(
          delay(0),
          tap((departments) => console.log(departments)),
        )
        .subscribe(this.departmentsSubjects$);
        this.loaded = true;
    }
    return this.departmentsSubjects$.asObservable();
  }

  add(department: Department): Observable<Department> {
    return this.http.post<Department>(this.url, department)
      .pipe(
        (tap((department: Department) => {
          this.departmentsSubjects$.getValue().push(department),
          console.log(this.departmentsSubjects$.getValue())
        }))
      );
  }

  edit(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.url}/${department.id}`, department)
      .pipe(tap((d) => {
        let departments = this.departmentsSubjects$.getValue();
        let i = departments.findIndex(d => d.id === department.id);
        if( i >= 0)
          departments[i].name = d.name;
      }))
  }

  delete(id: any): Observable<any> {
    return this.http.delete<Department>(`${this.url}/${id}`)
    .pipe(tap(() => {
      let departments = this.departmentsSubjects$.getValue();
      let i = departments.findIndex(d => d.id === id);
      if( i >= 0)
        departments.splice(i, 1);
    }))
  }
}
