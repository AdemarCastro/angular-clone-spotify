import { addMilliseconds, format } from "date-fns";
import { IArtista } from "../interfaces/IArtista";
import { IMusica } from "../interfaces/IMusica";
import { IPlaylist } from "../interfaces/IPlaylist";
import { IUsuario } from "../interfaces/IUsuario";

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

export function SpotifyArtistaParaArtista(spotifyArtista: SpotifyApi.ArtistObjectFull): IArtista{
    return {
        id: spotifyArtista.id,
        imagemUrl: spotifyArtista.images.sort((a,b) => a.width - b.width).pop().url,
        nome: spotifyArtista.name
    };
}

export function SpotifyTrackParaMusica(spotifyTrack: SpotifyApi.TrackObjectFull): IMusica{

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