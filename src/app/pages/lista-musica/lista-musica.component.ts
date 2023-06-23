import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faHeart, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Observer, Subscribable, Subscription, firstValueFrom } from 'rxjs';
import { newMusica } from 'src/app/Common/factories';
import { IAlbum } from 'src/app/interfaces/IAlbum';
import { IArtista } from 'src/app/interfaces/IArtista';
import { IMusica } from 'src/app/interfaces/IMusica';
import { BancoService } from 'src/app/services/banco.service';
import { PlayerService } from 'src/app/services/player.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-lista-musica',
  templateUrl: './lista-musica.component.html',
  styleUrls: ['./lista-musica.component.scss']
})
export class ListaMusicaComponent implements OnInit, OnDestroy{

  bannerImagemUrl = '';
  bannerTexto = '';

  musicas: IMusica[] = [];
  musicaAtual: IMusica = newMusica();

  // IconePlay
  playIcone = faPlay;
  // IconeHeart
  heartIcone = faHeart;

  rotaAtual = '';

  title = '';

  isResultLoaded: boolean;
  FavoritosArray: any[] = [];

  subs: Subscription[] = [];

  constructor(
    private activedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private playerService: PlayerService,
    private bancoService: BancoService,
    private http: HttpClient
    ) {  }

  async ngOnInit(): Promise<void> {
    await this.obterMusicas();
    this.obterMusicaAtual();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  obterMusicaAtual() {
    const sub = this.playerService.musicaAtual.subscribe(musica => {
      this.musicaAtual = musica;
    });

    this.subs.push(sub);
  }

  obterMusicas() {

    const sub = this.activedRoute.paramMap
      .subscribe(async params => {
        /* console.log(params.get('tipo'));
        console.log(params.get('id')); */

        const tipo = params.get('tipo');
        const id = params.get('id');
        await this.obterDadosPagina(tipo, id);
      }); // Ao invés de recarrecar o componente o subscribe permite que o Angular escute a mudança dos parâmetros e o atualize quando necessário

      this.subs.push(sub);
  }

  async obterDadosPagina(tipo: string, id: string) {
    if(tipo === 'playlist') {
      this.rotaAtual = tipo;
      await this.obterDadosPlaylist(id);
    } else if (tipo === 'album') {
      /* const newId = await this.tratarIdAlbum(id); */
      this.rotaAtual = tipo;
      const albumId = id.match(/[^:]+$/)?.[0];
      await this.obterDadosAlbum(albumId);
    } else if (tipo === 'pesquisa') {
      this.rotaAtual = tipo;
      const pesquisa = id;
      await this.obterDadosPesquisa(pesquisa);
      /* await this.obterDados() */
    }
  }

  async obterDadosPlaylist(playlistId: string) {
    const playlistMusicas = await this.spotifyService.buscarMusicasPlaylist(playlistId);
    this.definirDadosPagina(playlistMusicas.nome, playlistMusicas.imagemUrl, playlistMusicas.musicas); // Separa as variaveis do objeto recebido em playlistMusicas
    this.title = 'Musicas Playlist: ' + playlistMusicas.nome;
    console.log(playlistMusicas.nome)
    console.log(playlistMusicas.musicas);
    console.log(playlistMusicas.imagemUrl);
  }

  async obterDadosAlbum(albumId: string) {
    const albumMusicas = await this.spotifyService.buscarMusicasAlbum(albumId);
    this.definirDadosPagina(albumMusicas.nome, albumMusicas.imagemUrl, albumMusicas.musicas);
    this.title = 'Musicas Album: ' + albumMusicas.nome;
    console.log(albumMusicas.nome)
    console.log(albumMusicas.musicas);
    console.log(albumMusicas.imagemUrl);
  }

  async obterDadosPesquisa(pesquisa: string) {
    /* console.log('Buscando...', pesquisa); */

    this.spotifyService.buscarPesquisa(pesquisa).then((musicas) => {
      console.log(musicas);

      this.definirDadosPagina(pesquisa, musicas[0].album.imagemUrl, musicas);
      this.title = 'Pesquisa: ' + pesquisa;
      
    }).catch((erro) => {
      console.log("Ocorreu um erro ao buscar a pesquisa: ", erro);
      return null;
    });

  }

  async obterDadosArtista(artistaId: string) { // Eu posso fazer isso depois, é mais fácil do que quero fazer agora,
    // apenas retornar as 50 melhores músicas do artista selecionado.

  }

  definirDadosPagina(bannerTexto: string, bannerImage: string, musicas: IMusica[]) {
    this.bannerImagemUrl = bannerImage;
    this.bannerTexto = bannerTexto;
    this.musicas = musicas;
    this.musicas.forEach(musica => this.verificarFavoritos(musica));
  }

  async executarMusica(musica: IMusica) {
    await this.spotifyService.executarMusica(musica.id);
    this.playerService.definirMusicaAtual(musica);
  }

  obterArtistas(musica: IMusica) {
    const artistas = musica.artistas?.map(artista => artista.nome);

    return artistas?.join(', ') ?? '';
  }

  obterAlbum(musica: IMusica) {
    let album = '';

    if(musica.album) {
      album = musica.album.nome;
    }

    return album;
  }

  adicionarFavorito(musica: IMusica) {

    let artistasData = musica.artistas.map((artista) => {
      return {
        "id": artista.id,
        "nome": artista.nome
      };
    });

    let bodyData = {
      "id" : musica.id,
      "titulo" : musica.titulo,
      "tempo" : musica.tempo,
      "album_id" : musica.album.id,
      "album_imagemUrl" : musica.album.imagemUrl,
      "album_nome" : musica.album.nome,
      "artistas" : artistasData
    };

    this.http.post("http://localhost:8080/favoritos/add", bodyData).subscribe((resultData : any) => {
      try {
        console.log(resultData);
        musica.estaNosFavoritos = true;
      } catch {
        console.log(resultData);
      }
    });
  }

  async verificarFavoritos(musica: IMusica){
    try {
      const response$ = await this.obterDadosDoBanco(musica);
      const estaNosFavoritos = response$.data;
      musica.estaNosFavoritos = estaNosFavoritos;
      console.log(`A música ${musica.titulo} ${estaNosFavoritos ? 'está' : 'não está'} nos favoritos.`);
    } catch (error) {
      console.log(`Erro ao verificar favorito da ${musica.titulo}!`);
    }
  }

  async obterDadosDoBanco(musica: IMusica): Promise<any> {
    const id = musica.id;
    const response$ = this.bancoService.getVerificarMusica(id);
    const response = await firstValueFrom(response$);
    return response; // retorna o valor booleano da propriedade `data`
  }

  removerFavorito(musica: IMusica) {
    const observer: Observer<any> = {
      next: response => {
        console.log(response); // Exibe a resposta completa da API
        console.log(`Música com ID ${musica.id} excluída com sucesso: ${response.body}`);
        musica.estaNosFavoritos = false;
        location.reload(); // Recarrega a página ao clicar em excluir
      },
      error: error => {
        console.log(error);
        console.error(`Erro ao excluir a música ${musica.titulo}.`);
      },
      complete: () => {
        console.log('Operação de exclusão concluída!');
      },
    };
  
    this.bancoService.deleteMusica(musica.id).subscribe(observer);
  }
}
