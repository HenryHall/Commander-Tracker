const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// exports.setMetadata = functions.database.ref();


exports.checkSeatCount = functions.database.ref('games/{game}/seatedPlayers/')

    //Deletes new seatedPlayers reference if the seats are already filled
    .onWrite((snap, context) => {
      let maxPlayers = admin.database().ref(`games/${context.params.game}/playerCount`);
      let playerList = admin.database().ref(`games/${context.params.game}/seatedPlayers`).val();
      let seatedPlayersCount = Object.keys(playerList).length;

      if(seatedPlayersCount > maxPlayers){
        snap.remove();
      }
    });


exports.updateGameHistory = functions.database.ref('games/{game}/players/')

    //Pushes game state to history array on write
    .onWrite((snap, context) => {
      let newGameData = snap.before.val();
      let newHistoryRef = admin.database().ref(`games/${context.params.game}/history/`).push();
      return newHistoryRef.set(newGameData);
    });
