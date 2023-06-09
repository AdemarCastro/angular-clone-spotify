import { Injectable } from '@angular/core';
import { SpotifyConfiguration } from 'src/environments/environment';
import { SpotifuConfiguration } from 'src/environments/environment.prod';
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../interfaces/IUsuario';
import { SpotifyAlbumParaAlbum, SpotifyArtistaParaArtista, SpotifyObjectAlbumParaAlbum, SpotifyPlaylistParaPlaylist, SpotifySingleAlbumParaAlbum, SpotifySingleArtistaParaArtista, SpotifySinglePlaylistParaPlaylist, SpotifyTrackFullParaMusica, SpotifyTrackSimplifiedParaMusica, SpotifyUserParaUsuario } from '../Common/spotifyHelper';
import jwt_decode, {JwtPayload } from 'jwt-decode';
import { IPlaylist } from '../interfaces/IPlaylist';
import { Router } from '@angular/router';
import { IArtista } from '../interfaces/IArtista';
import { IMusica } from '../interfaces/IMusica';
import { IAlbum } from '../interfaces/IAlbum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: Spotify.SpotifyWebApiJs = null;
  usuario: IUsuario; // ID do usuario na interface
  artista: IArtista; // ID do artista

  constructor( private router: Router ) {
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
      return !!this.usuario; // Verifica se o usuario está preenchido

    }catch(ex){
      return false;
    }
  }

  async obterSpotifyUsuario() {
    const userInfo = await this.spotifyApi.getMe();
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

  async buscarMusicasPlaylist(playlistId: string, offset = 0, limit = 50) {
    const playlistSpotify = await this.spotifyApi.getPlaylist(playlistId);

    if (!playlistSpotify)
      return null;

    const playlist = SpotifySinglePlaylistParaPlaylist(playlistSpotify);

    const musicasSpotify = await this.spotifyApi.getPlaylistTracks(playlistId, { offset, limit });

    playlist.musicas = musicasSpotify.items.map(musica => SpotifyTrackFullParaMusica(musica.track as SpotifyApi.TrackObjectFull)); // Estou confirmando que a informação que está chegando é TrackObjectFull

    return playlist;
  }

  async buscarMusicasAlbum(albumId: string, offset = 0, limit = 50) {
    const albumSpotify = await this.spotifyApi.getAlbum(albumId);

    if (!albumSpotify)
      return null;

    const album = SpotifySingleAlbumParaAlbum(albumSpotify);

    const musicasSpotify = await this.spotifyApi.getAlbumTracks(albumId, { offset, limit });

    album.musicas = musicasSpotify.items.map(musica => SpotifyTrackSimplifiedParaMusica(musica as SpotifyApi.TrackObjectSimplified));

    return album;
  }

  async buscarAlbumsArtista(artistaId: string, offset = 0, limit = 50) {
    const artistaSpotify = await this.spotifyApi.getArtist(artistaId)

    if (!artistaSpotify)
      return null;

    const artista = SpotifySingleArtistaParaArtista(artistaSpotify);
    
    const albumsSpotify = await this.spotifyApi.getArtistAlbums(artistaId, { offset, limit });

    artista.albums = albumsSpotify.items.map(album => SpotifyObjectAlbumParaAlbum(album as SpotifyApi.AlbumObjectSimplified));

    return artista;
  }

  async buscarTopArtistas(limit = 10):Promise<IArtista[]> {
    const artistas = await this.spotifyApi.getMyTopArtists({ limit });
    return artistas.items.map(SpotifyArtistaParaArtista);
  }

  async buscarMusicas(offset = 0, limit = 50): Promise<IMusica[]>{
    const musicas = await this.spotifyApi.getMySavedTracks({ offset, limit });

    return musicas.items.map(x => SpotifyTrackFullParaMusica(x.track));
  }

  async buscarAlbums(offset = 0, limit = 50): Promise<IAlbum[]>{
    if (!this.artista) {
      return []; // Retorna um array vazio se this.artista não existe
    }
    const albums = await this.spotifyApi.getArtistAlbums(this.artista.id, {offset, limit});
    return albums.items.map(SpotifyAlbumParaAlbum);
  }

  async buscarPesquisa(campoPesquisa: string, offset = 0, limit = 50) {
    const musicas = await this.spotifyApi.searchTracks(campoPesquisa, { offset, limit });

    return musicas.tracks.items.map(x => SpotifyTrackFullParaMusica(x));
  }

  async convertParaIMusica(obj: any): Promise<IMusica> {
    return {
      id: obj.id,
      titulo: obj.titulo,
      artistas: [
        {
          id: obj.artista_id,
          nome: obj.artista_nome,
        }
      ],
      album: {
        id: obj.album_id,
        nome: obj.album_nome,
        imagemUrl: obj.album_imagemUrl,
      },
      tempo: obj.tempo
    }
  }

  async executarMusica(musicaId: string){
    if (this.spotifyApi) {
      await this.spotifyApi.queue(musicaId);
      await this.spotifyApi.skipToNext();
    } else {
      console.error('spotifyApi is not defined');
    }
  }

  async obterMusicaAtual(): Promise<IMusica> {
  const item = (await this.spotifyApi?.getMyCurrentPlayingTrack())?.item;

  if (item?.type === 'track') {
    const musica: IMusica = SpotifyTrackFullParaMusica(item);
    if (!musica.album.imagemUrl) {
      musica.album.imagemUrl = 'assets/spotify-player-card.png';
    }
    return musica;
  } else {
    const musica: IMusica = SpotifyTrackSimplifiedParaMusica(item);
    if (!musica.album.imagemUrl) {
      musica.album.imagemUrl = 'assets/spotify-player-card.png';
    }
    return musica;
  }
}

  async voltarMusica() {
    await this.spotifyApi.skipToPrevious();
  }

  async proximaMusica() {
    await this.spotifyApi.skipToNext();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

/*
É por isso que dizemos que um Service no Angular é um singleton - ele é criado uma única vez e compartilhado por todos os componentes que o utilizam. Isso pode ser útil para compartilhar dados e funcionalidades comuns em toda a sua aplicação, sem precisar criar novas instâncias do serviço sempre que ele for necessário.
*/


/* Todo esse processo de criação de Guard, Coleta de Dados através da API dos Scopes do Usuário, Verificação com os métodos serve para garantir que o usuário tenha o Token e caso o tenha que seja válido e assim garanta a integridade do sistema */
