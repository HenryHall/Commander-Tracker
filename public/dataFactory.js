
//Used in partials controlled in homeController
myApp.service('NewGameService', ['$window', function($window) {
  const config = {
    apiKey: "AIzaSyCYsmtKQXRORf-4ltgadI4DhWpb6reTpJY",
    authDomain: "commander-tracker.firebaseapp.com",
    databaseURL: "https://commander-tracker.firebaseio.com",
    projectId: "commander-tracker",
    storageBucket: "commander-tracker.appspot.com",
    messagingSenderId: "382426392851"
  };
  firebase.initializeApp(config);

  const db = firebase.database();


  return {
    getUserData: function(){
      // console.log("Getting user data");
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
          if(user){
            console.log("Welcome Back");
            resolve(user);
          } else {
            firebase.auth().signInAnonymously()
            .then((user) => {
              console.log("Welcome, new user");
              resolve(user);
            }).catch((error) => {
              reject(error);
            });
          }
        });
      });
    }, //End getUserData
    createGame: function(user){
      return new Promise((resolve, reject) => {
        try {
          let userGamesRef = db.ref(`users/${user.uid}/games`);
          let userGame = userGamesRef.push();
          let gameKey = userGame.key;

          userGame.set(true);
          resolve(gameKey);
        } catch (error) {
          reject(error);
        }
      });
    },
    setPlayerData: function(playerData, gameKey){
      let newGameRef = db.ref(`games/${gameKey}/players/`);
      let playerPromises = [];

      playerData.forEach((player) => {
        let playerRef = newGameRef.push();
        let playerPromise = new Promise((resolve, reject) => {
          playerRef.set(player, function(error){
            if(error){
              //Fail
              console.log(gameKey);
              reject(`Couldn't setPlayerData.\n${gameKey}\n${error}`);
            } else {
              //Success, added new player
              resolve(gameKey);
            }
          });
        });

        playerPromises.push(playerPromise);
      });

      return Promise.all(playerPromises);
    },
    joinGame: function(gameKeys) {
      let gameKey = gameKeys[0];  //Array from Promise.all(), use any value
      console.log(`Joining game ${gameKey}...`);
      $window.location.href = `/joinGame?gameID=${gameKey}`;
    }
  };
}]);  //End NewGameService
