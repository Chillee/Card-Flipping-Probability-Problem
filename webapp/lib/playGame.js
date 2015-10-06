var PLAYER_CARD = 1
var DEALER_CARD = 0
var NUMBER_OF_CARDS = 52
var NUMBER_OF_DEALER = NUMBER_OF_CARDS/2;
var NUMBER_OF_PLAYER = NUMBER_OF_CARDS/2;
Meteor.playGame = {

  chooseTop: function(){
    return true;
  },

  waitUntilDealerCardsGone: function(player_cards_flipped, dealer_cards_flipped){
    if(dealer_cards_flipped === NUMBER_OF_DEALER){
      return true;
    } else{
      return false;
    }
  },

  waitUntilPlayerMoreCommon: function(player_cards_flipped, dealer_cards_flipped){
    if(dealer_cards_flipped > player_cards_flipped+1){
      return true;
    } else{
      return false;
    }
  },

  followsRule: function(player_cards_flipped, dealer_cards_flipped, choosing_rule){
    if(choosing_rule === "chooseTop"){
      return this.chooseTop();
    } else if(choosing_rule === "waitUntilDealerCardsGone"){
      return this.waitUntilDealerCardsGone(player_cards_flipped, dealer_cards_flipped);
    } else if(choosing_rule === "waitUntilPlayerMoreCommon"){
      return this.waitUntilPlayerMoreCommon(player_cards_flipped, dealer_cards_flipped);
    } else{
      throw UserException("rule not defined");
    }
  },

  playGame: function(original_deck, choosing_rule){
    remaining_deck = original_deck;
    flipped_cards = [];
    player_cards_flipped = 0;
    dealer_cards_flipped = 0;
    while(remaining_deck.length > 0){
      top_card = remaining_deck[0];
      if(this.followsRule(player_cards_flipped, dealer_cards_flipped, choosing_rule)){
        if(top_card === PLAYER_CARD){
          return ["top card is player", flipped_cards, remaining_deck];
        }else if(top_card === DEALER_CARD){
          return ["top card is dealer", flipped_cards, remaining_deck];
        } else{
          throw new UserException("top card not right")
        }
      } else{
        if(top_card === PLAYER_CARD){
          player_cards_flipped++;
        }else if(top_card === DEALER_CARD){
          dealer_cards_flipped++;
        }
        flipped_cards.push(top_card);
        remaining_deck.shift();
      }
      console.assert(player_cards_flipped + dealer_cards_flipped == flipped_cards.length);
    }
   console.assert(remaining_deck.length === 0 && flipped_cards.length === NUMBER_OF_CARDS)
   if(flipped_cards[NUMBER_OF_CARDS-1]==PLAYER_CARD){
     return ["player win by default", flipped_cards, remaining_deck];
   } else if(flipped_cards[NUMBER_OF_CARDS-1]==DEALER_CARD){
     return ["dealer win by default", flipped_cards, remaining_deck];
   }
  },

  generateShuffledDeck: function(){
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      //console.log(array)
      return array;
    }
    deck = Array(NUMBER_OF_CARDS/2).fill(0).concat(Array(NUMBER_OF_CARDS/2).fill(1));
    deck = shuffle(deck);
    return deck;
  },

  runIterations: function(num_iters, choosing_rule, detailed_results){
    player_win = 0;
    dealer_win = 0;
    dealer_win_default=0;
    player_win_default=0;
    full_results = [];
    for(var i=0; i<num_iters; i++){
      original_deck = this.generateShuffledDeck();

      results = this.playGame(original_deck, choosing_rule);
      result = results[0]
      flipped_cards = results[1]
      remaining_deck = results[2]
      if(result === "top card is player"){
        player_win ++;
      } else if(result==="top card is dealer"){
        dealer_win++;
      } else if(result === "dealer win by default"){
        dealer_win_default++;
      } else if(result == "player win by default"){
        player_win_default++;
      }
      if(detailed_results){
        full_results.push([flipped_cards, remaining_deck]);
      }
      //console.log(flipped_cards, remaining_deck);
    }
    return [(player_win +player_win_default)/
           (player_win_default+dealer_win_default + player_win+dealer_win+0.0),
           [player_win, dealer_win, dealer_win_default, player_win_default],
            full_results];
  }

}

