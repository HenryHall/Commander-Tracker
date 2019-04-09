
overlayApp.controller('resetController', ['$scope', function($scope){

  $scope.reset = function(){
    $scope.playerData.forEach((player) => {
      player.castCount = 0;
      player.life = 40;
      player.damage.forEach((opponent) => {
        opponent.damage = 0;
      });
    });

    $scope.toggleToolBar();
  };


  $scope.cancel = function(){
    $scope.toggleToolBar();
  };

}]);
