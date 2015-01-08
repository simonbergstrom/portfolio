// Functonality for the poker agent runned by a monte carlo search
function AI(){
	var humanOpponentActions = {};

	var bucket = [[4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1],
				  [3, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 0],
				  [3, 3, 4, 3, 2, 2, 1, 0, 0, 0, 0, 0, 0],
				  [3, 3, 2, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0],
				  [2, 2, 2, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0],
				  [2, 2, 1, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0],
				  [1, 1, 0, 0, 0, 1, 3, 1, 1, 0, 0, 0, 0],
				  [1, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
				  [0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0],
				  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
				  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
				  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
				  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]];
}

AI.prototype.findBestMove = function(state, move){
	var simpleState = new SimpleGameState();
	simpleState.initFromGameState(state, move);
	var tree = new searchTree(simpleState);
	//tree.traverse();
	return tree.simulate();
}

function HandStrength(ourcards,boardcards){
	var ahead=0,tied=0,behind=0,ourrank,opprank;

	//Rank the hand with function in evalPokerHand
	if(typeof boardcards.turnCard === 'undefined'){
		ourrank = rankHand([ourcards.card1,ourcards.card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3]);
	}
	else if (typeof boardcards.riverCard === 'undefined'){
		ourrank = rankHand([ourcards.card1,ourcards.card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3,boardcards.turnCard]);
	}
	else {
		ourrank = rankHand([ourcards.card1,ourcards.card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3,boardcards.turnCard,boardcards.riverCard]);
	}

	var oppCards = simulateOppCards(ourcards,boardcards);

	for(var i in oppCards) {

		if(typeof boardcards.turnCard === 'undefined'){
			opprank = rankHand([oppCards[i].card1,oppCards[i].card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3]);
		}
		else if (typeof boardcards.riverCard === 'undefined'){
			opprank = rankHand([oppCards[i].card1,oppCards[i].card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3,boardcards.turnCard]);
		}
		else {
			opprank = rankHand([oppCards[i].card1,oppCards[i].card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3,boardcards.turnCard,boardcards.riverCard]);
		}


		if(ourrank.primeScore === opprank.primeScore){

			if(ourrank.secondaryScore > opprank.secondaryScore){
				ahead++;
			}
			else if(ourrank.secondaryScore < opprank.secondaryScore){
				behind++;
			}
			else
				tied++;
		}
		else if (ourrank.primeScore > opprank.primeScore){
			ahead++;
		}
		else
			behind++;
	}

	return (ahead + tied/2)/(ahead + tied + behind);

}

function simulateOppCards(playerCards, boardCards){

	var oppCards = [];

	var deck = new Cards();
	//deck.shuffle();

	// Remove the cards that is already on table to simulate the possible cards for the opponent...
	deck.removePossibleCards2([playerCards.card1,playerCards.card2]);

	deck.removePossibleCards2([boardCards.flop.card1, boardCards.flop.card2, boardCards.flop.card3]);

	if(typeof boardCards.turnCard !== "undefined"){
		deck.removePossibleCards2([boardCards.turnCard]);
	}
	if(typeof boardCards.riverCard !== "undefined"){
		deck.removePossibleCards2([boardCards.riverCard]);
	}

	// Save all possible two combination of cards for the opponent player....
	for (var i=0; i<deck.cards.length; ++i) {
		for (var j=i+1; j<deck.cards.length; ++j){

			oppCards.push({"card1": deck.whichCard(deck.cards[i]), "card2": deck.whichCard(deck.cards[j])});
		}
	}

	return oppCards;
}

//Simulate cards on table from the flop and forward
function simulateBoards(playerCards, boardCards, oppCards, nrCardsToGet){
	var simulatedCards = [];
	var deck = new Cards();

	deck.removePossibleCards2([playerCards.card1, playerCards.card2]);
	deck.removePossibleCards2([boardCards.flop.card1, boardCards.flop.card2, boardCards.flop.card3]);
	deck.removePossibleCards2([oppCards.card1, oppCards.card2]);

	if(nrCardsToGet === 1){
		for(var i = 0; i < deck.cards.length; ++i){
			simulatedCards.push({"card": deck.whichCard(deck.cards[i])});
		}
	}
	else if(nrCardsToGet === 2){
		for(var i = 0; i < deck.cards.length; ++i){
			for(var j = i+1; j < deck.cards.length; ++j){
				simulatedCards.push({"card1": deck.whichCard(deck.cards[i]), "card2": deck.whichCard(deck.cards[j])});
			}
		}
	}
	return simulatedCards;
}

