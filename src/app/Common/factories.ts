import { IArtista } from "../interfaces/IArtista";
import { IMusica } from "../interfaces/IMusica";

export function newArtista(): IArtista {
    return {
        id: '',
        imagemUrl: '',
        nome: ''
    };
}

export function newMusica(): IMusica {
    return {
        id: '',
        album: {
            id: '',
            imagemUrl: '',
            nome: ''
        },
        artistas: [],
        tempo: '',
        titulo: ''
    }
}