GameStats = new Mongo.Collection('gamestats');

if (Meteor.isServer) {
  Meteor.startup(function () {
    rules = ['chooseTop', 'waitUntilDealerCardsGone', 'waitUntilPlayerMoreCommon']
    GameStats.remove({});
    for (var i = rules.length - 1; i >= 0; i--) {
      GameStats.insert({
        rule: rules[i],
        default_loss: 0,
        card_win: 0,
        card_loss: 0
      });
    }
  });
}


if (Meteor.isClient) {
  // counter starts at 0
  Template.hello.helpers({

  });

  Template.hello.events({
    'click button': function () {
      console.log(Meteor.playGame.runIterations(10000, "waitUntilPlayerMoreCommon", true));

    }
  });
}


