import itertools
import random

PLAYER_CARD = 1
DEALER_CARD = 0

def chooseTop():
    return True

def waitUntilDealerCardsGone(player_cards_flipped, dealer_cards_flipped):
    if(dealer_cards_flipped==26):
        return True
    else:
        return False

def waitUntilPlayerMoreCommon(player_cards_flipped, dealer_cards_flipped):
    if(dealer_cards_flipped > player_cards_flipped):
        return True
    else:
        return False

def followsRule(player_cards_flipped, dealer_cards_flipped, choosing_rule):
    if choosing_rule=="chooseTop":
        return chooseTop()
    elif choosing_rule=="waitUntilDealerCardsGone":
        return waitUntilDealerCardsGone(player_cards_flipped, dealer_cards_flipped)
    elif choosing_rule=="waitUntilPlayerMoreCommon":
        return waitUntilPlayerMoreCommon(player_cards_flipped, dealer_cards_flipped)
    else:
        raise Exception("Rule doesn't exist")    
        
def playGame(original_deck, choosing_rule):
    remaining_deck = original_deck
    flipped_cards = []
    player_cards_flipped = 0
    dealer_cards_flipped = 0

    while len(remaining_deck)>0:
        if followsRule(player_cards_flipped, dealer_cards_flipped, choosing_rule):
            top_card = remaining_deck[0]
            if top_card==PLAYER_CARD:
                return "top card is player"
            elif top_card==DEALER_CARD:
                return "top card is dealer"
            else:
                raise Exception("top_card not right")
        else:
            if(remaining_deck[0]==PLAYER_CARD):
                player_cards_flipped +=1
            elif(remaining_deck[0]==DEALER_CARD):
                dealer_cards_flipped += 1
            flipped_cards.append(remaining_deck[0])

            remaining_deck.pop(0) 

        assert player_cards_flipped + dealer_cards_flipped == len(flipped_cards)    
    assert len(remaining_deck) == 0 and len(flipped_cards) == 52
    return "dealer win by default"

def generateShuffledDeck():    
    deck = [0 for i in range(0, 26)] + [1 for i in range(0, 26)]
    random.shuffle(deck)
    return deck

def runIterations(num_iters, choosing_rule, detailed_results=True):
    player_win=0
    dealer_win=0
    for i in range(0, num_iters):
        original_deck = generateShuffledDeck()
        result = playGame(original_deck, choosing_rule)
        if result=="top card is player":
            player_win += 1
        elif result=="top card is dealer":
            dealer_win += 1
        elif result=="dealer win by default":
            dealer_win += 1
    return player_win / (player_win+dealer_win+0.0)

print runIterations(10000, "waitUntilPlayerMoreCommon", False)