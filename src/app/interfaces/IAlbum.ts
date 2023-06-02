import { IMusica } from "./IMusica";

export interface IAlbum {
    id: string,
    nome: string,
    imagemUrl: string,
    musicas?: IMusica[]
}