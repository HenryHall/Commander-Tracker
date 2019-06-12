
myApp.controller('joinGameController', ['$scope', 'NewGameService', function($scope, NewGameService){

  $scope.alert = undefined;

  $scope.joinGame = function(){
    let gameID = $scope.gameIDIn;

    if(gameID && gameID != ''){
      try {
        let gameKeys = [gameID];
        NewGameService.joinGame(gameKeys);
        $scope.alert = false;
      } catch (error) {
        $scope.alertMessage = `joinGame failed:\n${error}`;
        $scope.alert = true;
      }
    } else {
      $scope.alertMessage = `Enter a Game ID to join.`;
      $scope.alert = true;
    }
  };

}]);
