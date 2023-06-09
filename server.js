// Importando pacotes
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const server = express();
server.use(bodyparser.json());

// Habilitar o acesso CORS para a aplicação
server.use(
  cors({
    origin: "http://localhost:4200",
  })
);

// Establish the database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dbspotify",
});

db.connect(function (error) {
  if (error) {
    console.log("Ocorreu um erro com a conexão do BD");
  } else {
    console.log("Conexão bem sucedida com o BD");
  }
});

server.listen(8080, function check(error) {
  if (error) {
    console.log("Erro ao iniciar o servidor");
  } else {
    console.log("Servidor iniciado com sucesso");
  }
});

// Teste
server.post("/agua/add", (req, res) => {
  let details = {
    id: req.body.id,
    nome: req.body.nome
  };

  let sql_insere_agua = `INSERT INTO agua (id, nome) VALUES (?, ?)`;
  let sql_values_agua = [
    id = details.id,
    nome = details.nome
  ]

  db.query(sql_insere_agua, sql_values_agua, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Post agua falhou!"});
      console.log("Post agua falhou!");
    } else {
      res.send({ status: true, data: result, message: "Post agua bem sucedido!"});
      console.log("Post agua bem sucedido!");
    }
  });
});

server.get("/agua", (req, res) => {
  var sql_mostra_agua = "SELECT * FROM agua";

  db.query(sql_mostra_agua, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Get agua falhou!" });
      console.log("Get agua falhou!");
    } else {
      res.send({ status: true, agua: result, mensagem: "Get agua bem sucedido!" });
      console.log("Get agua bem sucedido!");
    }
  });
});

// Create the Records
server.post("/favoritos/add", (req, res) => {
  let details = {
    id: req.body.id,
    titulo: req.body.titulo,
    tempo: req.body.tempo,
    album_id: req.body.album_id,
    album_imagemUrl: req.body.album_imagemUrl,
    album_nome: req.body.album_nome,
    artistas: req.body.artistas
  };

  let sql_favorito = `INSERT INTO favorito (id, titulo, tempo, album_id, album_imagemUrl, album_nome) VALUES (?, ?, ?, ?, ?, ?);`;
  let values_favorito = [
    details.id,
    details.titulo,
    details.tempo,
    details.album_id,
    details.album_imagemUrl,
    details.album_nome,
  ];

  db.query(sql_favorito, values_favorito, (error, results) => {
    if (error) {
      res.send({
        status: false,
        message: "Criação da música nos favoritos falhou!",
      });
    } else {
      for (let i = 0; i < details.artistas.length; i++) {
        let artista_id = details.artistas[i].id;
        let artista_nome = details.artistas[i].nome;

        let sql_artista = `INSERT INTO artista (id, nome) VALUES (?, ?);`;
        let values_artista = [artista_id, artista_nome];

        db.query(sql_artista, values_artista, (error, results) => {
          if (error && error.code !== "ER_DUP_ENTRY") {
            res.send({ status: false, message: "Criação do artista falhou!" });
          } else {
            let sql_favorito_artista = `INSERT IGNORE INTO favorito_artista (favorito_id, artista_id) VALUES (?, ?);`;
            let values_favorito_artista = [details.id, artista_id];

            db.query(
              sql_favorito_artista,
              values_favorito_artista,
              (error, results) => {
                if (error) {
                  res.send({
                    status: false,
                    message: "Associação entre o artista e o favorito falhou!",
                  });
                }
              }
            );
          }
        });
      }

      res.send({
        status: true,
        message: "Música adicionada aos favoritos com sucesso!",
      });
    }
  });
});

// Exibe a lista de favoritos
server.get("/favoritos", (req, res) => {
  var sql =
    "SELECT f.id, f.titulo, a.id AS artista_id, a.nome AS artista_nome, f.album_id, f.album_imagemUrl, f.album_nome, f.tempo " +
    "FROM favorito f " +
    "JOIN favorito_artista fa ON f.id = fa.favorito_id " +
    "JOIN artista a ON fa.artista_id = a.id;";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Ocorreu um error ao tentar se conectar ao BD!");
    } else {
      res.send({ status: true, data: result });
      console.log("Operação realizada com sucesso!");
    }
  });
});
