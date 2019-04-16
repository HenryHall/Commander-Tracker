
overlayApp.controller('registerController', ['$scope', 'DBService', function($scope, DBService){

  $scope.newusername = {};
  console.log($scope);

  $scope.register = function(){
    let username = $scope.newusername.value;
    console.log(`Trying to register as ${username}.`);
    DBService.register(username).then((confirmedUsername) => {
      console.log(`Thanks for registering to this game as ${confirmedUsername}.`);
      $scope.setUsername(username);
      // $scope.$apply();
    }, function(error) {
      console.log("Something when wrong while trying to register!");
      //todo: handle error
    });
  }

}]);
