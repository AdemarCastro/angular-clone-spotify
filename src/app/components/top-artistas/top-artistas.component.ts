import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IArtista } from 'src/app/interfaces/IArtista';
import { SpotifyService } from 'src/app/services/spotify.service';
import { ArtistaItemImagemComponent } from '../artista-item-imagem/artista-item-imagem.component';
import { IAlbum } from 'src/app/interfaces/IAlbum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-artistas',
  templateUrl: './top-artistas.component.html',
  styleUrls: ['./top-artistas.component.scss']
})
export class TopArtistasComponent implements OnInit{

  artistas: IArtista[] = [];
  menuSelecionado = 'Home';
  albums: IAlbum[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private router: Router) { }

  ngOnInit(): void {
    this.buscarTopArtistas();
  }

  async buscarTopArtistas() {
    this.artistas = await this.spotifyService.buscarTopArtistas(5);
  }

  botaoClick(botao: string) {
    this.menuSelecionado = botao;
    this.router.navigateByUrl('player/home'); // Ao clicar em Home é encaminhado para a rota de Home
  }

  irParaArtista(artistaId: string) {
    this.menuSelecionado = artistaId;
    this.router.navigateByUrl(`player/album/artista/${artistaId}`);
    console.log(artistaId);
  }

  async buscarAlbums(){
    this.albums = await this.spotifyService.buscarAlbums();
  }
}