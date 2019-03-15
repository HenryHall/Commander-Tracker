
myApp.controller('newGameController', ['$scope', 'NewGameService', function($scope, NewGameService){
  const idGen = idGenerator();
  const startingPlayerCount = 2;
  const minPlayers = 2;
  const maxPlayers = 5;

  $scope.alert = false;
  $scope.alertMessage = undefined;
  $scope.players = [];
  $scope.addPlayer = addPlayer;
  $scope.removePlayer = removePlayer;
  $scope.startMatch = startMatch;

  init();
  function init(){
    for(var i = 0; i < startingPlayerCount; i++){
      addPlayer();
    }
  }


  function addPlayer(){
    if($scope.players.length >= maxPlayers){ return; }
    let newPlayer = new Player($scope.players.length + 1);
    $scope.players.push(newPlayer);
    $scope.alertMessage = "";
    $scope.alert = false;
  }


  function removePlayer(){
    if($scope.players.length <= minPlayers){ return; }
    $scope.players.pop();
    $scope.alertMessage = "";
    $scope.alert = false;
  }


  function startMatch(){
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


  //Used to set unique player ids
  function* idGenerator(){
    let i = 0;
    while(true){
      yield i++;
    }
  }


  function Player(playerNumber){
    return {
      id: idGen.next().value,
      name: `Player ${playerNumber}`,
      commander: `Commander ${playerNumber}`,
      life: 40
    }
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
