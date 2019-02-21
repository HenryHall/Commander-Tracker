

let firebaseConfig = {
  apiKey: "AIzaSyCYsmtKQXRORf-4ltgadI4DhWpb6reTpJY",
  authDomain: "commander-tracker.firebaseapp.com",
  databaseURL: "https://commander-tracker.firebaseio.com",
  projectId: "commander-tracker",
  storageBucket: "commander-tracker.appspot.com",
  messagingSenderId: "382426392851"
};
firebase.initializeApp(firebaseConfig);

const overlayApp = angular.module('overlayApp', ['firebase']);


overlayApp.config(['$locationProvider', function($locationProvider){
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);


overlayApp.controller('mainController', ['$scope', '$window', '$location', '$firebaseObject', function($scope, $window, $location, $firebaseObject){

  console.log(`Loading game data for ${$location.search().gameID}`);
  let init = function(){
    const gameID = $location.search().gameID;
    const ref = firebase.database().ref(`games/${gameID}`);
    const gameData = $firebaseObject(ref);
    let playerCount = undefined;

    //Ensure data loads, bind it
    gameData.$loaded().then((data) => {
      gameData.$bindTo($scope, "gameData").then(() => {
        //Set CSS, bind resie event
        $scope.setStyles();
        $window.addEventListener('resize', $scope.setStyles );
      });
    }).catch((error) => {
      throw new Error(error);
    });


  } //End init


  $scope.setStyles = function(){
    const playerCount = Object.keys($scope.gameData.players).length;
    const cardHeight = $window.innerHeight / playerCount;
    $scope.playerStyle = new Array(playerCount);

    const colors = [
      {border: '#001FFF', font: '#0C60E8', background: '#111155'},
      {border: '#FF5555', font: '#E80C21', background: '#551111'},
      {border: '#00FF57', font: '#0CE819', background: '#115533'},
      {border: '#FF00DF', font: '#FF0CE8', background: '#8B0DFF'},
      {border: '#FF9E00', font: '#E8770C', background: '#552211'},
      {border: '#FFF200', font: '#E8C70C', background: '#555511'}
    ];

    for(let i=0; i<playerCount; i++){
      $scope.playerStyle[i] = {
        height: cardHeight + 'px',
        color: 'white',
        border: '8px solid ' + colors[i].border,
        "background-color": colors[i].background
      };
    }

    // let pCardEls = document.querySelectorAll('.player');
    // pCardEls.forEach((player, i) => {
    //   player.style.height = cardHeight + 'px';
    //   player.style.border = '8px solid ' + colors[i].border;
    //   player.style.backgroundColor = colors[i].background;
    // });
  }; //End setStyles


  //Init
  init();
}]);
