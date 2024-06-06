import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDetail } from '../interfaces/product/product-detail';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts=():Observable<ProductDetail[]> => this.http.get<ProductDetail[]>(`http://localhost:5272/api/product/getproducts`);

  deleteProduct=(id: string)=> this.http.delete(`http://localhost:5272/api/Profile/delete/${id}`);

  createProduct=(product: ProductDetail) => this.http.post(`http://localhost:5272/api/Profile/CreateProduct`, product);

  editProduct=(product: ProductDetail) => this.http.put(`http://localhost:5272/api/Profile/edit/${product.id}`, product);

}
