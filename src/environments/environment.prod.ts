export const environment = { // Basicamente as variáveis de ambiente do Angular. No momento da Compilação se eu não passar nada, ele vai utilizar o "environment.ts", mas eu posso passar um parâmetro para utilizar o "environment.prod.ts"
    production: false
};

export const SpotifyConfiguration = {
    clientId: 'c25ea3a3c97749ed9658853396552cce', // Id da minha Aplicação do Spotify
    authEndpoint: 'https://accounts.spotify.com/authorize', // EndPoint que o Spotify usa para autenticar o usuário
    redirectUrl: 'https://angular-clone-spotify.vercel.app/login/', // Para onde o usuário será redirecionado após o processo de autenticação ser concluído
    scopes: [
        "user-read-currently-playing", // Musica tocando agora
        "user-read-recently-played", // Ler músicas tocadas recentemente
        "user-read-playback-state", // Ler estado do player do usuario
        "user-top-read", // Top artistas e musicas do usuario
        "user-modify-playback-state", // Alterar do player do usuario
        "user-library-read", // Ler biblioteca do usuarios
        "playlist-read-private", // Ler playlists privadas
        "playlist-read-collaborative" // Ler playlists colaborativas
    ] // Permissões concedidas pelo usuário para o acesso de determinadas informações a serem consumidas pela aplicação

}