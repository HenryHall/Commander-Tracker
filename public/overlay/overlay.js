
const overlayApp = angular.module('overlayApp', ['firebase']);


overlayApp.config(['$locationProvider', function($locationProvider){
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);


overlayApp.controller('mainController', ['$scope', '$window', '$location', 'DBService', function($scope, $window, $location, DBService){

  let init = function(){
    //Ensure data loads, bind it
    DBService.getPlayerData().then((playerPromises) => {
      Promise.all(playerPromises).then((loadedPlayerData) => {
        let bindingPromises = [];
        $scope.playerData = loadedPlayerData;

        $scope.playerData.forEach((player, index) => {
          let playerBind = player.$bindTo($scope, `playerData[${index}]`);
          bindingPromises.push(playerBind);
        });

        return Promise.all(bindingPromises);
      })
      .then(() => {
        $scope.$apply();
        $scope.setStyles();
        $window.addEventListener('resize', () => {$scope.setStyles(); $scope.$apply();} );
      })
      .catch((error) => {
        console.log("Something when wrong while loading player data!");
        console.log(error);
      });
    }); //End player data loading and binding
  } //End init


  $scope.setStyles = function(){
    let playerCount = $scope.playerData.length;

    const cardHeightPercent = 100 / playerCount; //Individual player info card %vh
    $scope.playerStyle = new Array(playerCount);

    const colors = [
      {border: '#1a237e', background: '#3d5afe'},
      {border: '#9a0007', background: '#d32f2f'},
      {border: '#005005', background: '#2e7d32'},
      {border: '#790e8b', background: '#ab47bc'},
      {border: '#b1bfca', background: '#e3f2fd'},
      {border: '#cabf45', background: '#fff176'}
    ];

    for(let i=0; i<playerCount; i++){
      $scope.playerStyle[i] = {
        height: cardHeightPercent + 'vh',
        border: '8px solid ' + colors[i].border,
        "background-color": colors[i].background
      };
      //Try to get commander image for each player, use fallback if it cannot be found
      // let commanderName = $scope.playerData[i].commander;
      //
      // DBService.getImageURL(commanderName).then((imgUrl) => {
      //   // $scope.playerStyle[i].backgroundImage = `url(${imgUrl})`;
      //   // $scope.playerStyle[i].backgroundSize = '100%';
      //   // $scope.playerStyle[i].backgroundPosition = 'center top';
      //   $scope.playerStyle[i].commanderStyle = {
      //     height: '100%',
      //     "background": `no-repeat top center/100% url(${imgUrl})`
      //   }
      // })
      // .catch((error) => {
      //   console.log(error);
      //   console.log(`Could not set commander image for ${commanderName}.  Using fallback`);
      // });
    }
  }; //End setStyles


  $scope.applyLifeChange = function(playerIndex, lifeChange){
    $scope.playerData[playerIndex].life += lifeChange;
  };


  $scope.applyCastChange = function(playerIndex, castChange){
    $scope.playerData[playerIndex].castCount += castChange;
  };


  $scope.getNameByID = function(id){
    let player = $scope.playerData.find((p) => { return p.id == id ? true : false; });
    return player.name;
  };


  $scope.incrimentTestPlayer = function(playerIndex){
    console.log(`${playerIndex} from incrimentTestPlayer.`);
    console.log(`${$scope.playerData[playerIndex]}`);
    console.log(`Before: ${$scope.playerData[playerIndex].life}`);
    $scope.playerData[playerIndex].life++;
    console.log(`After: ${$scope.playerData[playerIndex].life}`);
  }

  //Init
  init();
}]);
