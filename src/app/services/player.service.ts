import { Injectable } from '@angular/core';
import { newMusica } from '../Common/factories';
import { IMusica } from '../interfaces/IMusica';
import { BehaviorSubject, Subject } from 'rxjs';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  musicaAtual = new BehaviorSubject<IMusica>(newMusica()); // Subject é basicamente um objeto que você consegue se inscrever nesse objeto e toda alteração que acontece ele comunica para todos os componentes que está conectado. A diferença do Subject para o BehaviorSubject é que o último pode ser inicializado.
  timerId: any = null;

  constructor(private spotifyService: SpotifyService) {
    this.obterMusicaAtual();
  }

  async obterMusicaAtual() {
    // Limpa o cash ao TimerId ser lido
    clearTimeout(this.timerId);

    // Obtenho a música
    const musica = await this.spotifyService.obterMusicaAtual();
    this.musicaAtual.next(musica);

    // Causo loop a cada 3s
    this.timerId = setInterval(async () => {
      await this.obterMusicaAtual();
    }, 2000)
  }

  definirMusicaAtual(musica: IMusica) {
    this.musicaAtual.next(musica);
  }

  async voltarMusica() {
    this.spotifyService.voltarMusica();
  }

  async proximaMusica() {
    this.spotifyService.proximaMusica();
  }
}
