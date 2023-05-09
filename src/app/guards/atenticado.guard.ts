import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';

@Injectable({
  providedIn: 'root'
})
export class AtenticadoGuard implements CanLoad {

  constructor(
    private router: Router, 
    private spotifyService: SpotifyService) {

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const token = localStorage.getItem('token');

    if(!token) {
      return this.naoAutenticado();
    }

    return new Promise(async (res) => {
      const usuarioCriado = await this.spotifyService.inicializarUsuario();
      if (usuarioCriado)
        res(true);
      else
        res(this.naoAutenticado());
    })

    return true;
  }

  naoAutenticado() {
    localStorage.clear();
    this.router.navigate(['/login']);
    return false;
  }
}

/* 
SOBRE O USO DE ASYNC E AWAIT

O uso do async e do await permite que o código assíncrono seja escrito de forma síncrona e sequencial. Quando uma função assíncrona é chamada e encontra a palavra-chave await, a execução da função é pausada até que a operação assíncrona que está sendo aguardada seja concluída. Isso significa que o código não avança para a próxima linha até que a operação assíncrona seja concluída, tornando a execução do código sequencial, mesmo que haja operações assíncronas acontecendo em segundo plano.

*/


