import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Department } from 'src/app/model/department';
import { DepartmentsService } from 'src/app/services/departments.service';
import { AddDepartmentsComponent } from '../add-departments/add-departments.component';
import { EditDepartmentsComponent } from '../edit-departments/edit-departments.component';
import { StoreService } from 'src/app/shared/store.service';
import { UtilsService } from 'src/app/services/utils.service';

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
    private storeService: StoreService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this.departmentsService.get()
    this.departmentsService.data$
      .subscribe({
        next: (departments: Department[]) => {
          console.log(departments)
          this.departments = departments;
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
        this.utilsService.showSuccess('Departamento excluído com sucesso!');
      },
      error: (err) => this.utilsService.showError('Houve um Erro ao excluir o departamento!'),
      complete: () => console.log("O envio da stream de dados foi finalizada!")  
    });
  }

  
}
