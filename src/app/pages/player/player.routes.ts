import { Routes } from "@angular/router";
import { PlayerComponent } from "./player.component";
import { HomeComponent } from "../home/home.component";
import { ListaMusicaComponent } from "../lista-musica/lista-musica.component";
import { ListaAlbumArtistaComponent } from "../lista-album-artista/lista-album-artista.component";

export const PlayerRotas: Routes = [
    {
        path: '',
        component: PlayerComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'lista/:tipo/:id',
                component: ListaMusicaComponent
            },
            {
                path: 'album/:tipo/:id',
                component: ListaAlbumArtistaComponent
            }
        ]
    }
]