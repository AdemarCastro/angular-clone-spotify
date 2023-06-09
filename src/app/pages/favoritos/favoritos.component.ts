import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, forkJoin, map, switchMap } from 'rxjs';
import { newMusica } from 'src/app/Common/factories';
import { IMusica } from 'src/app/interfaces/IMusica';
import { BancoService } from 'src/app/services/banco.service';
import { PlayerService } from 'src/app/services/player.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit, OnDestroy{

   // IconePlay
  playIcone = faPlay;
  
  musicas: IMusica[] = [];
  musicaAtual: IMusica = newMusica();

  subs: Subscription[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private playerService: PlayerService,
    private bancoService: BancoService
  ) { }
  
  ngOnInit(): void {
    this.obterMusicas();
    this.obterMusicaAtual();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
  
  async obterMusicas() {
    this.obterDadosDoBanco().pipe(
      map((dados: any[]) => dados.map((obj: any) => this.spotifyService.convertParaIMusica(obj))),
      switchMap((promessas: Promise<IMusica>[]) => forkJoin(promessas))
    ).subscribe((musicas: IMusica[]) => {
      this.musicas = musicas;
    });
  }
  
  obterDadosDoBanco(): Observable<any[]> {
    return this.bancoService.getMusicasFavoritas().pipe(
      map((resultData: any) => resultData.data)
    );
  }

  obterMusicaAtual() {
    const sub = this.playerService.musicaAtual.subscribe(musica => {
      this.musicaAtual = musica; // Garante que sempre teremos a música atual
      console.log('Musica Atual: ', this.musicaAtual);
    });

    this.subs.push(sub);

  }

  obterArtistas(musica: IMusica) {
    return musica.artistas.map(artista => artista.nome).join(', ');
  }

  async executarMusica(musica: IMusica) {
    await this.spotifyService.executarMusica(musica.id);
    this.playerService.definirMusicaAtual(musica);
  }
}
