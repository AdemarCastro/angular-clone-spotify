import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { RouterModule } from '@angular/router';
import { PlayerRotas } from './player.routes';
import { PainelEsquerdoComponent } from 'src/app/components/painel-esquerdo/painel-esquerdo.component';
import { BotaoMenuComponent } from 'src/app/components/botao-menu/botao-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RodapeUsuarioComponent } from 'src/app/components/rodape-usuario/rodape-usuario.component';
import { HomeComponent } from '../home/home.component';
import { TopArtistaComponent } from 'src/app/components/top-artista/top-artista.component';
import { PainelDireitoComponent } from 'src/app/components/painel-direito/painel-direito.component';
import { BuscasRecentesComponent } from 'src/app/components/buscas-recentes/buscas-recentes.component';
import { FormsModule } from '@angular/forms';
import { TopArtistasComponent } from 'src/app/components/top-artistas/top-artistas.component';
import { ArtistaItemImagemComponent } from 'src/app/components/artista-item-imagem/artista-item-imagem.component';
import { PlayerCardComponent } from 'src/app/components/player-card/player-card.component';
import { ListaMusicaComponent } from '../lista-musica/lista-musica.component';
import { BannerComponent } from 'src/app/components/banner/banner.component';
import { ListaAlbumArtistaComponent } from '../lista-album-artista/lista-album-artista.component';
import { FavoritosComponent } from '../favoritos/favoritos.component';

@NgModule({
  declarations: [
    PlayerComponent,
    PainelEsquerdoComponent,
    BotaoMenuComponent,
    RodapeUsuarioComponent,
    HomeComponent,
    TopArtistaComponent,
    PainelDireitoComponent,
    BuscasRecentesComponent,
    TopArtistasComponent,
    ArtistaItemImagemComponent,
    PlayerCardComponent,
    ListaMusicaComponent,
    ListaAlbumArtistaComponent,
    BannerComponent,
    FavoritosComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule.forChild(PlayerRotas)
  ]
})
export class PlayerModule { }

// Guardian é basicamente um protetor de rotas, impedindo do acesso quando não se está autenticado

// CanLoad enquanto não resolver tudo ele não abre o modulo
