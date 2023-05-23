import { IAlbum } from "./IAlbum";
import { IMusica } from "./IMusica";
import { IPlaylist } from "./IPlaylist";

export interface IArtista {
    id: string,
    nome: string,
    imagemUrl: string,
    playlists?: IPlaylist[],
    musicas?: IMusica[],
    albums?: IAlbum[]
}