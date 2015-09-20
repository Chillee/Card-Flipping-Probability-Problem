import itertools
import random


def followsRule(flipped_cards, remaining_deck):
    return True

def getTopCardWinner(remaining_deck):
    if(remaining_deck[0]==1):
        return "player"
    elif(remaining_deck[0]==0):
        return "dealer"
    else:
        raise Exception("top card is neither red nor black")
        
def playGame(original_deck):
    remaining_deck = original_deck
    flipped_cards = []
    while len(remaining_deck)>0:
        if followsRule(flipped_cards, remaining_deck):
            return getTopCardWinner(remaining_deck)                
        else:
            flipped_cards.append(remaining_deck[0])
            remaining_deck = remaining_deck[1:]

    assert len(remaining_deck) == 0 and len(flipped_cards) == 52
    return "dealer"

def generateShuffledDeck():    
    deck = [0 for i in range(0, 26)] + [1 for i in range(0, 26)]
    random.shuffle(deck)
    return deck

player_win, dealer_win = 0 
for i in range(0, 10000):
    original_deck = generateShuffledDeck()
    winner = playGame(original_deck)
    winner = "hi"
    assert winner =="player" or winner=="dealer"

    if(winner=="player"):
        player_win+=1
    elif(winner=="dealer"):
        dealer_win+=1

print player_win / (player_win+dealer_win+0.0)