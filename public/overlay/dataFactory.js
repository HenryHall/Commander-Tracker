
overlayApp.factory('DBService', ['$location', '$firebaseObject', '$http', function myService($location, $firebaseObject, $http) {
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
    getPlayerData: getPlayerData,
    getUserObj: getUserObj,
    getUserData: getUserData,
    register: register,
    getImageURL: getImageURL
  };



  function getPlayerData(){
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
  }


  function getUserObj(){
    //todo:  Rework, this sucks
    return new Promise((resolve, reject) => {
      //Tries to return a user obj for auth db
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          console.log("Welcome Back");

          //Add the game to the users records
          // let newGameRef = db.ref(`users/${user.uid}/games/`).push();
          // newGameRef.set({[gameID]: true});

          console.log(user.uid);
          resolve(user);
        } else {
          console.log("No user");
          firebase.auth().signInAnonymously()
          .then((user) => {
            console.log("Created user");
            resolve(user);
          }).catch((error) => {
            console.log("Fail Here");
            reject(error);
          });
        }
      });
    });
  }


  function getUserData(){
    return new Promise((resolve, reject) => {
      //Tries to return a user in Commander Tracker app db
      getUserObj().then((user) => {
        if(user){
          //todo: get more than username
          userRef.child(`${user.uid}/username`).once('value').then((snap) => {
            console.log(`aka ${snap.val()}`);
            resolve(snap.val());
          })
          .catch((error) => {
            console.log("Failed to get username in getUserData while trying to query the node.");
            reject(error);
          });
        } else {
          reject("Could not create user object.");
        }
      })
      .catch((error) => {
        console.log("Could not get user object from dataservice getUsername.");
        resolve(error);
      });
    });
  }


  function register(username){
    return new Promise((resolve, reject) => {
      getUserObj().then((user) => {
        let registerRef = userRef.child(`${user.uid}/username`);
        return registerRef.set(username)
      })
      .then(() => {
        resolve(username);
      }, function(error){
        console.log("Shit broke yo.");
        reject(error);
      });
    })
  } //End register


  function getImageURL(commanderName){
    let commanderEncoded = encodeURI(commanderName);
    return new Promise((resolve, reject) => {
      $http({
        method: 'GET',
        url: `https://api.scryfall.com/cards/named?fuzzy=${commanderEncoded}`
      })
      .then((cardData) => {
        // console.log(`Got cardData in getImage for ${commanderName}`);
        resolve(cardData.data.image_uris.art_crop);
      })
      .catch((error) => {
        console.log(`Could not get card data for ${commanderName}`);
        reject(error);
      })
    });
  }

}]);  //End DBService
