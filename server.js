// 📁 server.js
// Ejecuta con: node server.js

const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const votosFile = './votos.json';

function leerVotos() {
  if (!fs.existsSync(votosFile)) fs.writeFileSync(votosFile, '{}');
  return JSON.parse(fs.readFileSync(votosFile));
}

function guardarVotos(data) {
  fs.writeFileSync(votosFile, JSON.stringify(data, null, 2));
}

function estaEnWhitelist(nombre) {
  if (!fs.existsSync('./whitelist.json')) return false;
  const lista = JSON.parse(fs.readFileSync('./whitelist.json'));
  return lista.some(p => p.name.toLowerCase() === nombre.toLowerCase());
}

app.post('/guardar-voto', (req, res) => {
  const { username, candidato } = req.body;
  if (!username || !candidato) return res.json({ success: false, message: 'Faltan datos' });

  const votos = leerVotos();
  if (votos[username]) {
    return res.json({ success: false, message: '¡Ya votaste!' });
  }

  if (!estaEnWhitelist(username)) {
  return res.json({ success: false, message: 'No estás en la whitelist del servidor.' });
  } 

  votos[username] = candidato;
  guardarVotos(votos);
  res.json({ success: true, message: '¡Voto registrado!' });
});

app.get('/votos-detalle', (req, res) => {
  const votos = leerVotos();
  res.json(votos);
});

app.delete('/eliminar-voto', (req, res) => {
  const { user } = req.query;
  if (!user) return res.json({ success: false, message: "Falta el nombre del usuario" });

  const votos = leerVotos();
  if (!votos[user]) return res.json({ success: false, message: "Ese usuario no ha votado" });

  delete votos[user];
  guardarVotos(votos);
  res.json({ success: true, message: `Voto de ${user} eliminado` });
});


app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
