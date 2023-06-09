import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { newMusica } from 'src/app/Common/factories';
import { IMusica } from 'src/app/interfaces/IMusica';
import { BancoService } from 'src/app/services/banco.service';
import { PlayerService } from 'src/app/services/player.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy{

  // IconePlay
  playIcone = faPlay;
  
  musicas: IMusica[] = [];
  musicaAtual: IMusica = newMusica();

  subs: Subscription[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private playerService: PlayerService,
    private bancoService: BancoService,
    private http: HttpClient
  ) { }
  
  ngOnInit(): void {
    this.obterMusicas();
    this.obterMusicaAtual();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
  
  async obterMusicas() {
    this.musicas = await this.spotifyService.buscarMusicas();
  }

  obterMusicaAtual() {
    const sub = this.playerService.musicaAtual.subscribe(musica => {
      this.musicaAtual = musica; // Garante que sempre teremos a música atual
      console.log('Musica Atual: ', this.musicaAtual);

      /* Porque eu fiz dessa forma? É simples, a API do Spotify não permite pendurarmos a nossa aplicação para recebermos as alterações em tempo real, então precisamos ficar consultando para sempre termos a informação atual. */

    }); /* Ao se inscrever no Musica Atual, ao mudar a música o Angular irá avisar a todos os componentes inscritos. Dessa forma, consigo me comunicar com diversos componentes. */

    this.subs.push(sub);

  } /* IMPORTANTE: Ao pensar na ideia de Subscribe é preciso lembrar que preciso realizar a Desinscrição em algum momento, pois caso contrario, o app pode armezar múltiplas inscrições e isso pode acosionar pilhamento de inscrições e assim ocasionar um congestionamento (Memory Leak) -> Aloca memória para um determinado processo e não a libera. */


  obterArtistas(musica: IMusica) {
    return musica.artistas.map(artista => artista.nome).join(', ');
  }

  async executarMusica(musica: IMusica) {
    await this.spotifyService.executarMusica(musica.id);
    this.playerService.definirMusicaAtual(musica);
    this.adicionarNoBanco(musica);
  }

  adicionarNoBanco(musica: IMusica) {

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
      console.log(resultData);
      alert("Música Registrada com Sucesso!");
    });
  }
}
