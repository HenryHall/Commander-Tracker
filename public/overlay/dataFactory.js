
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

  const gameRef = db.ref(`games/${gameID}/players`);
  const userRef = db.ref(`users/`);
  const seatsRef = db.ref(`games/${gameID}/seatedPlayers/`);


  return {
    getPlayerData: function(){
      let gameObject = undefined;

      try {
        gameObject = $firebaseObject(gameRef);
      } catch (e) {
        throw new Error(e);
      }

      return gameObject;
    },
    getUserData: function(){ return new Promise((resolve, reject) => {
      //Tries to return user obj
        firebase.auth().onAuthStateChanged((user) => {
          if(user){
            console.log("Welcome Back");
            // let newGameRef = db.ref(`users/${user.uid}/games/`).push();
            // newGameRef.set({[gameID]: true});
            console.log(user.uid);
            resolve(user);
          } else {
            firebase.auth().signInAnonymously()
            .then((user) => {
              console.log("Welcome, new user");
              console.log(user.uid);
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
    claimSeat: function(){  return new Promise((resolve, reject) => {
      this.getUserData()
        .then((user) => {
          seatsRef.child(user.uid).set(true)
            .then((data) => {
              resolve(data);
            }, function(error){
              console.log("Shit broke yo.");
              reject(error);
            });
          });
    })

    }
  };

}]);  //End DBService
