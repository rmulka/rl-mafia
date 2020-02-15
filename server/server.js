const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

const lobbies = {};
const lobbyPlayerIds = {};
const playerToLobbyMap = {};
const playerInfoMap = {};

const shuffleArray = array => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};

io.on('connection', socket => {
	let userId;

	// New Client Connected
	console.log('New client connected');

	// Client requested state
	socket.on('state-request', () =>
		socket.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap })
	);

	// Get client id
	socket.on('current-player', (id, info) => {
		userId = id;
		playerToLobbyMap[userId] = null;
		playerInfoMap[userId] = info;
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	});

	// Client created new lobby
	socket.on('new-lobby', (lobbyId, lobby) => {
		lobbies[lobbyId] = lobby;
		lobbyPlayerIds[lobbyId] = [lobby.creatorId];
		playerToLobbyMap[userId] = lobbyId;
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
		socket.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	});

	// Client joined a lobby
	socket.on('joined-lobby', (lobbyId, playerId) => {
		lobbies[lobbyId].players += 1;
		lobbyPlayerIds[lobbyId].push(playerId);
		playerToLobbyMap[userId] = lobbyId;
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
		socket.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	});

	// Client left a lobby
	socket.on('left-lobby', (lobbyId, playerId) => {
		lobbies[lobbyId].players -= 1;
		if (lobbies[lobbyId].players === 0 || playerId === lobbies[lobbyId].creatorId) {
			delete lobbies[lobbyId];
			socket.broadcast.emit('lobby-destroyed', lobbyId);
		}
		lobbyPlayerIds[lobbyId] = lobbyPlayerIds[lobbyId].filter(id => playerId !== id);
		playerToLobbyMap[userId] = null;
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
		socket.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	});

	// Client started game
	socket.on('started-game', (lobbyId, numMafia) => {
		const randomMafia = {};
		const playerLen = lobbyPlayerIds[lobbyId].length;
		lobbies[lobbyId].inProgress = true;
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
		const mafiaPlayers = new Array(playerLen).fill(false);
		for (let i = 0; i < numMafia; i++) {
			mafiaPlayers[i] = true;
		}
		shuffleArray(mafiaPlayers);
		lobbyPlayerIds[lobbyId].forEach((id, index) => {
			randomMafia[id] = mafiaPlayers[index];
		});
		socket.broadcast.emit('game-assignments', { lobbyId, randomMafia });
		socket.emit('game-assignments', { lobbyId, randomMafia });
	});

	// Client ended game
	socket.on('ended-game', lobbyId => {
		lobbies[lobbyId].inProgress = false;
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	});

	socket.on('disconnect', () => {
		console.log(`Client with id: ${userId} disconnected`);
		if (playerToLobbyMap[userId]) {
			const lobbyId = playerToLobbyMap[userId];
			lobbyPlayerIds[lobbyId] = lobbyPlayerIds[lobbyId].filter(id => userId !== id);
			lobbies[lobbyId].players -= 1;
			if (lobbies[lobbyId].players === 0 || userId === lobbies[lobbyId].creatorId) {
				delete lobbies[lobbyId];
			}
			delete playerToLobbyMap[userId];
			delete playerInfoMap[userId];
			socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
		}
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
