import { Injectable } from '@angular/core';
import { SpotifyConfiguration } from 'src/environments/environment';
import { SpotifuConfiguration } from 'src/environments/environment.prod';
import Spotify from 'spotify-web-api-js';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: Spotify.SpotifyWebApiJs = null;

  constructor() { 
    this.spotifyApi = new Spotify();
   }

  obterUrlLogin() {
    const authEndpoint = `${SpotifyConfiguration.authEndpoint}?`;
    const clientId = `client_id=${SpotifyConfiguration.clientId}&`;
    const redirectUrl = `redirect_uri=${SpotifuConfiguration.redirectUrl}&`;
    const scopes = `scope=${SpotifyConfiguration.scopes.join('%20')}&`;
    const responseType = `response_type=token&show_dialog=true`;
    return authEndpoint + clientId + redirectUrl + scopes + responseType;
  }

  obterTokenUrlCallback() { // Trata o Token para ser utilizado
    if (!window.location.hash)
      return '';

    const params = window.location.hash.substring(1).split('&'); // Substring(1) pula o primeiro elemento da String - Split retorna um Array quebrando os elementos sempre utilizando como parametro o '&' 
    return params[0].split('=')[1]; // Pegue o primeiro elemento do array, Split separa o array utilizando o '=' como parametro e depois selecione o 2º elemento do array
  }

  definirAcessToken(token: string){
    this.spotifyApi.setAccessToken(token);
    localStorage.setItem('token', token); // Serve para que não seja necessário refazer o login toda vez que der um refresh na página
    this.spotifyApi.skipToNext(); // Pula para prox música
  }
}

/* 
É por isso que dizemos que um Service no Angular é um singleton - ele é criado uma única vez e compartilhado por todos os componentes que o utilizam. Isso pode ser útil para compartilhar dados e funcionalidades comuns em toda a sua aplicação, sem precisar criar novas instâncias do serviço sempre que ele for necessário.
*/
