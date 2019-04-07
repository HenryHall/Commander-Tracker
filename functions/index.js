const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.updateGameHistory = functions.database.ref('games/{game}/players/')
    //Pushes game state to history array on write
    .onWrite((snap, context) => {
      let usernameRef = admin.database().ref(`users/${context.auth.uid}/username`);
      let historySnap = snap.before.val();
      let newHistoryRef = admin.database().ref(`games/${context.params.game}/history/`).push();

      return usernameRef.once('value').then((usernameSnap) => {
        return newHistoryRef.set({changeBy: usernameSnap.val(), snap: historySnap});
      })
      .catch((error) => {
        //Error handle??  Pshh nah
        console.log(error);
      });
    });
