import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { retry } from 'rxjs';
import { Department } from 'src/app/model/department';
import { DepartmentsService } from 'src/app/services/departments.service';
import { AddDepartmentsComponent } from '../add-departments/add-departments.component';
import { EditDepartmentsComponent } from '../edit-departments/edit-departments.component';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  departments: Department[] = [];

  constructor(
    private departmentsService: DepartmentsService,
    private dialog: MatDialog,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentsService.get()
      .pipe(
        retry(10)
      )
      .subscribe({
        next: (departments: Department[]) => {
          this.departments = departments;
          console.log(this.departments)
        },
        error: (err: Error) => console.error("Houve um erro: ",err),
        complete: () => console.log("O envio da stream de dados foi finalizada!")      
    });
  }


  openDialog() {
    this.dialog.open(AddDepartmentsComponent, {
      width: '600px',
      data: {
        any: ''
      }
    });
  }

  openDialogEdit(name: string, id: number) {
    this.dialog.open(EditDepartmentsComponent, {
      width: '600px',
      data: {
        any: ''
      }
    });
    const departmentEdit = {
      name,
      id
    }
    this.storeService.setDepartmentEdit(departmentEdit)
  }
  
  delete(id: number): void {
    this.departmentsService.delete(id).subscribe({
      next: (res: any) => {
        console.log("O dado foi excluído com sucesso!")
      },
      error: (err) => console.error(err),
      complete: () => console.log("O envio da stream de dados foi finalizada!")  
    });
  }
}
