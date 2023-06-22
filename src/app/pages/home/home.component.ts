import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { faPlay, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Observable, Observer, Subscription, firstValueFrom, forkJoin, map, tap } from 'rxjs';
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
  // IconeHeart
  heartIcone = faHeart;

  estaNosFavoritos: Boolean = false;
  
  musicas: IMusica[] = [];
  musicaAtual: IMusica = newMusica();

  subs: Subscription[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private playerService: PlayerService,
    private http: HttpClient,
    private bancoService: BancoService
  ) { }
  
  async ngOnInit(): Promise<void> {
    await this.obterMusicas();
    this.obterMusicaAtual();
    this.musicas.forEach(musica => this.verificarFavoritos(musica));
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
      console.log(resultData);
      alert("Música Registrada com Sucesso!");
    });
  }

  async verificarFavoritos(musica: IMusica){
    try {
      const response$ = await this.obterDadosDoBanco(musica);
      const estaNosFavoritos = response$.data;
      musica.estaNosFavoritos = estaNosFavoritos;
      /* console.log(`A música ${musica.titulo} ${this.estaNosFavoritos ? 'está' : 'não está'} nos favoritos.`); */
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
        console.log(`Música com ID ${musica.id} excluída com sucesso.`);
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

/* Porque eu fiz dessa forma? É simples, a API do Spotify não permite pendurarmos a nossa aplicação para recebermos as alterações em tempo real, então precisamos ficar consultando para sempre termos a informação atual. */

/* Ao se inscrever no Musica Atual, ao mudar a música o Angular irá avisar a todos os componentes inscritos. Dessa forma, consigo me comunicar com diversos componentes. */

/* IMPORTANTE: Ao pensar na ideia de Subscribe é preciso lembrar que preciso realizar a Desinscrição em algum momento, pois caso contrario, o app pode armezar múltiplas inscrições e isso pode acosionar pilhamento de inscrições e assim ocasionar um congestionamento (Memory Leak) -> Aloca memória para um determinado processo e não a libera. */