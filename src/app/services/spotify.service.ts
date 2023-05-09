import { Injectable } from '@angular/core';
import { SpotifyConfiguration } from 'src/environments/environment';
import { SpotifuConfiguration } from 'src/environments/environment.prod';
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../interfaces/IUsuario';
import { SpotifyPlaylistParaPlaylist, SpotifyUserParaUsuario } from '../Common/spotifyHelper';
import jwt_decode, {JwtPayload } from 'jwt-decode';
import { IPlaylist } from '../interfaces/IPlaylist';

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

    if(!token || this.verificarTokenExpiration()) {
      return false;
    }
    try {

      this.definirAcessToken(token);
      await this.obterSpotifyUsuario();
      console.log(token);
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
    const dataCriacaoToken = new Date().toISOString();
    localStorage.setItem('token', token); // Serve para que não seja necessário refazer o login toda vez que der um refresh na página
    localStorage.setItem('dataCriacaoToken', dataCriacaoToken);
  }

  verificarTokenExpiration() {
    const dataCriacaoToken = localStorage.getItem('dataCriacaoToken');

    const tempoExpirado = 60 * 60 * 1000; 
    const dataAtual = new Date().getTime();
    const dataCriacaoTokenMs = new Date(dataCriacaoToken).getTime();
    const diferencaTempo = dataAtual - dataCriacaoTokenMs;

    return diferencaTempo >= tempoExpirado;
  } /* Esse método utiliza a data e hora em que o Token foi armazenado no localStorage para calcular a diferença de tempo. Sendo assim, caso a diferença seja maior ou igual ao tempo de expiração, que corresponde a 1 hora, então ele retornara um True, caso contrario irá retornar False.*/

  async buscarPlaylistUsuario(offset = 0, limit = 50): Promise<IPlaylist[]>{
    const playlists = await this.spotifyApi.getUserPlaylists(this.usuario.id, { offset, limit });
    return playlists.items.map(SpotifyPlaylistParaPlaylist)
  }

}

/* 
É por isso que dizemos que um Service no Angular é um singleton - ele é criado uma única vez e compartilhado por todos os componentes que o utilizam. Isso pode ser útil para compartilhar dados e funcionalidades comuns em toda a sua aplicação, sem precisar criar novas instâncias do serviço sempre que ele for necessário.
*/


/* Todo esse processo de criação de Guard, Coleta de Dados através da API dos Scopes do Usuário, Verificação com os métodos serve para garantir que o usuário tenha o Token e caso o tenha que seja válido e assim garanta a integridade do sistema */
