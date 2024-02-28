import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdutosRoutingModule } from './produtos-routing.module';
import { ProdutosComponent } from './produtos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddProdutosComponent } from '../add-produtos/add-produtos.component';


@NgModule({
  declarations: [
    ProdutosComponent,
    AddProdutosComponent
  ],
  imports: [
    CommonModule,
    ProdutosRoutingModule,
    ReactiveFormsModule
  ]
})
export class ProdutosModule { }