function HandPotential(ourcards,boardcards){
	console.log("Calculating HandPotential...");
	var HP = [];
	for(var i = 0; i < 3; ++i){
		HP[i] = [];
		HP[i][0] = 0;
		HP[i][1] = 0;
		HP[i][2] = 0;
	}
	console.log(HP);

	var HPTotal = [];
	HPTotal[0] = 0;
	HPTotal[1] = 0;
	HPTotal[2] = 0;

	var ourrank;
	var opprank;
	var behind = 0; var tied = 1; var ahead = 2;
	var index = 0;

	//Rank the hand with function in evalPokerHand
	if(typeof boardcards.turnCard === 'undefined'){
		ourrank = rankHand([ourcards.card1,ourcards.card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3]);
	}
	else if (typeof boardcards.riverCard === 'undefined'){
		ourrank = rankHand([ourcards.card1,ourcards.card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3,boardcards.turnCard]);
	}
	else {
		ourrank = rankHand([ourcards.card1,ourcards.card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3,boardcards.turnCard,boardcards.riverCard]);
	}

	var oppCards = simulateOppCards(ourcards, boardcards);


	for(var i = 0; i < oppCards.length; ++i){
		//Rank the hand with function in evalPokerHand
		if(typeof boardcards.turnCard === 'undefined'){
			opprank = rankHand([oppCards[i].card1,oppCards[i].card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3]);
		}
		else if (typeof boardcards.riverCard === 'undefined'){
			opprank = rankHand([oppCards[i].card1,oppCards[i].card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3,boardcards.turnCard]);
		}
		else {
			opprank = rankHand([oppCards[i].card1,oppCards[i].card2,boardcards.flop.card1,boardcards.flop.card2,boardcards.flop.card3,boardcards.turnCard,boardcards.riverCard]);
		}
		if(ourrank.primeScore === opprank.primeScore){

			if(ourrank.secondaryScore > opprank.secondaryScore){
				index = ahead;
			}
			else if(ourrank.secondaryScore < opprank.secondaryScore){
				index = behind;
			}
			else{
				index = tied;
			}
		}
		else if (ourrank.primeScore > opprank.primeScore){
			index = ahead;
		}
		else{
			index = behind;
		}




 		// Loop through all possible board cards to come.
		//console.log(ourcards)
		var ourBest;
		var oppBest;
		var allPossibleBoards = simulateBoards(ourcards, boardcards, oppCards[i], 2);
 		for(var j = 0; j < allPossibleBoards.length; j+=10){
			HPTotal[index] += 1;
			ourBest = rankHand([ourcards.card1, ourcards.card2, boardcards.flop.card1, boardcards.flop.card2, boardcards.flop.card3, allPossibleBoards[j].card1, allPossibleBoards[j].card2]);
			oppBest = rankHand([oppCards[i].card1, oppCards[i].card2, boardcards.flop.card1, boardcards.flop.card2, boardcards.flop.card3, allPossibleBoards[j].card1, allPossibleBoards[j].card2]);

			if(ourBest.primeScore === oppBest.primeScore){

				if(ourBest.secondaryScore > oppBest.secondaryScore){
					HP[index][ahead]++;
				}
				else if(ourBest.secondaryScore < oppBest.secondaryScore){
					HP[index][behind]++;
				}
				else{
					HP[index][tied]++;
				}
			}
			else if (ourBest.primeScore > oppBest.primeScore){
				HP[index][ahead]++;
			}
			else{
				HP[index][behind]++;
			}
		}
	}
	//End outer for loop
	console.log("HPTotal: ", HPTotal);

	var PPot = (HP[behind][ahead] + HP[behind][tied]/2 + HP[tied][ahead]/2) / (HPTotal[behind]+HPTotal[tied]/2);
	var NPot = (HP[ahead][behind] + HP[tied][behind]/2 + HP[ahead][tied]/2) / (HPTotal[ahead]+HPTotal[tied]/2);

	return {"PPot": PPot, "NPot":NPot};
}

function EffectiveHandStrength(ourcards,boardcards){

	var HS = HandStrength(ourcards,boardcards);
	var HP = HandPotential(ourcards,boardcards);

	return HS*(1-HP.NPot)+(1-HS)*HP.PPot;
}

