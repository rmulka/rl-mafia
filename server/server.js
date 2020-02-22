const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4001;

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

const lobbies = {}; // Current state of all lobbies
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
			if (lobbies[lobbyId]) {
				lobbies[lobbyId].playerIds = lobbies[lobbyId].playerIds.filter(id => userId !== id);
				lobbies[lobbyId].players = lobbies[lobbyId].playerIds.length;
				if (lobbies[lobbyId].players === 0 || userId === lobbies[lobbyId].creatorId) {
					socket.broadcast.emit('lobby-destroyed', lobbyId);
					delete lobbies[lobbyId];
					socket.broadcast.emit('lobby-state', { lobbies, playerInfoMap });
				} else {
					socket.broadcast.emit(`lobby-playerId-update_${lobbyId}`, {
						lobbyPlayerIds: lobbies[lobbyId].playerIds,
						playerInfoMap,
					});
					socket.broadcast.emit(`lobby-playerNum-update_${lobbyId}`, lobbies[lobbyId].players);
				}
			}
		}
		delete playerToLobbyMap[userId];
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
		socket.emit('lobby-state', { lobbies, playerInfoMap });
	});

	// Client requested lobby info
	socket.on('lobby-info-request', lobbyId => {
		socket.emit('lobby-info', {
			creatorId: lobbies[lobbyId].creatorId,
			creatorName: lobbies[lobbyId].creatorName,
			players: lobbies[lobbyId].players,
		});
	});

	// Get client id
	socket.on('current-player', (userId, info) => {
		console.log(`id ${userId} registered`);
		playerToLobbyMap[userId] = null;
		playerInfoMap[userId] = info;
	});

	// Client reconnected
	socket.on('player-reconnect', userId => {
		clearPlayerTimeout(userId);
		console.log(`Client with id ${userId} reconnected successfully`);
	});

	// Client created new lobby
	socket.on('new-lobby', (lobbyId, userId) => {
		lobbies[lobbyId] = {
			creatorId: userId,
			creatorName: playerInfoMap[userId].name,
			players: 1,
			inProgress: false,
			playerIds: [userId],
		};

		playerToLobbyMap[userId] = lobbyId;

		socket.broadcast.emit(`lobby-playerId-update_${lobbyId}`, {
			lobbyPlayerIds: lobbies[lobbyId].playerIds,
			playerInfoMap,
		});
		socket.emit(`lobby-playerId-update_${lobbyId}`, {
			lobbyPlayerIds: lobbies[lobbyId].playerIds,
			playerInfoMap,
		});
		socket.broadcast.emit(`lobby-playerNum-update_${lobbyId}`, lobbies[lobbyId].players);
		socket.emit(`lobby-playerNum-update_${lobbyId}`, lobbies[lobbyId].players);

		socket.emit('lobby-state', { lobbies, playerInfoMap });
		socket.broadcast.emit('lobby-state', { lobbies, playerInfoMap });
	});

	// Client joined a lobby
	socket.on('joined-lobby', (lobbyId, playerId) => {
		lobbies[lobbyId].playerIds.push(playerId);
		lobbies[lobbyId].players = lobbies[lobbyId].playerIds.length;
		playerToLobbyMap[playerId] = lobbyId;
		socket.emit('lobby-info', {
			creatorId: lobbies[lobbyId].creatorId,
			creatorName: lobbies[lobbyId].creatorName,
			players: lobbies[lobbyId].players,
		});
		io.emit(`lobby-playerId-update_${lobbyId}`, {
			lobbyPlayerIds: lobbies[lobbyId].playerIds,
			playerInfoMap,
		});
		io.emit(`lobby-playerNum-update_${lobbyId}`, lobbies[lobbyId].players);
	});

	// Client left a lobby
	socket.on('left-lobby', (lobbyId, playerId) => {
		lobbies[lobbyId].playerIds = lobbies[lobbyId].playerIds.filter(id => playerId !== id);
		lobbies[lobbyId].players = lobbies[lobbyId].playerIds.length;
		if (lobbies[lobbyId].players === 0 || playerId === lobbies[lobbyId].creatorId) {
			socket.broadcast.emit('lobby-destroyed', lobbyId);
			delete lobbies[lobbyId];
			socket.emit('lobby-state', { lobbies, playerInfoMap });
			socket.broadcast.emit('lobby-state', { lobbies, playerInfoMap });
		} else {
			socket.emit(`lobby-playerNum-update_${lobbyId}`, lobbies[lobbyId].players);
			socket.broadcast.emit(`lobby-playerId-update_${lobbyId}`, {
				lobbyPlayerIds: lobbies[lobbyId].playerIds,
				playerInfoMap,
			});
			socket.broadcast.emit(`lobby-playerNum-update_${lobbyId}`, lobbies[lobbyId].players);
		}
		delete playerToLobbyMap[playerId];
	});

	// Client started game
	socket.on('started-game', (lobbyId, numMafia) => {
		const randomMafia = {};
		const playerLen = lobbies[lobbyId].playerIds.length;
		lobbies[lobbyId].inProgress = true;
		socket.broadcast.emit(`lobby-status-update_${lobbyId}`, lobbies[lobbyId].inProgress);
		socket.emit(`lobby-status-update_${lobbyId}`, lobbies[lobbyId].inProgress);
		const mafiaPlayers = new Array(playerLen).fill(false);
		for (let i = 0; i < numMafia; i++) {
			mafiaPlayers[i] = true;
		}
		shuffleArray(mafiaPlayers);
		lobbies[lobbyId].playerIds.forEach((id, index) => {
			randomMafia[id] = mafiaPlayers[index];
		});
		socket.broadcast.emit(`game-assignments_${lobbyId}`, randomMafia);
		socket.emit(`game-assignments_${lobbyId}`, randomMafia);
	});

	// Client ended game
	socket.on('ended-game', lobbyId => {
		lobbies[lobbyId].inProgress = false;
		socket.broadcast.emit(`lobby-status-update_${lobbyId}`, lobbies[lobbyId].inProgress);
		socket.emit(`lobby-status-update_${lobbyId}`, lobbies[lobbyId].inProgress);
		socket.emit(`lobby-playerId-update_${lobbyId}`, {
			lobbyPlayerIds: lobbies[lobbyId].playerIds,
			playerInfoMap,
		});
		socket.broadcast.emit(`lobby-playerId-update_${lobbyId}`, {
			lobbyPlayerIds: lobbies[lobbyId].playerIds,
			playerInfoMap,
		});
	});

	socket.on('player-disconnect', userId => {
		playerTimeouts[userId] = playerTimeout(userId, socket);
		console.log(`Client with id: ${userId} disconnected`);
	});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
