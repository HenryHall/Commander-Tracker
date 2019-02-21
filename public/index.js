
const myApp = angular.module('homeApp', []);


//Used in partials controlled in homeController
myApp.service('NewGameService', ['$window', function($window) {
  return {
    joinGame: function(gameID) {
      console.log(gameID);
      $window.location.href = `/joinGame?gameID=${gameID}`;
    }
  };
}]);  //End NewGameService


myApp.controller('homeController', ['$scope', function($scope){

  $scope.state = undefined;
  $scope.states = [
    './partials/newGame/newGame.html',
    './partials/joinGame/joinGame.html'
  ];

  $scope.setActive = function(event){
    let navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach( (nLink) => {
      nLink === event.currentTarget ? nLink.classList.add('active') : nLink.classList.remove('active');
    });
  } //End setActive


  $scope.toggleState = function(newState){
    //State 0: New Game
    //State 1: Join Game
    $scope.state = $scope.states[newState];
  };


}]);
