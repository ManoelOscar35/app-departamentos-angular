import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, retry, tap } from 'rxjs';
import { Department } from '../model/department';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  readonly url = 'http://localhost:3000/departments';

  private departmentsSubjects$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>([]);
  data$: Observable<any[]> = this.departmentsSubjects$.asObservable();
  private loaded: boolean = false;

  constructor(private http: HttpClient) { }

  get(): void {
    if(!this.loaded) {
      this.http.get<Department[]>( `${this.url}`)
        .pipe(
          retry(10),
          tap((departments) => console.log(departments))
        )
        .subscribe({
          next: (data: any) => this.departmentsSubjects$.next(data)
        })
        this.loaded = true;
    }
  
  }

  add(department: Department): Observable<Department> {
    return this.http.post<Department>(this.url, department)
      .pipe(
        retry(10),
        (tap((department: Department) => {
          this.departmentsSubjects$.getValue().push(department),
          console.log(this.departmentsSubjects$.getValue())
        }))
      );
  }

  edit(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.url}/${department.id}`, department)
      .pipe(
        retry(10),
        tap((d) => {
          let departments = this.departmentsSubjects$.getValue();
          let i = departments.findIndex(d => d.id === department.id);
          if( i >= 0)
            departments[i].name = d.name;
        })
      )
  }

  delete(id: any): Observable<any> {
    return this.http.delete<Department>(`${this.url}/${id}`)
    .pipe(
      retry(10),
      tap(() => {
        let departments = this.departmentsSubjects$.getValue();
        let i = departments.findIndex(d => d.id === id);
        if( i >= 0)
          departments.splice(i, 1);
      })
    )
  }

  public pesquisaDepartamentos(termo: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.url}?name_like=${termo}`)
    .pipe(
      retry(10) //numero de tentativas que vai conectar com o servidor
    )
}
}
