
overlayApp.directive('toolBar', function() {
  return {
    templateUrl: './directives/toolBar/toolBar.html',
    restrict: 'E',
    scope: {
    },
    controllerAs: 'tb',
    controller: ['$element', function($element){

      let tb = this;
      tb.state = {
        open: false
      }

      tb.toggleToolBar = function(){
        let $tb =  $element[0].querySelectorAll('#toolBarHeader')[0];
        let $screen = $element[0].querySelectorAll('#toolBarMenuScreen')[0];

        if($tb.classList.contains('open')){
          tb.state.open = false;
          $tb.classList.remove('open');
          $screen.classList.remove('open');

          $tb.classList.add('closed');
          $screen.classList.add('closed');
        } else {
          tb.state.open = true;
          $tb.classList.add('open');
          $screen.classList.add('open');

          $tb.classList.remove('closed');
          $screen.classList.remove('closed');
        }
      };


      tb.navItems = [
        {display: 'Close', action: tb.toggleToolBar},
        {display: 'Damage All', action: function(){console.log("Clicked");}},
        {display: 'Add/Remove/Reorder Player', action: function(){}},
        {display: 'History', action: function(){}}
      ];


    }]  //End Controller
  }
});
