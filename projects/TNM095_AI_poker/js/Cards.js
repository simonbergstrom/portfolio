// The card deck object

// Pointer for the card deck.
//var counter = 0;

// Constructor for card deck..
function Cards() {
	this.cards = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52];
	//this.cards= [0,1,2,3,4,5,6,7,8,9,10]; // Spades = 1-13 , Hearts = 14-26 , Diamonds = 27-39 , 40-52 Clubs
	this.counter = 0;
}

Cards.prototype.whichCard = function(card){
	// Ace  => 1, 14, 27, 40, 
	// King => 13, 26
	// 2    => 2, 15

	var number=card%13;

	if(number === 0)
		number = 13;

	var res;

	if(card <14){ // Spades
		res = {"suit":"Spades", "number":number};
	}
	else if(card<27){ //Hearts
		res = {"suit":"Hearts", "number":number};
	}
	else if(card<40){ // Diamonds
		res = {"suit":"Diamonds", "number":number};
	}
	else { //Clubs
		res = {"suit":"Clubs", "number":number};
	}

	return res;
};

// Method for shuffle the cards and start a new round
Cards.prototype.shuffle = function() {
  for(var j, x, i = this.cards.length; i; j = Math.floor(Math.random() * i), x = this.cards[--i], this.cards[i] = this.cards[j], this.cards[j] = x);
    this.counter = 0;
};

// Method for pop the Flop and reveal three cards
Cards.prototype.getFlop = function() {
	var i = this.cards.length-1-this.counter;
	var res = {"card1": this.whichCard(this.cards[i]), "card2": this.whichCard(this.cards[i-1]), "card3": this.whichCard(this.cards[i-2])};
	 this.counter= this.counter+3;
	return res;
};

// Method for
Cards.prototype.getPocket = function(){
	var i = this.cards.length-1- this.counter;
	var res = {"card1": this.whichCard(this.cards[i]),"card2": this.whichCard(this.cards[i-1])};
	 this.counter += 2;
	return res;

};

Cards.prototype.getOneCard = function(){
	var res = this.whichCard(this.cards[this.cards.length- this.counter-1]);
	 this.counter++;

	return res;
}

Cards.prototype.removePossibleCards = function(cardList){
	var index = this.cards.length - 1;

	for(var i=0; i<cardList.length; ++i){
		if(cardList[i].number !== undefined){
			var number = cardList[i].number;

			if(cardList[i].suit === "Hearts"){
				number += 13;
			}
			else if(cardList[i].suit === "Diamonds"){
				number += 26;
			}
			else if(cardList[i].suit === "Clubs"){
				number += 39;
			}

			this.cards[this.cards.indexOf(number)] = this.cards[index];
			this.cards[index] = number;
			this.counter++;
			index--;
		}
	}
}

Cards.prototype.removePossibleCards2 = function(cardList){

	// Ace => 1, 14, 27, 40, 
	// KIng => 13, 26
	// 2 => 2, 15

	for(var i=0; i<cardList.length; ++i){
		var number = cardList[i].number;

		if(cardList[i].suit === "Hearts"){
			number += 13;
		}
		else if(cardList[i].suit === "Diamonds"){
			number += 26;
		}
		else if(cardList[i].suit === "Clubs"){
			number += 39;
		}
		var index = this.cards.indexOf(number);
		if (index > -1) {
		    this.cards.splice(index, 1);
		}
	}
	this.counter = 0;
}

Cards.prototype.testForErrors = function(){
	var error = false;
	for(var i=0; i<this.cards.length; ++i){
		if(isNaN(this.cards[i])){
			errorr = true;
		}
	}
	return error;
}

Cards.prototype.validateCard = function(card, cards){
	var result = true;

	for(var i=0; i<cards.length; ++i){
		if(card.number === cards[i].number && card.suit === cards[i].suit){
			console.log(card)
		}
	}

	return card;
}