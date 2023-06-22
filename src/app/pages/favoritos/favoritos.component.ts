import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faHeart, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Observable, Observer, Subscription, firstValueFrom, forkJoin, map, switchMap, tap } from 'rxjs';
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
  // IconeHeart
  heartIcone = faHeart;
  
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
    const musicas = await firstValueFrom(
      this.obterDadosGetDoBanco().pipe(
        map((dados: any[]) => dados.map((obj: any) => this.spotifyService.convertParaIMusica(obj))),
        switchMap((promessas: Promise<IMusica>[]) => forkJoin(promessas)),
        tap((musicas: IMusica[]) => {
          const favorito$ = musicas.map(musica => this.obterDadosDoBanco(musica));
          forkJoin(favorito$).subscribe((resultados: any[]) => {
            resultados.forEach((resultado, index) => {
              musicas[index].estaNosFavoritos = resultado.data;
            });
          });
        })
      )
    )

    this.musicas = musicas;
  }
  
  obterDadosGetDoBanco(): Observable<any[]> {
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
