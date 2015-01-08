function randomVsAi(mode1, mode2){

	var ai = new AI();

	var player1 = {"cardOnHand": [], "money": 100};
	var player2 = {"cardOnHand": [], "money": 100};
	var output = {};
	output[mode1] = 0;
	output[mode2] = 0;
	output["winner"] = 0;

	while(player1.money > 0 && player2.money > 0){
		
		var deck = new Cards();
		deck.shuffle();

		player1.cardOnHand = [deck.getOneCard(), deck.getOneCard()];
		player2.cardOnHand = [deck.getOneCard(), deck.getOneCard()];

		var currentState = new SimpleGameState();
		
		currentState.turn = 1;
		currentState.pot = 0;
		currentState.bigBlind = 1;
		currentState.numberOfTimesRaised = 0;

		currentState.bigBlind = 1;
		currentState.player = "ai";
		
		currentState.playerMoney = {"human": player1.money, "ai": player2.money};
		
		currentState.cardOnHand = player2.cardOnHand;
		currentState.cardsOnTable = [];

		currentState.availableMoves = {
		    "call": false,
		    "bet": true,
		    "check":true,
		    "raise":false,
		    "fold": false
		};

		// Blinds
		if(currentState.bigBlind === 1){
			if(player1.money > 1){
			  currentState.playerMoney.human -= 2;
			  currentState.playerMoney.ai -= 1;
			  currentState.pot += 3;
			}
			else{
			  currentState.playerMoney.human -= 1;
			  currentState.playerMoney.ai -= 1;
			  currentState.pot += 2;
			}
		}
		else{
			if(player2.money > 1){
			  currentState.playerMoney.ai -= 2;
			  currentState.playerMoney.human -= 1;
			  currentState.pot += 3;
			}
			else{
			  currentState.playerMoney.human -= 1;
			  currentState.playerMoney.ai -= 1;
			  currentState.pot += 2;
			}
		}

		// Start round
		var turnIndicator = currentState.turn;
		var nextMove;
		
		while(currentState.turn < 5){
			
			if(currentState.player === "ai"){
				
				if(mode2 === "handStrength"){
					var tree = new searchTree(currentState);
					useHandStrength = true;
					nextMove = tree.simulate();
				}
				else if(mode2 === "EHS"){
					nextMove = EHSagent(currentState);
				}
				else if(mode2 === "montecarlo"){
					var tree = new searchTree(currentState);
		    		useHandStrength = false;
					nextMove = tree.simulate();
				}
				else{
					var availableMoves = currentState.getAvailableMoves();
		    		var index = Math.floor(Math.random() * availableMoves.length);
		    		nextMove = availableMoves[index];
				}
			}
			else{
				if(mode1 === "handStrength"){
					var tree = new searchTree(currentState);
					useHandStrength = true;
					nextMove = tree.simulate();
				}
				else if(mode1 === "EHS"){
					nextMove = EHSagent(currentState);
				}
				else if(mode1 === "montecarlo"){
					var tree = new searchTree(currentState);
		    		useHandStrength = false;
					nextMove = tree.simulate();
				}
				else{
					var availableMoves = currentState.getAvailableMoves();
		    		var index = Math.floor(Math.random() * availableMoves.length);
		    		nextMove = availableMoves[index];
				}
			}

			if(nextMove === "fold"){
				break;
			}

	    	currentState = currentState.makeMove(nextMove);

	    	if(currentState.turn > turnIndicator){
	    		if(currentState.turn === 2){
	    			currentState.cardsOnTable[0] = deck.getOneCard();
	    			currentState.cardsOnTable[1] = deck.getOneCard();
	    			currentState.cardsOnTable[2] = deck.getOneCard();
	    		}
	    		else if(currentState.turn === 3){
	    			currentState.cardsOnTable[3] = deck.getOneCard();
	    		}
	    		else if(currentState.turn === 4){
	    			currentState.cardsOnTable[4] = deck.getOneCard();
	    		}
	    		turnIndicator = currentState.turn;
	    	}
		}

		player1.money = currentState.playerMoney.human;
		player2.money = currentState.playerMoney.ai;
		// Showdown
		if(nextMove !== "fold"){
			
			var res1 = rankHand(player2.cardOnHand.concat(currentState.cardsOnTable));
			var res2 = rankHand(player1.cardOnHand.concat(currentState.cardsOnTable));

			if(res1.primeScore === res2.primeScore){
				if(res1.secondaryScore > res2.secondaryScore){
				   output[mode2]++;

				   player2.money += currentState.pot;
				}
				else if(res1.secondaryScore === res2.secondaryScore) {
				  player1.money += Math.ceil(currentState.pot/2);
				  player2.money += Math.floor(currentState.pot/2);
				}
				else{
					output[mode1]++;

				    player1.money += currentState.pot;
				}
			}
			else if (res1.primeScore > res2.primeScore){
				output[mode2]++;

				player2.money += currentState.pot;
			}
			else{
				output[mode1]++;

				player1.money += currentState.pot;
			}
		}
		// Someone folded
		else{
			if(currentState.player === "ai"){
				output[mode1]++;

				player1.money += currentState.pot;
			}
			else{
				output[mode2]++;

				player2.money += currentState.pot;
			}
		}
		console.log(player1.money, player2.money);
		//console.log("end of turn");
	}
	
	output.winner = player2.money > player1.money ? 2 : 1;

	return output;
}