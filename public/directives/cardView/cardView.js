
overlayApp.directive('cardView', function() {
  return {
    templateUrl: './directives/cardView/cardView.html',
    restrict: 'E',
    scope: {
    },
    controller: ['$scope', '$element', function($scope, $element){
      console.log("Hello from cardView!");

      $scope.helloWorld = "hello world!";

      $scope.state = {
        open: false
      };
      $scope.toggleCardView = toggleCardView;

      function toggleCardView(){
        let $cv =  $element[0].querySelectorAll('#cardViewBody')[0];
        let $screen = $element[0].querySelectorAll('#cardViewScreen')[0];

        if($cv.classList.contains('open')){
          //Was open, set to closed
          $scope.state.open = false;
          removeActive();  //Remove active class on selected toolBarHeader

          $cv.classList.remove('open');
          $screen.classList.remove('open');

          $cv.classList.add('closed');
          $screen.classList.add('closed');
        } else {
          //Was closed, set to open
          $scope.state.open = true;

          $cv.classList.add('open');
          $screen.classList.add('open');

          $cv.classList.remove('closed');
          $screen.classList.remove('closed');
        }
      };


      function removeActive(){
        let $navSections =  $element[0].querySelectorAll('.active');
        $navSections.forEach((section) => {
          section.classList.remove('active');
        });
      };

    }] //End Controller
  };
});
