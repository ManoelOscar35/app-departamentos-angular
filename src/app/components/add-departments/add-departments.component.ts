import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/model/department';
import { DepartmentsService } from 'src/app/services/departments.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-departments',
  templateUrl: './add-departments.component.html',
  styleUrls: ['./add-departments.component.css']
})
export class AddDepartmentsComponent implements OnInit{

  form!: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private dialogRef: DialogRef<AddDepartmentsComponent>,
    private departmentService: DepartmentsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      nome: [null, Validators.required],
      id: [null],
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
      
      this.departmentService.add(payload).subscribe({
        next: (department: Department) => {
          console.log(department)
          this.utilsService.showSuccess("Departamento criado com sucesso!");
        }, 
        error: (err: Error) => this.utilsService.showError("Houve um erro ao adicionar um Departamento!"),
        complete: () => {
          console.log("A emissão de stream de dados foi finalizada!"),
          this.dialogRef.close();
        }
      });
    }
  }

  
}
