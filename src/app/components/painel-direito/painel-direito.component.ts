import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IAlbum } from 'src/app/interfaces/IAlbum';
import { SpotifyService } from 'src/app/services/spotify.service';
import { TopArtistasComponent } from '../top-artistas/top-artistas.component';
import { IArtista } from 'src/app/interfaces/IArtista';

@Component({
  selector: 'app-painel-direito',
  templateUrl: './painel-direito.component.html',
  styleUrls: ['./painel-direito.component.scss']
})
export class PainelDireitoComponent implements OnInit{

  @ViewChild(TopArtistasComponent) topArtistasComponent: TopArtistasComponent;

  @Input()
  descricao: string;

  @Input()
  selecionado: boolean;

  @Output()
  artistaClicado = new EventEmitter<IArtista>();

  menuSelecionado = 'Home';

  albums: IAlbum[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private router: Router) { }

  ngOnInit(): void {
    this.buscarAlbums();
  }

  botaoClick(botao: string) {
    this.menuSelecionado = botao;
    this.router.navigateByUrl('player/home'); // Ao clicar em Home é encaminhado para a rota de Home
  }
  
  async buscarAlbums(){
    this.albums = await this.spotifyService.buscarAlbums();
  }

}
