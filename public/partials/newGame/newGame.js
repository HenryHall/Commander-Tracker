
myApp.controller('newGameController', ['$scope', 'NewGameService', function($scope, NewGameService){
  const idGen = idGenerator();

  $scope.alert = false;
  $scope.alertMessage = undefined;
  $scope.players = [];
  $scope.player = {};


  $scope.addPlayer = function(){
    if( ($scope.player.name == '' || !$scope.player.name) || ($scope.player.commander == '' || !$scope.player.commander) ){
      $scope.alertMessage = "Enter values for each field!";
      $scope.alert = true;
      return;
    } else if($scope.players.some((player) => {return player.name == $scope.player.name})) {
      $scope.alertMessage = "Players must have a unique name!";
      $scope.alert = true;
      return;
    }

    let player = new Player($scope.player.name, $scope.player.commander);
    $scope.players.push(player);
    $scope.player = {};
    $scope.alertMessage = "";
    $scope.alert = false;
  };  //End addPlayer


  $scope.startMatch = function(){
    if($scope.players.length < 2){
      $scope.alertMessage = "There must be at least two players to start a match!";
      $scope.alert = true;
      return;
    }

    NewGameService.getUserData()
      .then(NewGameService.createGame)
      .then((gameKey) => {
        let gameData = createGameData($scope.players, gameKey);
        return NewGameService.setGameData(gameData, gameKey);
      })
      .then(NewGameService.joinGame)
      //Leave page for overlay
      .catch((error) => {
        console.error(`Something went wrong.\n${error}`);
      });
  };  //End startMatch


  $scope.removePlayer = function(index){
    $scope.players.splice(index, 1);
  }

  //Used to set unique player ids
  function* idGenerator(){
    let i = 0;
    while(true){
      yield i++;
    }
  }


  function Player(name, commander){
    this.id = idGen.next().value;
    this.name = name;
    this.commander = commander;
    this.life = 40;
  }


  //Adds gameData to Firebase and returns new promise that resolves gameID
  function createGameData(playersData, gameKey){
    const gameData = {
      id: gameKey,
      date: Date.now().toString(),
      players: []
    };

    //Create gameData
    playersData.forEach( (player) => {
      //Set damage object
      let opponentsData = playersData.filter((p) => {return p.id == player.id ? false : true;});
      let opponentsArr = opponentsData.map((opponent) => {return {id: opponent.id, damage: 0}; });
      player.damage = opponentsArr;

      //Map to gameData
      gameData.players.push({
        id: player.id,
        name: player.name,
        commander: player.commander,
        life: player.life,
        castCount: 0,
        damage: player.damage
      });
    });

    return gameData;
  } //End createGameData


}]);
