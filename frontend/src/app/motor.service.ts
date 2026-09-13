import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Motor {
  id?: number;
  codigo: string;
  modelo: string;
  fabricante_id: number;
  potencia_cv: number;
  tensao: string;
  frequencia_hz: number;
  polos: number;
  rotacao_rpm: number;
  carcaca?: string | null;
  grau_protecao?: string | null;
  preco?: number | null;
}

export interface Fabricante { id: number; nome: string; }

@Injectable({ providedIn: 'root' })
export class MotorService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(search?: string): Observable<Motor[]> {
    const url = search ? `${this.base}/motores?search=${encodeURIComponent(search)}` : `${this.base}/motores`;
    return this.http.get<Motor[]>(url);
  }
  criar(motor: Motor): Observable<Motor> {
    return this.http.post<Motor>(`${this.base}/motores`, motor);
  }
  atualizar(id: number, motor: Motor): Observable<Motor> {
    return this.http.put<Motor>(`${this.base}/motores/${id}`, motor);
  }
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/motores/${id}`);
  }
  listarFabricantes(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>(`${this.base}/fabricantes`);
  }
}
