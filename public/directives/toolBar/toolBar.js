
overlayApp.directive('toolBar', function() {
  return {
    templateUrl: './directives/toolBar/toolBar.html',
    restrict: 'E',
    scope: {
    },
    controller: ['$scope', '$element', 'DBService', function($scope, $element, DBService){

      $scope.playerData = undefined;
      $scope.state = {
        open: false,
        view: undefined
      }

      $scope.toggleToolBar = toggleToolBar;
      $scope.setActive = setActive;
      $scope.toggleMenuModal = toggleMenuModal;
      $scope.getUserData = DBService.getUserData;
      $scope.getPlayerData = DBService.getPlayerData;

      init();
      function init(){
        //Get user data
        $scope.getUserData().then((username) => {
          $scope.username = username;
        })
        .catch((error) => {
          console.log("Could not get user data for the toolbar!");
        });

        //Get player data
        $scope.getPlayerData().then((playerPromises) => {
          Promise.all(playerPromises).then((loadedPlayerData) => {
            let bindingPromises = [];
            $scope.playerData = loadedPlayerData;

            $scope.playerData.forEach((player, index) => {
              let playerBind = player.$bindTo($scope, `playerData[${index}]`);
              bindingPromises.push(playerBind);
            });

            return Promise.all(bindingPromises);
          })
          .catch((error) => {
            console.log("Something when wrong while loading player data!");
            console.log(error);
          });
        }); //End player data loading and binding
      }


      // Start toolBarHeader Section
      function toggleToolBar(){
        let $tb =  $element[0].querySelectorAll('#toolBarHeader')[0];
        let $screen = $element[0].querySelectorAll('#toolBarMenuScreen')[0];

        if($tb.classList.contains('open')){
          //Was open, set to closed
          $scope.state.open = false;
          $scope.state.view = undefined;  //Unload modal partial
          removeActive();  //Remove active class on selected toolBarHeader

          $tb.classList.remove('open');
          $screen.classList.remove('open');

          $tb.classList.add('closed');
          $screen.classList.add('closed');
        } else {
          //Was closed, set to open
          $scope.state.open = true;

          $tb.classList.add('open');
          $screen.classList.add('open');

          $tb.classList.remove('closed');
          $screen.classList.remove('closed');
        }
      };


      $scope.navItems = [
        // {display: 'Close', action: $scope.toggleToolBar},
        {display: 'Mass Modify', action: function(e){ toggleMenuModal(0); setActive(e); }},
        {display: 'Player Settings', action: function(e){ toggleMenuModal(1); setActive(e); }},
        {display: 'History', action: function(e){ toggleMenuModal(2); setActive(e); }},
        {display: 'Reset', action: function(e){ toggleMenuModal(3); setActive(e); }}
      ];


      let tbViews = [
        './directives/toolBar/partials/massModify/massModify.html',
        './directives/toolBar/partials/playerSettings/playerSettings.html',
        './directives/toolBar/partials/history/history.html',
        './directives/toolBar/partials/reset/reset.html',
        './directives/toolBar/partials/register/register.html',
      ];


      function toggleMenuModal(templateIndex){
        $scope.state.view = tbViews[templateIndex];
      }


      function removeActive(){
        let $navSections =  $element[0].querySelectorAll('.active');
        $navSections.forEach((section) => {
          section.classList.remove('active');
        });
      };


       function setActive(e){
         removeActive();
         e.target.classList.add('active');
       };

    }]  //End Controller
  }
});
