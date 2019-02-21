
overlayApp.directive('editable', function() {
  return {
    template: '<div class="editable editableTarget">{{obj[prop]}}</div>',
    restrict: 'E',
    scope: {
      type: '@',
      obj: '=',
      prop: '@'
    },
    controller: ['$scope', '$element', '$compile', function editableController($scope, $element, $compile){
      if(!$scope.type || !$scope.obj || !$scope.prop){
        throw new Error(`This directive requires an object referece and a property.\n$scope.type: ${$scope.type}, $scope.object: ${$scope.obj}, $scope.prop: ${$scope.prop}`);
      }


      let modal = $compile(`<edit-box type="type" value="obj[prop]" callback="setValue(value)"/>`)($scope);
      let $modal = modal[0];
      // let $target = $element[0].querySelector('.editableTarget');

      $scope.showModal = function(){
        console.log("Showing Modal from editable", $modal);
        $element.off('click', $scope.showModal);
        document.body.append($modal);
        $scope.$apply();
      }


      $scope.setValue = function(newValue){
        console.log("New value:", newValue);

        modal.detach();
        $element.on('click', $scope.showModal);

        if(newValue){
          $scope.obj[$scope.prop] = newValue;
        }
      };

      $element.on('click', $scope.showModal);

    }]  //End controller
  }
})

.directive('editBox', function(){
  return {
    templateUrl: './directives/editable/editableModal.html',
    restrict: 'E',
    scope: {
      value: '<',
      callback: '&',
      type: '<'
    },
    controller: ['$scope', function($scope){

      let options = {
        number: [
          {
            display: '+5',
            action: function(){ $scope.valueOut = Number.parseInt($scope.valueOut) + 5; }
          },
          {
            display: '+1',
            action: function(){ $scope.valueOut = Number.parseInt($scope.valueOut) + 1; }
          },
          {
            display: '-1',
            action: function(){ $scope.valueOut = Number.parseInt($scope.valueOut) - 1; }
          },
          {
            display: '-5',
            action: function(){ $scope.valueOut = Number.parseInt($scope.valueOut) - 5; }
          }
        ],
        text: [
          {
            display: 'To Upper',
            action: function(){ $scope.valueOut = $scope.valueOut.toString().toUpperCase(); }
          },
          {
            display: 'To Lower',
            action: function(){ $scope.valueOut = $scope.valueOut.toString().toLowerCase(); }
          }
        ]
      };


      $scope.cb = function(changeVal){
        console.log("Send value?", changeVal, $scope.valueOut);
        if(changeVal){
          $scope.callback({value: $scope.valueOut});
        } else {
          $scope.callback(false);
        }
      }


      if($scope.value === undefined || !$scope.callback){
        throw new Error(`This directive requires a value and a callback.\n$scope.value: ${$scope.value}, $scope.callback: ${$scope.callback}`);
      } else if(!$scope.type || !options[$scope.type]){
        throw new Error(`Type ${$scope.type} is not found in editTextBox's options config.`);
      }

      $scope.options = options[$scope.type];
      $scope.valueOut = $scope.value;


    }]  //End controller
  }
});
