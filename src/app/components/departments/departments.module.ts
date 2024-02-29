import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { DepartmentsComponent } from './departments.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddDepartmentsComponent } from '../add-departments/add-departments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditDepartmentsComponent } from '../edit-departments/edit-departments.component';


@NgModule({
  declarations: [
    DepartmentsComponent, 
    AddDepartmentsComponent,
    EditDepartmentsComponent
  ],
  imports: [
    CommonModule,
    DepartmentsRoutingModule,
    MatDialogModule,
    ReactiveFormsModule
  ]
})
export class DepartmentsModule { }
