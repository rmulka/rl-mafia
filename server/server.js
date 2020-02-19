const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

const lobbies = {}; // Current state of all lobbies
const lobbyPlayerIds = {}; // Map of lobby ids to array of player ids
const playerToLobbyMap = {}; // Map of player ids to corresponding lobby id if player is in a lobby
const playerInfoMap = {}; // Map of player ids to player information
const playerTimeouts = {}; // Handles current timeouts in progress for players who disconnected

const shuffleArray = array => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};

/**
 * Set a timeout of 2 seconds for a user to reconnect
 * Implemented because of random socket disconnections/reconnections that caused
 * errors when the lobby creator's socket would disconnect
 *
 * @param userId id of user from frontend
 * @param socket io for broadcast
 * @returns {number} timeout to be set in playerTimeouts map
 */
const playerTimeout = (userId, socket) =>
	setTimeout(() => {
		console.log(`Client with id: ${userId} timed out`);
		delete playerInfoMap[userId];
		if (playerToLobbyMap[userId]) {
			const lobbyId = playerToLobbyMap[userId];
			if (lobbyPlayerIds[lobbyId]) {
				lobbyPlayerIds[lobbyId] = lobbyPlayerIds[lobbyId].filter(id => userId !== id);
				if (lobbyPlayerIds[lobbyId].length === 0) {
					socket.broadcast.emit('lobby-destroyed', lobbyId);
					delete lobbies[lobbyId];
					delete lobbyPlayerIds[lobbyId];
				}
			}
			if (lobbies[lobbyId]) {
				lobbies[lobbyId].players -= 1;
				if (lobbies[lobbyId].players === 0 || userId === lobbies[lobbyId].creatorId) {
					socket.broadcast.emit('lobby-destroyed', lobbyId);
					delete lobbies[lobbyId];
					delete lobbyPlayerIds[lobbyId];
				}
			}
		}
		delete playerToLobbyMap[userId];
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	}, 2000);

const clearPlayerTimeout = userId => {
	clearTimeout(playerTimeouts[userId]);
};

io.set('transports', ['websocket']);

io.on('connection', socket => {
	// New Client Connected
	console.log('Unnamed client connected');

	// Client requested state
	socket.on('state-request', () => {
		socket.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	});

	// Get client id
	socket.on('current-player', (userId, info) => {
		console.log(`id ${userId} registered`);
		playerToLobbyMap[userId] = null;
		playerInfoMap[userId] = info;
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	});

	// Client reconnected
	socket.on('player-reconnect', userId => {
		clearPlayerTimeout(userId);
		console.log(`Client with id ${userId} reconnected successfully`);
	});

	// Client created new lobby
	socket.on('new-lobby', (lobbyId, userId, lobby) => {
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
		playerToLobbyMap[playerId] = lobbyId;
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
		if (lobbyPlayerIds[lobbyId]) {
			lobbyPlayerIds[lobbyId] = lobbyPlayerIds[lobbyId].filter(id => playerId !== id);
		}
		delete playerToLobbyMap[playerId];
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
		socket.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	});

	// Client started game
	socket.on('started-game', (lobbyId, numMafia) => {
		const randomMafia = {};
		const playerLen = lobbyPlayerIds[lobbyId].length;
		lobbies[lobbyId].inProgress = true;
		socket.broadcast.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
		socket.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
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
		socket.emit('lobby-state', { lobbies, lobbyPlayerIds, playerInfoMap });
	});

	socket.on('player-disconnect', userId => {
		playerTimeouts[userId] = playerTimeout(userId, socket);
		console.log(`Client with id: ${userId} disconnected`);
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
