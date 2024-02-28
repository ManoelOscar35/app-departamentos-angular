import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Department } from '../model/department';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private departmentEdit = new BehaviorSubject<any>({});

  constructor() { }

  setDepartmentEdit(value: Department) {
    this.departmentEdit.next(value);
  }

  getDepartmentEdit() {
    return this.departmentEdit.asObservable();
  }
}
