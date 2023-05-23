import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { newMusica } from 'src/app/Common/factories';
import { IAlbum } from 'src/app/interfaces/IAlbum';
import { IArtista } from 'src/app/interfaces/IArtista';
import { IMusica } from 'src/app/interfaces/IMusica';
import { PlayerService } from 'src/app/services/player.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-lista-album-artista',
  templateUrl: './lista-album-artista.component.html',
  styleUrls: ['./lista-album-artista.component.scss']
})
export class ListaAlbumArtistaComponent implements OnInit, OnDestroy{

  // A ideia desta Page é que ela seja uma transição entre o Artista, seus albums e suas músicas do album selecionado.
  // Ou seja, o usuário não irá selecionar músicas nesta página, apenas selecionar albums.

  bannerImagemUrl = ''; // Imagem do Artista
  bannerTexto = ''; // Nome do Artista

  albums: IAlbum[] = [];
  musicaAtual: IMusica = newMusica();
  playIcone = faPlay;

  title = '';

  subs: Subscription[] = [];

  constructor (
    private activedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {
    this.obterAlbums();
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

  obterAlbums() {
    const sub = this.activedRoute.paramMap
      .subscribe(async params => {
        console.log(params.get('tipo'));
        console.log(params.get('id'));

        const tipo = params.get('tipo');
        const id = params.get('id');
        await this.obterDadosPagina(tipo, id);
      }); // Ao invés de recarrecar o componente o subscribe permite que o Angular escute a mudança dos parâmetros e o atualize quando necessário

      this.subs.push(sub);
  }

  async obterDadosPagina(tipo: string, id: string) {
    if(tipo === 'artista') {
      await this.obterDadosAlbum(id);
    }
  }

  async obterDadosAlbum(artistaId: string) {
    const artistaAlbums = await this.spotifyService.buscarAlbumsArtista(artistaId);
    this.definirDadosPagina(artistaAlbums.nome, artistaAlbums.imagemUrl, artistaAlbums.albums) // Separa as variaveis do objeto recebido em playlistMusicas
    this.title = 'Albums do Artista : ' + artistaAlbums.nome;
  }

  definirDadosPagina(bannerTexto: string, bannerImage: string, albums: IAlbum[]) {
    this.bannerImagemUrl = bannerImage;
    this.bannerTexto = bannerTexto;
    this.albums = albums;
  }

  obterArtistas(album: IAlbum) {
    // return musica.artistas.map(artista => artista.nome).join(', ');
  }
}
