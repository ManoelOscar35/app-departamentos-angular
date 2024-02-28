import { Department } from "./department";

export interface Product {
    nome: string;
    price: number;
    qtde: number;
    id: number;
    departments: Department[];
}