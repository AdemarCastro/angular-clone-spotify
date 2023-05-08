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

    return new Promise((res) => {
      const usuarioCriado = this.spotifyService.inicializarUsuario();
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
