import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-login', // Nome do seletor que será utilizado para instanciar o componente
  templateUrl: './login.component.html', // O arquivo HTML que será utilizado no componente
  styleUrls: ['./login.component.scss'] // O arquivo CSS que será utilizado no componente
})
export class LoginComponent implements OnInit{
  
  constructor(
    private spotifyService: SpotifyService,
    private router: Router,) { } // Abrir a página de login

  ngOnInit(): void {
    this.verificarTokenUrlCallback();
  }

  verificarTokenUrlCallback() {
    const token = this.spotifyService.obterTokenUrlCallback();
    if(!!token) {
      this.spotifyService.definirAcessToken(token);
      this.router.navigate(['/player/home']);
    }
  } 

  abrirPaginaLogin() {
    window.location.href = this.spotifyService.obterUrlLogin();
  }
}
