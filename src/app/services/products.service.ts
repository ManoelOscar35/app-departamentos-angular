import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../model/product';
import { HttpClient } from '@angular/common/http';
import { DepartmentsService } from './departments.service';
import { Department } from '../model/department';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  readonly url = "http://localhost:3000/products";
  private productsSubjects$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  private loaded: boolean = false;

  constructor(
    private http: HttpClient,
    private departmentService: DepartmentsService
  ) {}

  add(product: Product): Observable<Product> {
    let departments = (product.departments as Department[]).map(d => d.id);
    console.log(departments);
    return this.http.post<Product>(this.url, {...product, departments})
      .pipe(
        tap(d => {
          this.productsSubjects$.getValue().push({...product, id: d.id})
        })
      )
  }
}
