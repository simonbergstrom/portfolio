//The main file for the game logic.

function GameState(){
  removeCards();

  this.player1 = { //Player
    name : "Player",
    cardsOnHand : {},
    money : 20
  };
  this.player2 = { //Computer
    name : "Computer",
    cardsOnHand : {},
    money : 20
  };

  //The cards on the table
  this.flop = {};
  this.turnCard = {};
  this.riverCard = {};

  //this.aiPlayer = {};

  this.deckOfCards = new Cards();

  //Moves available first round
  this.availableMoves = {
    "call": false,
    "bet": true,
    "check":true,
    "raise":false,
    "fold": false
  };

  this.turn = 1;
  this.moneyPot = 0;
  //this.bigBlind = Math.floor((Math.random() * 2) + 1);
  this.bigBlind = 1;
  this.numberRaised = 0;

  $("#enemyLog").html("");

  this.updateScoreUi();

  this.startNewRound();
}

GameState.prototype.updateScoreUi = function(){
  $("#playerScore").html(this.player1.money);
  $("#computerScore").html(this.player2.money);
  $("#tableScore").html(this.moneyPot);
};

//Static roundCounter
GameState.roundCounter = 0;

//Getters
GameState.prototype.getHumanPlayerCards = function(){
  return this.player1.cardsOnHand;
};

GameState.prototype.getHumanPlayer = function(){
  return this.player1;
}

GameState.prototype.doMove = function(player, move){
  var validMoves = this.getAvailableMoves();
  if(validMoves[move]){
    this.moveHelper(player, move);
  }
  else{
    console.log("Invalid Move");
  }
};

GameState.prototype.startNewRound = function(){
  this.numberRaised = 0;

  switch(this.turn){
    case 1:{
      this.deckOfCards.shuffle();

      $("#enemyLog").append("Round 1! <br/>");
      //Give the players their cards.
      this.player1.cardsOnHand = this.deckOfCards.getPocket();
      drawCard("player1_card1", this.player1.cardsOnHand.card1);
      drawCard("player1_card2", this.player1.cardsOnHand.card2);

      this.player2.cardsOnHand = this.deckOfCards.getPocket();
      drawCard("player2_card1", {suit: "Secret", number: ""});
      drawCard("player2_card2", {suit: "Secret", number: ""});
      //drawCard("player2_card1", this.player2.cardsOnHand.card1);
      //drawCard("player2_card2", this.player2.cardsOnHand.card2);

      if(this.bigBlind === 1){
        if(this.player1.money > 1){
          this.player1.money -= 2;
          this.player2.money -= 1;
          this.moneyPot += 3;
        }
        else{
          this.player1.money -= 1;
          this.player2.money -= 1;
          this.moneyPot += 2;
        }
      }
      else{
        if(this.player2.money > 1){
          this.player2.money -= 2;
          this.player1.money -= 1;
          this.moneyPot += 3;
        }
        else{
          this.player1.money -= 1;
          this.player2.money -= 1;
          this.moneyPot += 2;
        }
      }

      this.updateScoreUi();

      break;
    }
    case 2:{
      $("#enemyLog").append("Round 2! <br/>");
      this.flop = this.deckOfCards.getFlop();
      drawCard("dealer_card1", this.flop.card1);
      drawCard("dealer_card2", this.flop.card2);
      drawCard("dealer_card3", this.flop.card3);
      break;
    }
    case 3:{
      $("#enemyLog").append("Round 3! <br/>");
      this.turnCard = this.deckOfCards.getOneCard();
      drawCard("dealer_card4", this.turnCard);
      break;
    }
    case 4:{
      $("#enemyLog").append("Round 4! <br/>");
      this.riverCard = this.deckOfCards.getOneCard();
      drawCard("dealer_card5", this.riverCard);
      break;
    }
    case 5:{
      this.availableMoves.call = false;
      this.availableMoves.bet = false;
      this.availableMoves.check = false;
      this.availableMoves.raise = false;
      this.availableMoves.fold = false;

      this.updateButtons();

      $("#enemyLog").append("Showdown! <br/>");
      var cardstoEvalplayer1 = [gameState.player1.cardsOnHand.card1,gameState.player1.cardsOnHand.card2,this.flop.card1,this.flop.card2,this.flop.card3,this.turnCard,this.riverCard];
      var cardstoEvalplayer2 = [gameState.player2.cardsOnHand.card1,gameState.player2.cardsOnHand.card2,this.flop.card1,this.flop.card2,this.flop.card3,this.turnCard,this.riverCard];


      var res1 = rankHand(cardstoEvalplayer1);
      var res2 = rankHand(cardstoEvalplayer2);

      console.log("The resulting hands: ",res1,res2);


      if(res1.primeScore == res2.primeScore){
        if(res1.secondaryScore > res2.secondaryScore){
          $("#enemyLog").append("Player wins with a "+res1.type+"! <br/>");
          this.player1.money += this.moneyPot;
        }
        else if(res1.secondaryScore == res2.secondaryScore) {
          $("#enemyLog").append("We have a tie! <br/>");
          this.player1.money += Math.ceil(this.moneyPot/2);
          this.player2.money += Math.floor(this.moneyPot/2);
        }
        else{
            $("#enemyLog").append("Computer wins! with a "+ res2.type +"! <br/> ");
            this.player2.money += this.moneyPot;
        }
      }
      else if (res1.primeScore > res2.primeScore){
        $("#enemyLog").append("Player wins with a "+res1.type+"! <br/>");
        this.player1.money += this.moneyPot;
      }
      else{
        $("#enemyLog").append("Computer wins with a "+res2.type+"! <br/>");
        this.player2.money += this.moneyPot;
      }

      // Display the cards of the AI
      scene.getObjectByName("player2_card1").material.materials[2].map = textureArray[this.player2.cardsOnHand.card1.suit + this.player2.cardsOnHand.card1.number];
      scene.getObjectByName("player2_card2").material.materials[2].map = textureArray[this.player2.cardsOnHand.card2.suit + this.player2.cardsOnHand.card2.number];

      var self = this;
      setTimeout(function(){
        self.resetTurn();
      }, 7000);
    }
  }

  if(this.turn !== 5){
    this.availableMoves.call  = false;
    this.availableMoves.check = true;
    this.availableMoves.bet   = false;
    this.availableMoves.raise = false;
    this.availableMoves.fold  = false;

    if(this.player2.money > 0 && this.player1.money > 0){
      this.availableMoves.bet = true;
    }

    if(this.bigBlind === 1){
      this.enemyMakeAiMove("firstMove");
      //this.enemyMakeRandomMove();
    }
    else{
      this.updateButtons();
    }
  }
};

