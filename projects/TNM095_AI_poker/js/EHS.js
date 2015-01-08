function EHSagent(state){
	var random = Math.random();
	var move = "fold";

	this.bucket = [[4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1],
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

	if(state.turn > 1){
		var EHS = EffectiveHandStrength({"card1": state.cardOnHand[0], "card2": state.cardOnHand[1]}, 
			                            {"flop": {"card1": state.cardsOnTable[0], "card2": state.cardsOnTable[1], "card3": state.cardsOnTable[2]}, 
			                            "turnCard": state.cardsOnTable[3], "riverCard": state.cardsOnTable[4]});
		if(EHS > 0.75){
			move = state.availableMoves["bet"] ? "bet" : "raise";
		}
		else if(EHS > 0.55){
			if(random > 0.65){
				move = state.availableMoves["call"] ? "call" : "check";
			}
			else{
				move = state.availableMoves["bet"] ? "bet" : "raise";
			}
		}
		else if(EHS > 0.35){
			if(random > 0.15){
				move = state.availableMoves["call"] ? "call" : "check";
			}
			else{
				move = state.availableMoves["bet"] ? "bet" : "raise";
			}
		}
		else{
			if(random > 0.10){
				move = state.availableMoves["fold"] ? "fold" : "check";
			}
			else{
				move = state.availableMoves["bet"] ? "bet" : "raise";
			}
		}
	}
	else{
		var suit = state.cardOnHand[0].suit === state.cardOnHand[1].suit;
		// ace == 1, king == 13
		var card1number = state.cardOnHand[0].number;
		var card2number = state.cardOnHand[1].number;

		card1number = card1number === 1 ? 0 : 14 - card1number;
		card2number = card2number === 1 ? 0 : 14 - card2number;

		// first rows, second columns
		console.log(card1number, card2number, this.bucket)
		var strength = suit ? this.bucket[Math.min(card1number, card2number)][Math.max(card1number, card2number)] : this.bucket[Math.max(card1number, card2number)][Math.min(card1number, card2number)];

		switch(strength) {
		    case 0:
		        if(random < 0.10){
		        	move = state.availableMoves["bet"] ? "bet" : "raise";
		        }
		        else{
		        	move = state.availableMoves["fold"] ? "fold" : "check";
		        }

		        break;
		    case 1:
		        if(random < 0.20){
		        	move = state.availableMoves["bet"] ? "bet" : "raise";
		        }
		        else{
		        	move = state.availableMoves["fold"] ? "fold" : "check";
		        }

		        break;
		    case 2:
		       	if(random < 0.25){
		        	move = state.availableMoves["bet"] ? "bet" : "raise";
		        }
		        else if(random < 0.5){
		        	move = state.availableMoves["call"] ? "call" : "check";
		        }
		        else{
		        	move = state.availableMoves["fold"] ? "fold" : "check";
		        }

		        break;
		    case 3:
		        if(random < 0.45){
		        	move = state.availableMoves["bet"] ? "bet" : "raise";
		        }
		        else{
		        	move = state.availableMoves["call"] ? "call" : "check";
		        }

		        break;
		    case 4:
		         if(random < 0.75){
		        	move = state.availableMoves["bet"] ? "bet" : "raise";
		        }
		        else{
		        	move = state.availableMoves["call"] ? "call" : "check";
		        }

		        break;
		}
	}

	return move;
}