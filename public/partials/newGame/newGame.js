
const database = firebase.database();
const idGen = idGenerator();


myApp.controller('newGameController', ['$scope', 'NewGameService', function($scope, NewGameService){

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

    let gamePromise = writeGameData($scope.players);
    gamePromise.then(function(gID){
      try {
        NewGameService.joinGame(gID);
        $scope.alert = false;
      } catch (error) {
        $scope.alertMessage = `joinGame failed:\n${error}`;
        $scope.alert = true;
      }
    }, function(error){
      $scope.alertMessage = `Something went wrong!  Please try again.\n${error.message}`;
      $scope.alert = true;
    });
  };  //End startMatch


  $scope.removePlayer = function(index){
    $scope.players.splice(index, 1);
  }


}]);


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
function writeGameData(playersData){
  const gameDBRef = database.ref('games/');
  let newGame = gameDBRef.push();
  let gameID = newGame.key;
  const gameData = {
    id: gameID,
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


  console.log(`Creating game with id: ${gameID}`);


  return new Promise( (resolve, reject) => {
    newGame.set(gameData, function(error){
      if(error){
        //Fail
        console.log(gameID);
        reject(`Firebase error.\n${error}`);
      } else {
        //Success!
        resolve(gameID);
      }
    });
  });
} //End writeGameData
