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