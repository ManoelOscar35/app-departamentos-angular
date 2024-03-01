import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Department } from 'src/app/model/department';
import { DepartmentsService } from 'src/app/services/departments.service';
import { AddDepartmentsComponent } from '../add-departments/add-departments.component';
import { EditDepartmentsComponent } from '../edit-departments/edit-departments.component';
import { StoreService } from 'src/app/shared/store.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  departments: Department[] = [];
  private subjectPesquisa: Subject<string> = new Subject<string>()

  constructor(
    private departmentsService: DepartmentsService,
    private dialog: MatDialog,
    private storeService: StoreService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getDepartments();
    this.subjectPesquisa
      .pipe(
        debounceTime(1000), //executa a ação do switchMap após 1 segundo
        distinctUntilChanged(), //preveni que ocorra duas pesquisas idênticas
        switchMap((termoDaBusca: string) => {
          if (termoDaBusca.trim() === '') {
            return this.departmentsService.data$
          }
          return this.departmentsService.pesquisaDepartamentos(termoDaBusca)
        }),
        catchError((err: any) => {
          this.utilsService.showError('Houve um erro ao recarregar o(s) departamento(s)!');
          return of<Department[]>([]);
        })
      )
      .subscribe({
        next: (departments: Department[]) => {
          console.log(departments)
          this.departments = departments
        } 
      })
      
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

  public pesquisa(termoDaBusca: string): void {
    this.subjectPesquisa.next(termoDaBusca)
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
