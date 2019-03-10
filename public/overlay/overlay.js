
const overlayApp = angular.module('overlayApp', ['firebase']);


overlayApp.config(['$locationProvider', function($locationProvider){
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);


overlayApp.controller('mainController', ['$scope', '$window', '$location', 'DBService', function($scope, $window, $location, DBService){

  let init = function(){
      //Ensure data loads, bind it
    DBService.getGameData().$loaded().then((data) => {
      // console.log(data);
      data.$bindTo($scope, 'gameData').then(() => {
        $scope.setStyles();
        $window.addEventListener('resize', () => {$scope.setStyles(); $scope.$apply();} );
      });
    }).catch((error) => {
      throw new Error(error);
    });

    DBService.getUserData().then((user) => {
      // console.log("User:", user);
    }).catch((error) => {
      throw new Error(error);
    });
  } //End init


  $scope.setStyles = function(){
    const playerCount = Object.keys($scope.gameData.players).length;
    // const toolBarHeightPercent = 0.15;  //Directive toolBar %vh
    const toolBarHeightPercent = 0;  //Directive toolBar %vh
    const cardHeightPercent = (100 * (1 - toolBarHeightPercent))  / playerCount; //Individual player info card %vh
    // console.log(playerCount, toolBarHeightPercent, cardHeightPercent);
    $scope.playerStyle = new Array(playerCount);

    const colors = [
      {border: '#1a237e', background: '#3d5afe'},
      {border: '#9a0007', background: '#d32f2f'},
      {border: '#005005', background: '#2e7d32'},
      {border: '#790e8b', background: '#ab47bc'},
      {border: '#b1bfca', background: '#e3f2fd'},
      {border: '#cabf45', background: '#fff176'}
    ];

    for(let i=0; i<playerCount; i++){
      $scope.playerStyle[i] = {
        height: cardHeightPercent + 'vh',
        color: 'white',
        border: '8px solid ' + colors[i].border,
        "background-color": colors[i].background
      };
    }
  }; //End setStyles


  $scope.applyLifeChange = function(playerName, lifeChange){
    $scope.gameData.players[playerName].life += lifeChange;
  };


  $scope.applyCastChange = function(playerName, castChange){
    $scope.gameData.players[playerName].castCount += castChange;
  };


  $scope.getNameByID = function(id){
    for(player in $scope.gameData.players){
      if($scope.gameData.players[player].id == id) return $scope.gameData.players[player].name;
    }
  };


  //Init
  init();
}]);
