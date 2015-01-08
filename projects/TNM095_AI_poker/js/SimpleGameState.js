function SimpleGameState(){

}
SimpleGameState.prototype.initFromGameState = function(state, move){
	this.move = move;
	this.bigBlind = state.bigBlind === 1 ? "human" : "ai";	
	this.player = "ai";
	this.playerMoney = {"human": state.player1.money, "ai": state.player2.money};
	this.turn = state.turn;
	this.pot = state.moneyPot;
	this.cardOnHand = [state.player2.cardsOnHand.card1, state.player2.cardsOnHand.card2];
	this.cardsOnTable = [];
	if(state.flop.card1 !== undefined){
		this.cardsOnTable.push(state.flop.card1);
		this.cardsOnTable.push(state.flop.card2);
		this.cardsOnTable.push(state.flop.card3);
	}
	if(state.turnCard.number !== undefined){
		this.cardsOnTable.push(state.turnCard);
	}
	if(state.riverCard.number !== undefined){
		this.cardsOnTable.push(state.riverCard);
	}

	this.availableMoves = jQuery.extend(true, {}, state.availableMoves);
	this.availableMoves.gameEnded = false;
	this.numberOfTimesRaised = state.numberRaised;
	
	this.availableMovesArray = [];
	this.AvailableMovesToArray();
}

SimpleGameState.prototype.initFromSimpleState = function(state){
	this.move = "default";
	this.player = state.player === "human" ? "ai" : "human";
	this.bigBlind = state.bigBlind;
	this.playerMoney = {"human": state.playerMoney.human, "ai": state.playerMoney.ai};
	this.turn = state.turn;
	this.pot = state.pot;
	this.cardOnHand = state.cardOnHand;
	this.cardsOnTable = [];

	for(var i=0; i<state.cardsOnTable.length; ++i){
		this.cardsOnTable.push(state.cardsOnTable[i]);
	}

	//this.availableMoves = jQuery.extend(true, {}, state.availableMoves);

	this.availableMoves = {
		"call": false,
	    "bet": false,
	    "check":false,
	    "raise":false,
	    "fold": false,
	    "gameEnded": false
	};

	this.numberOfTimesRaised = state.numberOfTimesRaised;
	this.availableMovesArray = [];
}

SimpleGameState.prototype.makeMove = function(move){

	var newState = new SimpleGameState();
	newState.initFromSimpleState(this);
	newState.move = move;
	//newState.resetMoves();

	if(move === "check"){
		if(newState.player === this.bigBlind && this.turn === 5){
			newState.availableMoves.gameEnded = true;
		}
		else{
			if(newState.playerMoney.human > 0 && newState.playerMoney.ai > 0){
				newState.availableMoves.bet = true;
			}
	        newState.availableMoves.check = true;
	        
			if(this.move === "check"){
				newState.turn++;	
			}
		}
	}
	else if(move === "fold"){
		newState.availableMoves.gameEnded = true;
		newState.turn = 5;
	}
	else if(move === "raise"){
		if(newState.playerMoney.human > 1 && newState.playerMoney.ai > 1 && newState.numberOfTimesRaised < 6){
			newState.availableMoves.raise = true;
		}
        newState.availableMoves.call = true;
        newState.availableMoves.fold = true;

    	newState.playerMoney[newState.player] -= 2;
    	newState.pot += 2;

		newState.numberOfTimesRaised++;
	}
	else if(move === "bet"){
		if(newState.playerMoney.human > 1 && newState.playerMoney.ai > 1){
			newState.availableMoves.raise = true;
		}
        newState.availableMoves.call = true;
        newState.availableMoves.fold = true;

        newState.playerMoney[newState.player] -= 1;
        newState.pot += 1;
	}
	else if(move === "call"){
		newState.playerMoney[newState.player] -= 1;
        newState.pot += 1;
        
        if(newState.playerMoney.human > 0 && newState.playerMoney.ai > 0){
			newState.availableMoves.bet = true;
		}
        newState.availableMoves.check = true;

        newState.turn++;
	}

	newState.AvailableMovesToArray();

	return newState;
}

SimpleGameState.prototype.resetMoves = function(){
	for(move in this.availableMoves){
		this.availableMoves[move] = false;
	}
}

SimpleGameState.prototype.getAvailableMoves = function(){
	var tmp = [];
	for(move in this.availableMoves){
		if(this.availableMoves[move]){
			tmp.push(move);
		}
	}
	return tmp;
	//return this.availableMovesArray;
}

SimpleGameState.prototype.AvailableMovesToArray = function(){
	for(move in this.availableMoves){
		if(this.availableMoves[move]){
			this.availableMovesArray.push(move);
		}
	}
}

