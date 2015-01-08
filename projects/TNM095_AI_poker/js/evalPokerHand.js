/**** POKER HAND EVALUATOR ****/
"use strict";

// Global variables

// Types of hands
var hands=["4 of a Kind", "Straight Flush", "Straight", "Flush", "High Card",
       "1 Pair", "2 Pair", "Royal Flush", "3 of a Kind", "Full House", "-Invalid-" ];
// How much the types of hands is worth
var handRanks = [8,9,5,6,1,2,3,10,4,7,0];

function calcIndex(cs,ss) {
  var v,i,o,s; for (i=-1, v=o=0; i<5; i++, o=Math.pow(2,cs[i]*4)) {v += o*((v/o&15)+1);}
  if ((v%=15)!=5) {return v-1;} else {s = 1<<cs[0]|1<<cs[1]|1<<cs[2]|1<<cs[3]|1<<cs[4];}
  v -= ((s/(s&-s) == 31) || (s == 0x403c) ? 3 : 1);
 return v - (ss[0] == (ss[0]|ss[1]|ss[2]|ss[3]|ss[4])) * ((s == 0x7c00) ? -5 : 1);
}
function getCombinations(k,n) {
    var result = [], comb = [];
        function next_comb(comb, k, n ,i) {
            if (comb.length === 0) {for (i = 0; i < k; ++i) {comb[i] = i;} return true;}
            i = k - 1; ++comb[i];
            while ((i > 0) && (comb[i] >= n - k + 1 + i)) { --i; ++comb[i];}
            if (comb[0] > n - k) {return false;} // No more combinations can be generated
            for (i = i + 1; i < k; ++i) {comb[i] = comb[i-1] + 1;}
            return true;
        }
    while (next_comb(comb, k, n)) { result.push(comb.slice());}
    return result;
}
function getPokerScore(cs) {

    var a = cs.slice(), d={}, i;
    for (i=0; i<5; i++) {d[a[i]] = (d[a[i]] >= 1) ? d[a[i]] + 1 : 1;}
    a.sort(function(a,b){return (d[a] < d[b]) ? +1 : (d[a] > d[b]) ? -1 : (b - a);});
    return a[0]<<16|a[1]<<12|a[2]<<8|a[3]<<4|a[4];
}    
 
    
function rankHand(str) {
    var index = 10, winCardIndexes, i ,e;
    var cards = [],suits=[],suitsOrig=[];

    for (var obj in str){
        if(str[obj].number === 1){
            cards.push(14);
        }
        else{
            cards.push(str[obj].number);
        }
        suits.push(str[obj].suit[0]);
        suitsOrig.push(str[obj].suit);
    }

    /*if (str.match(/((?:\s*)(10|[2-9]|[J|Q|K|A])[S|C|H|D](?:\s*)){5,7}/g) !== null) {
        var cardStr = str.replace(/1/g,"14").replace(/K/g,"13").replace(/Q/g,"12")
            .replace(/J/g,"11").replace(/S|C|H|D/g,",");
        var cards = cardStr.replace(/\s/g, '').slice(0, -1).split(",");
        var suits = str.match(/S|C|H|D/g);*/
    
    // Convert from letters to special chars..
    for(var x in suits){
      if(suits[x]=='S'){suits[x]=decodeURIComponent("%E2%99%A0");} // Spades
      else if(suits[x]=='C'){suits[x]=decodeURIComponent("%E2%99%A3");} // Clubs
      else if(suits[x]=='H'){suits[x]=decodeURIComponent("%E2%99%A5");} // Hearts
      else if(suits[x]=='D'){suits[x]=decodeURIComponent("%E2%99%A6");} // Diamonds
    }

    if (cards !== null && suits !== null) {
        if (cards.length == suits.length) {
            var o = {}, keyCount = 0, j,wci; 
            for (i = 0; i < cards.length; i++) { e = cards[i]+suits[i]; o[e] = 1;}
            for (j in o) { if (o.hasOwnProperty(j)) { keyCount++;}}
                           
            if (cards.length >=5) {
             if (cards.length == suits.length && cards.length == keyCount) {
                for (i=0;i<cards.length;i++) { cards[i]-=0; }
                for (i=0;i<suits.length;i++) 
                    { suits[i] = Math.pow(2, (suits[i].charCodeAt(0)%9824)); }
                var c = getCombinations(5, cards.length);
                var maxRank = 0, winIndex = 10;
                for (i=0; i < c.length; i++) {
                     var cs = [cards[c[i][0]], cards[c[i][1]], cards[c[i][2]], 
                               cards[c[i][3]], cards[c[i][4]]];
                     var ss = [suits[c[i][0]], suits[c[i][1]], suits[c[i][2]], 
                               suits[c[i][3]], suits[c[i][4]]];
                     index = calcIndex(cs,ss);
       
                     if (handRanks[index] > maxRank) {
                         maxRank = handRanks[index];
                         winIndex = index; 
                         wci = c[i].slice();
                     } else if (handRanks[index] == maxRank) {
                         //If by chance we have a tie, find the best one
                         var score1 = getPokerScore(cs);
                         var score2 = getPokerScore([cards[wci[0]],cards[wci[1]],cards[wci[2]],
                                                     cards[wci[3]],cards[wci[4]]]);
                         if (score1 > score2) { wci= c[i].slice(); }
                     }
                } 
                // Type of hand that will be returned...
                index = winIndex;
             }                     
            }  

            if(wci === undefined){
                console.log(str);
            }

            //Show the best cards if cs.length is less than 7 cards.
            var cardUsed = [];
            if (cards.length <= 7) {
                for (i=0; i<cards.length; i++) {

                    if (wci.indexOf(i) == -1) {
                        //Not in the solution

                    } else {
                        //Is in the solution
                        cardUsed.push({"suit":suitsOrig[i],"number":cards[i].toString()});
                    }   
                }
                return {type:hands[index],cardsUsed: cardUsed,primeScore: handRanks[index], secondaryScore: getPokerScore([cards[wci[0]],cards[wci[1]],cards[wci[2]],cards[wci[3]],cards[wci[4]]])};
            }
        }
    }
}