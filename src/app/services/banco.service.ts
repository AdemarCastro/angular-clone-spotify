import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMusica } from '../interfaces/IMusica';

// GET - BUSCA TODOS OS REGISTROS
// GET/:ID - BUSCA POR ID
// PUT - ATUALIZA UM REGISTRO EXISTENTE
// POST - INSERE NOVO REGISTRO
// DELETE - APAGA UM REGISTRO EXISTENTE

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private urlApi = 'http://localhost:8080'

  constructor( private http: HttpClient ) { }

  getMusicasFavoritas() : Observable<any> {
    return this.http.get(`${this.urlApi}/favoritos`);
  }

  getVerificarMusica(id : String) : Observable<any> {
    return this.http.get(`${this.urlApi}/verificar-favorito/${id}`);
  }

  deleteMusica(id: String) : Observable<any> {
    return this.http.delete(`${this.urlApi}/deletar-musica/${id}`);
  }
}
