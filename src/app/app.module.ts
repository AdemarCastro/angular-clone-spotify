import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRotas } from './app.routes';
import { ListaAlbumArtistaComponent } from './pages/lista-album-artista/lista-album-artista.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRotas) // Rota principal
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
