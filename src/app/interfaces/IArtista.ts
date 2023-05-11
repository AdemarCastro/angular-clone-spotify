import { IMusica } from "./IMusica";

export interface IArtista {
    id: string,
    nome: string,
    imagemUrl: string,
    musicas?: IMusica[] // Interrogação significa que eu gero se quiser, ou seja, é opcional
}