GameState.prototype.resetTurn = function(){
  // Reset variables
  this.turn = 1;
  this.moneyPot = 0;

  // Update the ui with the result
  this.updateScoreUi();

  if(this.player1.money < 1 || this.player2.money < 1){
    return;
  }

  if(this.bigBlind === 1){
    this.bigBlind = 2;
  }
  else{
    this.bigBlind = 1;
  }
  $("#enemyLog").html("");
  removeCards();
  this.startNewRound();
}

//All the moves the players can do.
GameState.prototype.call = function(player){
  this.moneyPot++;
  player.money--;

  this.updateScoreUi();

  if(player.name === "Computer"){
    $("#enemyLog").append(player.name + " called <br/>");
  }

  this.turn++;
  this.startNewRound();
}

GameState.prototype.bet = function(player){
  player.money--;
  this.moneyPot++;

  this.updateScoreUi();

  if(player.money > 1){
    this.availableMoves.raise = true;
  }
  else{
    this.availableMoves.raise = false;
  }

  this.availableMoves.call = true;
  this.availableMoves.bet = false;
  this.availableMoves.check = false;
  this.availableMoves.fold = true;

  if(player.name === "Computer"){
    $("#enemyLog").append(player.name + " made a bet <br/>");
  }
}

GameState.prototype.check = function(player){

  if(this.otherPlayer(player).money > 0){
    this.availableMoves.bet = true;
  }
  else{
    this.availableMoves.bet = false;
  }

  this.availableMoves.call = false;
  this.availableMoves.check = true;
  this.availableMoves.raise = false;
  this.availableMoves.fold = false;

  //Nothing else do be done really. When checking?
  if(player.name === "Computer"){
    $("#enemyLog").append(player.name + " checked <br/>");
  }

  if((this.bigBlind === 2 && player.name === "Computer") || (this.bigBlind === 1 && player.name === "Player")){
    this.turn++;
    this.startNewRound();
  }
};

