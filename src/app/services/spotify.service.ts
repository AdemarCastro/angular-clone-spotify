import { Injectable } from '@angular/core';
import { SpotifyConfiguration } from 'src/environments/environment';
import { SpotifuConfiguration } from 'src/environments/environment.prod';
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../interfaces/IUsuario';
import { SpotifyUserParaUsuario } from '../Common/spotifyHelper';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: Spotify.SpotifyWebApiJs = null;
  usuario: IUsuario; // ID do usuario na interface

  constructor() { 
    this.spotifyApi = new Spotify();
  }

  async inicializarUsuario() {
    if(!!this.usuario)
      return true;
    
    const token = localStorage.getItem('token');

    if(!token)
      return false;
    
    try {

      this.definirAcessToken(token);
      await this.obterSpotifyUsuario();
      return !!this.usuario; // Verifica se o usuario está preenchido

    }catch(ex){
      return false;
    }
  }

  async obterSpotifyUsuario() {
    const userInfo = await this.spotifyApi.getMe();
    console.log(userInfo);
    this.usuario = SpotifyUserParaUsuario(userInfo);
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
  }
}

/* 
É por isso que dizemos que um Service no Angular é um singleton - ele é criado uma única vez e compartilhado por todos os componentes que o utilizam. Isso pode ser útil para compartilhar dados e funcionalidades comuns em toda a sua aplicação, sem precisar criar novas instâncias do serviço sempre que ele for necessário.
*/


/* Todo esse processo de criação de Guard, Coleta de Dados através da API dos Scopes do Usuário, Verificação com os métodos serve para garantir que o usuário tenha o Token e caso o tenha que seja válido e assim garanta a integridade do sistema */
