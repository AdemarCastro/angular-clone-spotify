import { addMilliseconds, format } from "date-fns";
import { IArtista } from "../interfaces/IArtista";
import { IMusica } from "../interfaces/IMusica";
import { IPlaylist } from "../interfaces/IPlaylist";
import { IUsuario } from "../interfaces/IUsuario";
import { newAlbum, newArtista, newMusica, newPlaylist } from "./factories";
import { IAlbum } from "../interfaces/IAlbum";

export function SpotifyUserParaUsuario(user: SpotifyApi.CurrentUsersProfileResponse): IUsuario{
    return {
        id: user.id,
        nome: user.display_name,
        imagemUrl: user.images.pop().url
    }
}

export function SpotifyPlaylistParaPlaylist(playlist: SpotifyApi.PlaylistObjectSimplified): IPlaylist{
    return {
        id: playlist.id,
        nome: playlist.name,
        imagemUrl: playlist.images.pop().url // O pop serve para que eu pegue o primeiro item, pois a primeira imagem costuma ter a melhor resolução
        
    } /* A ideia de mapear o objeto do spotify para um objeto do nosso projeto é para que sejamos menos dependente do Spotify e assim ao haver alguma mudança no projeto deles ou na API isso não acabe dando pal no nosso projeto */
}

export function SpotifyAlbumParaAlbum(album: SpotifyApi.AlbumObjectSimplified): IAlbum{
    return {
        id: album.id,
        nome: album.name,
        imagemUrl: album.images.pop().url
    }
}

export function SpotifySingleArtistaParaArtista(artista: SpotifyApi.SingleArtistResponse) {
    if (!artista) {
        return newArtista();
    }

    return {
        id: artista.id,
        nome: artista.name,
        imagemUrl: artista.images.shift().url,
        albums: []
    }
} // Aqui estou apenas convertendo os dados a playlist para minhas próprias variaveis

export function SpotifySinglePlaylistParaPlaylist(playlist: SpotifyApi.SinglePlaylistResponse) {
    if (!playlist) {
        return newPlaylist();
    }

    return {
        id: playlist.id,
        nome: playlist.name,
        imagemUrl: playlist.images.shift().url,
        musicas: []
    }
} // Aqui estou apenas convertendo os dados a playlist para minhas próprias variaveis

export function SpotifyArtistaParaArtista(spotifyArtista: SpotifyApi.ArtistObjectFull): IArtista{
    return {
        id: spotifyArtista.id,
        imagemUrl: spotifyArtista.images.sort((a,b) => a.width - b.width).pop().url,
        nome: spotifyArtista.name
    };
}

export function SpotifyTrackParaMusica(spotifyTrack: SpotifyApi.TrackObjectFull): IMusica{

    if (!spotifyTrack) {
        return newMusica();
    }

    const msParaMinutos = (ms: number) => {
        const data = addMilliseconds(new Date(0), ms);
        return format(data, 'mm:ss');
    }

    return {
        id: spotifyTrack.uri,
        titulo: spotifyTrack.name,
        album: {
            id: spotifyTrack.id,
            imagemUrl: spotifyTrack.album.images.shift().url,
            nome: spotifyTrack.album.name
        },
        artistas: spotifyTrack.artists.map(artista => ({
            id: artista.id,
            nome: artista.name
        })),
        tempo: msParaMinutos(spotifyTrack.duration_ms) // Para manipular tempo é interessante baixar o "npm i date-fns"
    }
}

export function SpotifyObjectAlbumParaAlbum(spotifyAlbum: SpotifyApi.AlbumObjectSimplified): IAlbum{

    if (!spotifyAlbum) {
        return newAlbum();
    }

    return {
        id: spotifyAlbum.uri,
        nome: spotifyAlbum.name,
        imagemUrl: spotifyAlbum.images.shift().url
    }
}