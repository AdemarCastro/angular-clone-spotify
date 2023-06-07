import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMusica } from 'src/app/interfaces/IMusica';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-buscas-recentes',
  templateUrl: './buscas-recentes.component.html',
  styleUrls: ['./buscas-recentes.component.scss']
})
export class BuscasRecentesComponent implements OnInit{

  campoPesquisa = '';

  pesquisarMusicas: IMusica[] = [];

  pesquisasRecentes = [
    'Top Brasil', 'League of Legends', 'Hunter x Hunter', 'Trilha Sonora The Witcher 3'
  ]

  constructor(
    private spotifyService: SpotifyService,
    private router: Router) { }

  ngOnInit(): void {
      
  }

  definirPesquisa(pesquisa: string) {
    this.campoPesquisa = pesquisa;
  }

  buscar() {
    this.router.navigateByUrl(`player/lista/pesquisa/${this.campoPesquisa}`);
  }
}
