import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buscas-recentes',
  templateUrl: './buscas-recentes.component.html',
  styleUrls: ['./buscas-recentes.component.scss']
})
export class BuscasRecentesComponent implements OnInit{

  campoPesquisa = ''

  pesquisasRecentes = [
    'Top Brasil', 'League of Legends', 'Hunter x Hunter', 'Trilha Sonora The Witcher 3'
  ]

  constructor() { }

  ngOnInit(): void {
      
  }

  definirPesquisa(pesquisa: string) {
    this.campoPesquisa = pesquisa;
  }

  buscar() {
    console.log('Buscando...', this.campoPesquisa);
  }
}
