import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/model/department';
import { DepartmentsService } from 'src/app/services/departments.service';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-edit-departments',
  templateUrl: './edit-departments.component.html',
  styleUrls: ['./edit-departments.component.css']
})
export class EditDepartmentsComponent {

  
  form!: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private dialogRef: DialogRef<EditDepartmentsComponent>,
    private departmentService: DepartmentsService,
    private storeService: StoreService
    
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.storeService.getDepartmentEdit().subscribe({
      next: (departmentEdit: Department) => {
        this.form = this.fb.group({
          nome: [departmentEdit.name, Validators.required],
          id: [departmentEdit.id],
        });
      }
    });
  }
 

  isValidForm() {
    return this.form.valid;
  }

  getValueControl(form: FormGroup, control: string) {
    return form.controls[control].value;
  }

  submit() {
    if(this.isValidForm()) {
      let name = this.getValueControl(this.form, 'nome');
      let id = this.getValueControl(this.form, 'id');

      const payload = {
        name,
        id
      }
      
      this.departmentService.edit(payload).subscribe({
        next: (department: Department) => {
          console.log(department)
        }, 
        error: (err: Error) => console.error("Houve um erro ao adicionar um Departamento", err),
        complete: () => {
          console.log("A emissão de stream de dados foi finalizada!"),
          this.dialogRef.close();
        }
      });
    }
  }
}
