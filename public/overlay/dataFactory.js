
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

  const db = firebase.database();

  const gameRef = db.ref(`games/${gameID}`);
  const userRef = db.ref(`users/`);
  // const gameData = $firebaseObject(ref);

  return {
    getGameData: function(){ return $firebaseObject(gameRef); },
    getUserData: function(){ return new Promise((resolve, reject) => {
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
    } //End getUserData
  };

}]);  //End DBService