GameState.prototype.raise = function(player){
  player.money -= 2;
  this.moneyPot += 2;

  this.updateScoreUi();

  if(player.money > 1){
    this.availableMoves.raise = true;
  }
  else{
    this.availableMoves.raise = false;
  }

  this.availableMoves.call = true;
  this.availableMoves.bet = false;
  this.availableMoves.check = false;
  this.availableMoves.fold = true;

  if(player.name === "Computer"){
    $("#enemyLog").append(player.name + " raised! <br/>");
  }

  this.numberRaised++;
  if(this.numberRaised === 6){
    this.turn++;
    this.startNewRound();
  }
};

GameState.prototype.fold = function(player){
  if(player.name === "Computer"){
    this.player1.money += this.moneyPot;
  }
  else{
    this.player2.money += this.moneyPot;
  }
  this.moneyPot = 0;
  this.updateScoreUi();

  if(player.name === "Computer"){
    $("#enemyLog").append(player.name + " folded! <br/>");
  }

  this.availableMoves.raise = false;
  this.availableMoves.call  = false;
  this.availableMoves.bet   = false;
  this.availableMoves.check = false;
  this.availableMoves.fold  = false;

  $("button").each(function(){
    if($(this).attr("id") !== "startButton"){
      $(this).addClass("button-disabled");
      $(this).attr("disabled", true);
    }
  });

  var self = this;
  setTimeout(function(){
    self.resetTurn();
  }, 7000);
};

GameState.prototype.enemyMakeRandomMove = function(){
  //Generate random number between 1 and 5.
  while(true){ //Dangerous while true!
    var randomMove = Math.floor((Math.random() * 5) + 1);
    var availableMoves = this.getAvailableMoves();
    var computerMove;

    if(randomMove === 1){
      computerMove = "call";
    }
    else if(randomMove === 2){
      computerMove = "bet";
    }
    else if(randomMove === 3){
      computerMove = "check";
    }
    else if(randomMove === 4){
      computerMove = "raise";
    }
    else if(randomMove === 5){
      computerMove = "fold";
    }
    computerMove = "check";
    if(availableMoves[computerMove]){
      this.doMove(this.player2, computerMove);
      this.updateButtons();
      break;
    }
  }
};

GameState.prototype.enemyMakeAiMove = function(move){
  var self = this;

  $("#loading").show();

  var wait = function(){
    self.doMove(self.player2, aiPlayer.findBestMove(self, move));
    self.updateButtons();
    $("#loading").hide();
  }

  setTimeout(wait, 200);

};

GameState.prototype.otherPlayer = function(player){
  if(player.name === "Computer"){
    return this.player1;
  }
  else{
    return this.player2;
  }
}

GameState.prototype.updateButtons = function(){
  if(this.availableMoves.call){
    $("#callButton").removeClass("button-disabled");
    $("#callButton").attr("disabled", false);
  }
  else{
    $("#callButton").addClass("button-disabled");
    $("#callButton").attr("disabled", true);
  }

  if(this.availableMoves.bet){
    $("#betButton").removeClass("button-disabled");
    $("#betButton").attr("disabled", false);
  }
  else{
    $("#betButton").addClass("button-disabled");
    $("#betButton").attr("disabled", true);
  }

  if(this.availableMoves.check){
    $("#checkButton").removeClass("button-disabled");
    $("#checkButton").attr("disabled", false);
  }
  else{
    $("#checkButton").addClass("button-disabled");
    $("#checkButton").attr("disabled", true);
  }

  if(this.availableMoves.raise){
    $("#raiseButton").removeClass("button-disabled");
    $("#raiseButton").attr("disabled", false);
  }
  else{
    $("#raiseButton").addClass("button-disabled");
    $("#raiseButton").attr("disabled", true);
  }

  if(this.availableMoves.fold){
    $("#foldButton").removeClass("button-disabled");
    $("#foldButton").attr("disabled", false);
  }
  else{
    $("#foldButton").addClass("button-disabled");
    $("#foldButton").attr("disabled", true);
  }
};

GameState.prototype.getAvailableMoves = function(){
  var res = {};
  for(var key in this.availableMoves){
    if(this.availableMoves[key]){
      res[key] = this.availableMoves[key];
    }
  }
  return res;
};

GameState.prototype.moveHelper = function(player, move){
  if(move === "call"){
    this.call(player);
  }
  else if(move === "bet"){
    this.bet(player);
  }
  else if(move === "check"){
    this.check(player);
  }
  else if(move === "raise"){
    this.raise(player);
  }
  else if(move === "fold"){
    this.fold(player);
  }
};
