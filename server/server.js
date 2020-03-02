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
 * Set a timeout of 4 seconds for a user to reconnect
 * Implemented because of random socket disconnections/reconnections that caused
 * errors when the lobby creator's socket would disconnect
 *
 * @param userId id of user from frontend
 * @returns {number} timeout to be set in playerTimeouts map
 */
const playerTimeout = userId =>
	setTimeout(() => {
		console.log(`Client with id: ${userId} timed out`);
		delete playerInfoMap[userId];
		if (playerToLobbyMap[userId]) {
			const lobbyId = playerToLobbyMap[userId];
			if (lobbies[lobbyId]) {
				lobbies[lobbyId].playerIds = lobbies[lobbyId].playerIds.filter(id => userId !== id);
				lobbies[lobbyId].players = lobbies[lobbyId].playerIds.length;
				if (lobbies[lobbyId].players === 0 || userId === lobbies[lobbyId].creatorId) {
					io.emit('lobby-destroyed', lobbyId);
					delete lobbies[lobbyId];
					io.emit('lobby-state', lobbies);
				} else {
					io.in(lobbyId).emit('lobby-playerId-update', {
						lobbyPlayerIds: lobbies[lobbyId].playerIds,
						playerInfoMap,
					});
					io.emit('lobby-playerNum-update', {
						numPlayers: lobbies[lobbyId].players,
						lobbyId,
					});
				}
			}
		}
		delete playerToLobbyMap[userId];
	}, 4000);

const clearPlayerTimeout = userId => {
	clearTimeout(playerTimeouts[userId]);
	delete playerTimeouts[userId];
};

io.on('connection', socket => {
	// New Client Connected
	console.log('Unnamed client connected');

	// Client requested lobby state
	socket.on('state-request', () => {
		socket.emit('lobby-state', lobbies);
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
		console.log(info);
		playerToLobbyMap[userId] = null;
		playerInfoMap[userId] = info;
	});

	// Client created new lobby
	socket.on('new-lobby', (lobbyId, userId) => {
		console.log('new lobby');
		socket.join(lobbyId);

		lobbies[lobbyId] = {
			creatorId: userId,
			creatorName: playerInfoMap[userId].name,
			players: 1,
			inProgress: false,
			playerIds: [userId],
		};

		playerToLobbyMap[userId] = lobbyId;

		io.in(lobbyId).emit('lobby-playerId-update', {
			lobbyPlayerIds: lobbies[lobbyId].playerIds,
			playerInfoMap,
		});
		io.emit('lobby-playerNum-update', {
			numPlayers: lobbies[lobbyId].players,
			lobbyId,
		});

		io.emit('lobby-state', lobbies);
	});

	// Client joined a lobby
	socket.on('joined-lobby', (lobbyId, playerId) => {
		socket.join(lobbyId);

		lobbies[lobbyId].playerIds.push(playerId);
		lobbies[lobbyId].players = lobbies[lobbyId].playerIds.length;
		playerToLobbyMap[playerId] = lobbyId;

		socket.emit('lobby-info', {
			creatorId: lobbies[lobbyId].creatorId,
			creatorName: lobbies[lobbyId].creatorName,
			players: lobbies[lobbyId].players,
		});
		io.in(lobbyId).emit('lobby-playerId-update', {
			lobbyPlayerIds: lobbies[lobbyId].playerIds,
			playerInfoMap,
		});
		io.emit('lobby-playerNum-update', {
			numPlayers: lobbies[lobbyId].players,
			lobbyId,
		});
	});

	// Client requested lobby player info
	socket.on('playerId-request', lobbyId => {
		socket.emit('lobby-playerId-update', {
			lobbyPlayerIds: lobbies[lobbyId].playerIds,
			playerInfoMap,
		});
	});

	// Client left a lobby
	socket.on('left-lobby', (lobbyId, playerId) => {
		if (lobbies[lobbyId]) {
			lobbies[lobbyId].playerIds = lobbies[lobbyId].playerIds.filter(id => playerId !== id);
			lobbies[lobbyId].players = lobbies[lobbyId].playerIds.length;
			if (lobbies[lobbyId].players === 0 || playerId === lobbies[lobbyId].creatorId) {
				socket.broadcast.emit('lobby-destroyed', lobbyId);
				delete lobbies[lobbyId];
				io.emit('lobby-state', lobbies);
				io.of('/')
					.in(lobbyId)
					.clients((error, socketIds) => {
						if (error) throw error;
						socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(lobbyId));
					});
			} else {
				socket.leave(lobbyId);
				io.emit('lobby-playerNum-update', {
					numPlayers: lobbies[lobbyId].players,
					lobbyId,
				});
				io.in(lobbyId).emit('lobby-playerId-update', {
					lobbyPlayerIds: lobbies[lobbyId].playerIds,
					playerInfoMap,
				});
			}
		}
		delete playerToLobbyMap[playerId];
	});

	// Client started game
	socket.on('started-game', (lobbyId, numMafia) => {
		const randomMafia = {};
		const playerLen = lobbies[lobbyId].playerIds.length;
		lobbies[lobbyId].inProgress = true;
		io.emit(lobbyId).emit('lobby-status-update', {
			inProgress: lobbies[lobbyId].inProgress,
			lobbyId,
		});
		const mafiaPlayers = new Array(playerLen).fill(false);
		for (let i = 0; i < numMafia; i++) {
			mafiaPlayers[i] = true;
		}
		shuffleArray(mafiaPlayers);
		lobbies[lobbyId].playerIds.forEach((id, index) => {
			randomMafia[id] = mafiaPlayers[index];
		});
		io.in(lobbyId).emit('game-assignments', randomMafia);
	});

	// Client ended game
	socket.on('ended-game', lobbyId => {
		lobbies[lobbyId].inProgress = false;
		io.emit(lobbyId).emit('lobby-status-update', {
			inProgress: lobbies[lobbyId].inProgress,
			lobbyId,
		});
		io.in(lobbyId).emit('lobby-playerId-update', {
			lobbyPlayerIds: lobbies[lobbyId].playerIds,
			playerInfoMap,
		});
	});

	// Client socket disconnected
	socket.on('player-disconnect', userId => {
		const lobbyId = playerToLobbyMap[userId];
		if (lobbyId) {
			socket.leave(lobbyId);
		}
		playerTimeouts[userId] = playerTimeout(userId);
		console.log(`Client with id: ${userId} disconnected`);
	});

	// Client reconnected with new socket
	socket.on('player-reconnect', userId => {
		clearPlayerTimeout(userId);
		const lobbyId = playerToLobbyMap[userId];
		if (lobbyId) {
			socket.join(lobbyId);
		}
		console.log(`Client with id ${userId} reconnected successfully`);
	});
});

if (process.env.NODE_ENV === 'production') {
	// Express will serve up production assets
	app.use(express.static('../app/build'));

	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '..', 'app', 'build', 'index.html'));
	});
}

server.listen(port, () => console.log(`Listening on port ${port}`));
