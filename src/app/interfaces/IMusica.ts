export interface IMusica {
    id: string,
    titulo: string,
    artistas?: {
        id: string, // O id é para no futuro eu clicar no nome do artista e ser encaminhado para uma pagina de artista
        nome: string
    }[],
    album?: {
        id: string,
        nome: string,
        imagemUrl: string,
    },
    tempo?: string,
    estaNosFavoritos?: boolean;
}