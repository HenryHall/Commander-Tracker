
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
  let currentUser = undefined;


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
      // console.log("Creating new user game.");
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
    setGameData: function(gameData, gameKey){
      // console.log("Setting game data.");
      return new Promise((resolve, reject) => {
        let newGameRef = db.ref(`games/${gameKey}`);

        newGameRef.set(gameData, function(error){
          if(error){
            //Fail
            console.log(gameKey);
            reject(`Couldn't setGameData.\n${gameKey}\n${error}`);
          } else {
            //Success!
            resolve(gameKey);
          }
        });
      });
    },
    joinGame: function(gameKey) {
      console.log(`Joining game ${gameKey}...`);
      $window.location.href = `/joinGame?gameID=${gameKey}`;
    }
  };
}]);  //End NewGameService
