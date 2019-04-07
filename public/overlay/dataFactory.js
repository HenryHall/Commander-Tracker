
overlayApp.factory('DBService', ['$location', '$firebaseObject', function myService($location, $firebaseObject) {
  const firebaseConfig = {
    apiKey: "AIzaSyCYsmtKQXRORf-4ltgadI4DhWpb6reTpJY",
    authDomain: "commander-tracker.firebaseapp.com",
    databaseURL: "https://commander-tracker.firebaseio.com",
    projectId: "commander-tracker",
    storageBucket: "commander-tracker.appspot.com",
    messagingSenderId: "382426392851"
  };

  firebase.initializeApp(firebaseConfig);

  const gameID = $location.search().gameID;
  console.log(`Loading game data for ${gameID}`);

  if(!gameID){ throw new Error('You need to join a specific game!'); }

  const db = firebase.database();

  const playersRef = db.ref(`games/${gameID}/players/`);
  const userRef = db.ref(`users/`);


  return {
    getPlayerData: function(){
      //Gets the keys to make player references, make them firebase objects.  return for loading
      return new Promise((resolve, reject) => {
        playersRef.once('value').then((snap) => {
          let playerRefArr = [];

          snap.forEach((playerObj) => {
            let playerKey = playerObj.key;
            let playerRef = playersRef.child(playerKey);
            playerRefArr.push( $firebaseObject(playerRef).$loaded() );
          });

          resolve(playerRefArr);
        })
        .catch((error) => {
          reject(error);
        });
      });
    },
    getUserData: function(){ return new Promise((resolve, reject) => {
      //Tries to return a user obj
        firebase.auth().onAuthStateChanged((user) => {
          if(user){
            console.log("Welcome Back");
            // let newGameRef = db.ref(`users/${user.uid}/games/`).push();
            // newGameRef.set({[gameID]: true});
            // console.log(user.uid);
            resolve(user);
          } else {
            firebase.auth().signInAnonymously()
            .then((user) => {
              console.log("Welcome, new user");
              // console.log(user.uid);
              // let newGameRef = db.ref(`users/${user.uid}/games/`).push();
              // newGameRef.set({[gameID]: true});
              resolve(user);
            }).catch((error) => {
              reject(error);
            });
          }
        });
      });
    }, //End getUserData
    register: function(username){  return new Promise((resolve, reject) => {
      this.getUserData()
        .then((user) => {
          let registerRef = db.ref(`users/${user.uid}/username/`);
          registerRef.set(username)
            .then(() => {
              resolve();
            }, function(error){
              console.log("Shit broke yo.");
              reject(error);
            });
          });
    })}
  };

}]);  //End DBService
