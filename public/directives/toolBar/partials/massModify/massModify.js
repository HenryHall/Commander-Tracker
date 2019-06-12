``
overlayApp.controller('massModifyController', ['$scope', function($scope){

  $scope.modifyValue = 0;
  $scope.operator = {type: '-'};  //Initialize value
  $scope.selected = {}; //ng-model for checkboxes

  $scope.selectForModification = function(playerID){
    $scope.selected[playerID] = !$scope.selected[playerID];
  }

  $scope.modify = function(){
    for(playerID in $scope.selected){
      if($scope.selected[playerID]){
        //Is checked
        let player = $scope.playerData.find((p) => {return p.id === parseInt(playerID);});
        player.life += ($scope.modifyValue * ($scope.operator.type === '+' ? 1 : -1));
      }
    }

    $scope.toggleToolBar();
  };

}]);
