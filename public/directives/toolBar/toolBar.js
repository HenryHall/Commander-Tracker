
overlayApp.directive('toolBar', function() {
  return {
    templateUrl: './directives/toolBar/toolBar.html',
    restrict: 'E',
    scope: {
    },
    controllerAs: 'tb',
    controller: ['$scope', '$element', 'DBService', function($scope, $element, DBService){

      let tb = this;

      tb.playerData = undefined;
      tb.state = {
        open: false,
        view: undefined
      }

      tb.toggleToolBar = toggleToolBar;
      tb.setActive = setActive;
      tb.toggleMenuModal = toggleMenuModal;

      init();
      function init(){
        DBService.getPlayerData().then((playerPromises) => {
          Promise.all(playerPromises).then((loadedPlayerData) => {
            let bindingPromises = [];
            tb.playerData = loadedPlayerData;

            tb.playerData.forEach((player, index) => {
              console.log("Breaks Here");
              //See:
              //https://stackoverflow.com/questions/27367289/firebase-3-way-data-binding-with-controlleras-syntax
              let playerBind = player.$bindTo(tb, `playerData[${index}]`);
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
          tb.state.open = false;
          tb.state.view = undefined;  //Unload modal partial
          removeActive();  //Remove active class on selected toolBarHeader

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
        './directives/toolBar/partials/register.html',
        './directives/toolBar/partials/massModify.html',
        './directives/toolBar/partials/playerSettings.html',
        './directives/toolBar/partials/history.html',
        './directives/toolBar/partials/reset.html',
      ];


      function toggleMenuModal(templateIndex){
        tb.state.view = tbViews[templateIndex];
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


      tb.navItems = [
        {display: 'Close', action: tb.toggleToolBar},
        {display: 'Register', action: function(e){ toggleMenuModal(0); setActive(e); }},
        {display: 'Mass Modify', action: function(e){ toggleMenuModal(1); setActive(e); }},
        {display: 'Player Settings', action: function(e){ toggleMenuModal(2); setActive(e); }},
        {display: 'History', action: function(e){ toggleMenuModal(3); setActive(e); }},
        {display: 'Reset', action: function(e){ toggleMenuModal(4); setActive(e); }}
      ];
    // End toolBarHeader Section

    //Start registerModal Controller
      // Init
      let registerScope = {};
      tb.registerScope = registerScope;

      registerScope.register = function(){
        let username = tb.registerScope.usernameEntry;
        console.log(`Trying to register as ${username}.`);
        DBService.register(username).then(() => {
          console.log(`Thanks for registering to this game.`);
        }, function(error) {
          console.log("Something when wrong while trying to register!");
        });
      }
    //End registerModalController


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
            let player = tb.playerData.players.find((p) => {return p.id === parseInt(playerID);});
            player.life += (massModify.value * (massModify.operator.type === '+' ? 1 : -1));
          }
        }

        toggleToolBar();
      };


    // End massModifyModal Section


    // Start resetModal Section

    let resetModal = {};
    tb.resetModal = resetModal;

    resetModal.reset = function(){
      tb.playerData.players.forEach((player) => {
        player.castCount = 0;
        player.life = 40;
        player.damage.forEach((opponent) => {
          opponent.damage = 0;
        });
      });

      toggleToolBar();
    };


    resetModal.cancel = function(){
      toggleToolBar();
    };

    //End resetModal Section

    }]  //End Controller
  }
});
