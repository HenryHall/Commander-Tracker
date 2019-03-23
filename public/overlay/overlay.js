
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
    DBService.getPlayerData().$loaded().then((data) => {
      // console.log(data);
      data.$bindTo($scope, 'playerData').then(() => {
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
    let playerCount = 0;
    for(key in $scope.playerData){
      if(key.charAt(0) !== '$'){
        playerCount++;
      }
    }

    const cardHeightPercent = 100 / playerCount; //Individual player info card %vh
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
        border: '8px solid ' + colors[i].border,
        "background-color": colors[i].background
      };
    }
  }; //End setStyles


  $scope.applyLifeChange = function(playerIndex, lifeChange){
    $scope.playerData[playerIndex].life += lifeChange;
  };


  $scope.applyCastChange = function(playerIndex, castChange){
    $scope.playerData[playerIndex].castCount += castChange;
  };


  $scope.getNameByID = function(id){
    for(player in $scope.playerData){
      if($scope.playerData[player].id == id) return $scope.playerData[player].name;
    }
  };


  $scope.claimSeat = function(){
    DBService.claimSeat().then((res) => {
      console.log("Claim Seat Success!");
    }, function(error){
      console.log("Claim Seat Fail.");
    });
  }


  //Init
  init();
}]);
