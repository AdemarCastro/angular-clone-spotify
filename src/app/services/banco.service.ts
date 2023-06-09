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
  private urlAngular = 'http://localhost:4200'

  constructor( private http: HttpClient ) { }

  getMusicasFavoritas() : Observable<any> {
    return this.http.get(`${this.urlApi}/favoritos`);
  }

  postMusicasFavoritas(musica: IMusica) : Observable<any> {
    const url = `${this.urlApi}/favoritos/add`;
    console.log(url, musica);
    return this.http.post<any>(url, musica);
  }

  getAgua() : Observable<any> {
    return this.http.get(`${this.urlApi}/agua`);
  }

  postAgua(agua: any) : Observable<any> {
    const url = "http://localhost:8080/agua/add";
    console.log(url, agua);
    return this.http.post(url, agua);
  }


}
