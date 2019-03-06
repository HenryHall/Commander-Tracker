
overlayApp.directive('toolBar', function() {
  return {
    templateUrl: './directives/toolBar/toolBar.html',
    restrict: 'E',
    scope: {
    },
    controller: ['$scope', function($scope){
      //!important: Set vh in overlay.js && toolBar.css
      $scope.navItems = [
        'Close',
        'Damage All',
        'Add Effect',  //Monarch, Cities Blessing
        'Other Thing'
      ];
    }]
  }
});
