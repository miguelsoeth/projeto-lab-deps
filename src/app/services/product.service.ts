import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetail } from '../interfaces/product/product-detail';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllProducts=():Observable<ProductDetail[]> => this.http.get<ProductDetail[]>(`${this.apiUrl}product/getproducts`);

  deleteProduct=(id: string)=> this.http.delete(`${this.apiUrl}Profile/delete/${id}`);

  createProduct=(product: ProductDetail) => this.http.post(`${this.apiUrl}Profile/CreateProduct`, product);

  editProduct=(product: ProductDetail) => this.http.put(`${this.apiUrl}Profile/edit/${product.id}`, product);

}
