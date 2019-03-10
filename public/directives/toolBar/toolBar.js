
overlayApp.directive('toolBar', function() {
  return {
    templateUrl: './directives/toolBar/toolBar.html',
    restrict: 'E',
    scope: {
    },
    controllerAs: 'tb',
    controller: ['$scope', '$element', 'DBService', function($scope, $element, DBService){

      let tb = this;

      tb.gameData = undefined;
      tb.state = {
        open: false,
        view: undefined
      }

      init();
      function init(){
        //Ensure data loads, bind it
        DBService.getGameData().$loaded().then((data) => {
          // console.log(data);
          data.$bindTo($scope, 'tb.gameData').then(() => {
            //Things after data is ready
          });
        }).catch((error) => {
          throw new Error(error);
        });
      }



    // Start toolBarHeader Section
      tb.toggleToolBar = function(){
        let $tb =  $element[0].querySelectorAll('#toolBarHeader')[0];
        let $screen = $element[0].querySelectorAll('#toolBarMenuScreen')[0];

        if($tb.classList.contains('open')){
          //Was open, set to closed
          tb.state.open = false;
          tb.state.view = undefined;  //Unload modal partial
          tb.removeActive();  //Remove active class on selected toolBarHeader

          $tb.classList.remove('open');
          $screen.classList.remove('open');

          $tb.classList.add('closed');
          $screen.classList.add('closed');
        } else {
          //Was closed, set to open
          tb.state.open = true;

          $tb.classList.add('open');
          $screen.classList.add('open');

          $tb.classList.remove('closed');
          $screen.classList.remove('closed');
        }
      };


      let tbViews = [
        './directives/toolBar/partials/massModify.html',
        './directives/toolBar/partials/playerSettings.html',
        './directives/toolBar/partials/history.html'
      ];
      tb.toggleMenuModal = function(templateIndex){
        tb.state.view = tbViews[templateIndex];
      }


      tb.removeActive = function(){
        let $navSections =  $element[0].querySelectorAll('.active');
        $navSections.forEach((section) => {
          section.classList.remove('active');
        });
      };


       tb.setActive = function(e){
         tb.removeActive();
         e.target.classList.add('active');
       };


      tb.navItems = [
        {display: 'Close', action: tb.toggleToolBar},
        {display: 'Mass Modify', action: function(e){ tb.toggleMenuModal(0); tb.setActive(e); }},
        {display: 'Player Settings', action: function(e){ tb.toggleMenuModal(1); tb.setActive(e); }},
        {display: 'History', action: function(e){ tb.toggleMenuModal(2); tb.setActive(e); }}
      ];
    // End toolBarHeader Section

    // Start massModifyModal Section

      //Init
      let massModify = {};
      tb.massModify = massModify;
      massModify.operator = {type: '-'};  //Initialize value
      massModify.selected = {};

      massModify.modify = function(){
        for(playerID in massModify.selected){
          if(massModify.selected[playerID]){
            //Is checked
            let player = tb.gameData.players.find((p) => {return p.id === parseInt(playerID);});
            player.life += (massModify.value * (massModify.operator.type === '+' ? 1 : -1));
          }
        }

        tb.toggleToolBar();
      };


    // End massModifyModal Section

    }]  //End Controller
  }
});
