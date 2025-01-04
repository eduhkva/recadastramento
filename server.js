const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Senhas iniciais para cada guichê
const senhas = {
  "01": "001",
  "02": "002",
  "03": "003",
  "04": "004",
  "05": "005",
  "06": "006",
  "07": "007",
  "08": "008",
};

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página de auditoria
app.get('/audit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'audit.html'));
});

// Rota para a página de funcionário
app.get('/funcionario', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'funcionario.html'));
});

// Comunicação em tempo real via Socket.io
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Envia o estado atual das senhas para o cliente ao conectar
  socket.emit('update', senhas);

  // Evento para chamar a próxima senha de um guichê
  socket.on('chamar-senha', (guiche) => {
    // Aumenta o número da senha para o guichê selecionado
    const proximaSenha = (parseInt(senhas[guiche]) + 1).toString().padStart(3, '0');
    senhas[guiche] = proximaSenha;

    // Atualiza todos os clientes conectados com a nova senha
    io.emit('update', senhas);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Inicia o servidor na porta 3000
server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
