(this.webpackJsonpundefined=this.webpackJsonpundefined||[]).push([[0],{129:function(e,a){},135:function(e,a,t){e.exports=t.p+"static/media/mafia.d5939b3d.jpg"},136:function(e,a,t){e.exports=t.p+"static/media/citizens.7f95e80a.jpg"},14:function(e,a,t){e.exports={assignmentImage:"LobbyPage_assignmentImage__92rRE",button:"LobbyPage_button__1degH",container:"LobbyPage_container__2RfcN",gameButtons:"LobbyPage_gameButtons__1HVp0",gameTitle:"LobbyPage_gameTitle__1WG1G",mafiaBox:"LobbyPage_mafiaBox__u37lf",mafiaDeclaration:"LobbyPage_mafiaDeclaration__2oSEM",mafiaMembersLabel:"LobbyPage_mafiaMembersLabel__LvfC6",playersBox:"LobbyPage_playersBox__D10Fu"}},140:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),c=t(8),o=t.n(c),l=(t(97),t(36)),s=(t(98),t(9)),m=t(24),i=t(40),u=t.n(i),b=t(77),d=t.n(b),y=t(173),f=t(165),_=t(81),p=t.n(_),E=t(169),N=t(20),I=t.n(N),g=function(e){var a=Object(n.useState)(e.players),t=Object(s.a)(a,2),c=t[0],o=t[1],l=Object(n.useState)(!1),m=Object(s.a)(l,2),i=m[0],u=m[1];Object(n.useEffect)((function(){e.socket.on("lobby-playerNum-update_".concat(e.lobbyId),(function(e){o(e)})),e.socket.on("lobby-status-update_".concat(e.lobbyId),(function(e){u(e)}))}),[e.lobbyId,e.socket]);var b=i?r.a.createElement(f.a,{style:{fontSize:"0.4em"},className:I.a.inProgressGameText},"In progress..."):r.a.createElement(f.a,{style:{fontSize:"0.4em"},className:I.a.openGameText},"Open"),d=i?r.a.createElement(y.a,{color:"primary",variant:"contained",disabled:!0},"Join Game"):r.a.createElement(y.a,{color:"primary",onClick:function(){e.setCurrentPlayerLobbyId(e.lobbyId),e.socket.emit("joined-lobby",e.lobbyId,e.userId)},variant:"contained"},"Join Game");return r.a.createElement(E.a,{className:I.a.card,variant:"outlined"},r.a.createElement("div",{className:I.a.cardContent},r.a.createElement(f.a,{style:{fontSize:"1.5em"},className:I.a.cardTitle,variant:"h5"},e.creatorName,"'s Game"),r.a.createElement("div",{className:I.a.cardBody},b),r.a.createElement(f.a,{style:{fontSize:"1.3em"},className:I.a.cardNumPlayers},"Players: ",c),r.a.createElement("div",{className:I.a.joinButton},d)))},v=t(50),j=t.n(v),O=function(e){var a=Object(n.useState)({}),t=Object(s.a)(a,2),c=t[0],o=t[1],l=Object.keys(c);return Object(n.useEffect)((function(){e.socket.emit("state-request"),e.socket.on("lobby-state",(function(e){var a=e.lobbies;e.playerInfoMap;o(a)}))}),[e.socket]),0===l.length?r.a.createElement(f.a,{className:j.a.noGamesMessage,variant:"h3"},"No mafia games to display"):r.a.createElement("div",{className:j.a.allLobbies},l.map((function(a){return r.a.createElement(g,{key:a,lobbyId:a,userId:e.userId,creatorName:c[a].creatorName,players:c[a].players,setCurrentPlayerLobbyId:e.setCurrentPlayerLobbyId,socket:e.socket})})))},k=t(172),L=t(78),x=t(51),C=t.n(x),h=function(e){return r.a.createElement(E.a,{className:C.a.playerCard,variant:"outlined"},r.a.createElement(f.a,{className:C.a.playerName,variant:"h5"},e.name))},P=t(79),B=t.n(P),T=function(e){var a={playerInfoMap:Object(L.a)({},e.creatorId,{name:e.creatorName}),lobbyPlayerIds:[e.creatorId]},t=Object(n.useState)(a),c=Object(s.a)(t,2),o=c[0],l=c[1];return Object(n.useEffect)((function(){e.socket.on("lobby-playerId-update_".concat(e.lobbyId),(function(e){var a=e.lobbyPlayerIds,t=e.playerInfoMap;l({playerInfoMap:t,lobbyPlayerIds:a})}))}),[e.lobbyId,e.socket]),r.a.createElement("div",{className:B.a.allPlayerCards},o.lobbyPlayerIds.map((function(e,a){return r.a.createElement(h,{key:a,name:o.playerInfoMap[e].name})})))},S=t(170),G=t(52),M=t.n(G),w=function(e){var a=Object(n.useState)(!1),t=Object(s.a)(a,2),c=t[0],o=t[1],l=Object(n.useState)(1),m=Object(s.a)(l,2),i=m[0],u=m[1];Object(n.useEffect)((function(){e.socket.on("lobby-playerNum-update_".concat(e.lobbyId),(function(e){u(e)}))}));var b=function(a){var t=a.target.value;isNaN(t)||t<1||t>i?o(!0):(o(!1),e.numMafia.current=t)};return c?r.a.createElement(S.a,{className:M.a.textField,error:!0,id:"outlined-error-helper-text",helperText:"Enter number 1 to ".concat(i),variant:"outlined",onChange:b}):r.a.createElement(S.a,{className:M.a.textField,id:"standard number",variant:"outlined",type:"number",defaultValue:0,onChange:b})},F=t(14),R=t.n(F),z=function(e){var a=Object(n.useState)(null),c=Object(s.a)(a,2),o=c[0],l=c[1],m=Object(n.useState)({}),i=Object(s.a)(m,2),u=i[0],b=i[1],d=Object(n.useState)(!1),_=Object(s.a)(d,2),p=_[0],E=_[1],N=Object(n.useRef)(0),I=Object(n.useRef)(1);Object(n.useEffect)((function(){e.socket.on("lobby-info",(function(e){b(e)}))}),[e.socket]),Object(n.useEffect)((function(){e.socket.on("game-assignments_".concat(e.lobbyId),(function(a){l(a[e.userId])})),e.socket.on("lobby-status-update_".concat(e.lobbyId),(function(e){E(e)}))}),[e.lobbyId,e.socket,e.userId]),Object(n.useEffect)((function(){e.socket.on("lobby-playerNum-update_".concat(e.lobbyId),(function(e){I.current=e}))}));var g=function(){e.socket.emit("left-lobby",e.lobbyId,e.userId),e.setCurrentPlayerLobbyId(null)},v=function(){var a=N.current;!isNaN(a)&&a>0&&a<=I.current&&e.socket.emit("started-game",e.lobbyId,N.current)},j=function(){e.socket.emit("ended-game",e.lobbyId)};return r.a.createElement(k.a,{className:R.a.container},p?r.a.createElement((function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:R.a.mafiaBox},r.a.createElement(f.a,{className:R.a.mafiaDeclaration,variant:"h4"},o?"You are in the mafia":"You are part of the citizens"),o?r.a.createElement("img",{className:R.a.assignmentImage,src:t(135),alt:"mafia"}):r.a.createElement("img",{className:R.a.assignmentImage,src:t(136),alt:"citizens"})),u.creatorId===e.userId&&r.a.createElement("div",{className:R.a.button},r.a.createElement(y.a,{color:"primary",onClick:j,variant:"contained"},"End Game")))}),null):r.a.createElement((function(){return Object.keys(u).length>0?r.a.createElement(r.a.Fragment,null,r.a.createElement(f.a,{className:R.a.gameTitle,variant:"h3"},u.creatorName,"'s Game"),u.creatorId===e.userId&&r.a.createElement(r.a.Fragment,null,r.a.createElement("label",{htmlFor:"mafia-members",className:R.a.mafiaMembersLabel},"Number of mafia members:"),r.a.createElement(w,{numMafia:N,socket:e.socket,lobbyId:e.lobbyId})),r.a.createElement(k.a,{className:R.a.playersBox},r.a.createElement(f.a,{variant:"h5"},"Players:"),r.a.createElement(T,{creatorId:u.creatorId,creatorName:u.creatorName,socket:e.socket,lobbyId:e.lobbyId})),r.a.createElement("div",{className:R.a.gameButtons},u.creatorId===e.userId&&r.a.createElement("div",{className:R.a.button},r.a.createElement(y.a,{color:"primary",onClick:v,variant:"contained"},"Start Game")),r.a.createElement("div",{className:R.a.button},r.a.createElement(y.a,{color:"primary",onClick:g,variant:"contained"},"Leave Game")))):r.a.createElement(r.a.Fragment,null)}),null))},H=t(27),A=t.n(H),D=function(e){var a=Object(n.useState)(null),t=Object(s.a)(a,2),c=t[0],o=t[1],m=Object(n.useState)(!1),i=Object(s.a)(m,2),b=i[0],_=i[1],E=Object(n.useRef)(null);Object(n.useEffect)((function(){E.current=d()("http://127.0.0.1:4001",{transports:["websocket"],upgrade:!1}),_(!0)}),[]),Object(n.useEffect)((function(){return E.current.emit("current-player",e.userId,{name:e.name}),function(){return E.current.emit("player-disconnect",e.userId)}}),[e.userId,e.name]),Object(n.useEffect)((function(){window.addEventListener("beforeunload",(function(a){E.current.emit("player-disconnect",e.userId)})),E.current.on("disconnect",(function(){E.current.emit("player-disconnect",e.userId)})),E.current.on("reconnecting",(function(){E.current.emit("player-reconnect",e.userId)}))}),[e.userId]),Object(n.useEffect)((function(){E.current.on("lobby-destroyed",(function(e){e===c&&o(null)}))}),[c]);return null===c?r.a.createElement("div",{className:A.a.homeContent},r.a.createElement("div",{className:A.a.nameRow},r.a.createElement("div",{className:A.a.backToNameChange},r.a.createElement(l.b,{className:A.a.navLink,to:"/name-entry"},r.a.createElement(y.a,{type:"button",color:"primary",size:"small",variant:"outlined",startIcon:r.a.createElement(p.a,null)},"Change Name"))),r.a.createElement("div",{className:A.a.signedInAsText},r.a.createElement(f.a,null,"Signed in as: ",e.name))),b&&r.a.createElement(O,{userId:e.userId,socket:E.current,setCurrentPlayerLobbyId:o}),r.a.createElement("div",{className:A.a.createLobbyButton},r.a.createElement(y.a,{onClick:function(){var a=u.a.v1();E.current.emit("new-lobby",a,e.userId),o(a),E.current.emit("lobby-info-request",a)},color:"primary",variant:"contained"},"New Lobby"))):r.a.createElement(z,{lobbyId:c,userId:e.userId,setCurrentPlayerLobbyId:o,socket:E.current})},J=t(28),W=t.n(J),Y=function(e){var a=e.authenticate;return r.a.createElement(k.a,{className:W.a.container},r.a.createElement("form",{onSubmit:a},r.a.createElement(f.a,{className:W.a.greeting,variant:"h2"},"Welcome to RL Mafia!"),r.a.createElement("div",{className:W.a.nameInput},r.a.createElement("label",{className:W.a.nameLabel,htmlFor:"name"},"Name:"),r.a.createElement("input",{className:W.a.nameTextBox,onChange:function(a){return e.setName(a.target.value)},placeholder:"Enter Name",type:"text"})),r.a.createElement("div",{className:W.a.submitButton},r.a.createElement(y.a,{color:"primary",type:"submit",variant:"contained"},"Submit"))))},q=t(82),U=t.n(q),Q=function(){var e=Object(n.useState)(""),a=Object(s.a)(e,2),t=a[0],c=a[1],o=Object(n.useState)(!1),l=Object(s.a)(o,2),i=l[0],b=l[1],d=Object(n.useState)(""),y=Object(s.a)(d,2),f=y[0],_=y[1],p=Object(m.f)(),E=Object(n.useCallback)((function(e){e.preventDefault(),b(!0),_(u.a.v1()),p.push("/lobbies")}),[p]);return r.a.createElement("div",{className:U.a.main},r.a.createElement(m.b,{exact:!0,path:"/name-entry",render:function(){return r.a.createElement(Y,{setName:c,authenticate:E})}}),!i&&r.a.createElement(m.a,{to:"/name-entry"}),r.a.createElement(m.b,{exact:!0,path:"/lobbies",render:function(){return r.a.createElement(D,{name:t,userId:f})}}))},V=function(){return r.a.createElement(l.a,null,r.a.createElement(Q,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(V,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},20:function(e,a,t){e.exports={card:"LobbyCard_card__2h4e-",cardBody:"LobbyCard_cardBody__2FG6p",cardContent:"LobbyCard_cardContent__8YC9n",cardNumPlayers:"LobbyCard_cardNumPlayers__13kOF",cardTitle:"LobbyCard_cardTitle__3aRMj",openGameText:"LobbyCard_openGameText__jFJR1",inProgressGameText:"LobbyCard_inProgressGameText__3rUsN",joinButton:"LobbyCard_joinButton__1ooPx"}},27:function(e,a,t){e.exports={backToNameChange:"Home_backToNameChange__1Dq8u",createLobbyButton:"Home_createLobbyButton__15Rzh",homeContent:"Home_homeContent__nTAwP",nameRow:"Home_nameRow__32mFW",navLink:"Home_navLink__3b7iQ",signedInAsText:"Home_signedInAsText__3Lmx8"}},28:function(e,a,t){e.exports={container:"NameEntry_container__1MeJb",greeting:"NameEntry_greeting__cP65N",nameInput:"NameEntry_nameInput__1J61n",nameLabel:"NameEntry_nameLabel__3gZC9",nameTextBox:"NameEntry_nameTextBox__33amT",submitButton:"NameEntry_submitButton__14pAY"}},50:function(e,a,t){e.exports={allLobbies:"AllLobbiesBox_allLobbies__3f7OU",noGamesMessage:"AllLobbiesBox_noGamesMessage__CUWsT"}},51:function(e,a,t){e.exports={playerCard:"PlayerCard_playerCard__2O99i",playerName:"PlayerCard_playerName__2ydcQ"}},52:function(e,a,t){e.exports={textField:"NumMafiaInput_textField__WmyDb"}},79:function(e,a,t){e.exports={allPlayerCards:"LobbyPlayersList_allPlayerCards__3mr3H"}},82:function(e,a,t){e.exports={main:"Main_main__3de2d"}},92:function(e,a,t){e.exports=t(140)},97:function(e,a,t){},98:function(e,a,t){}},[[92,1,2]]]);
//# sourceMappingURL=main.0a067980.chunk.js.map