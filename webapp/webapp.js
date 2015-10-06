GameStats = new Mongo.Collection('gamestats');
rules = ['waitUntilPlayerMoreCommon','chooseTop', 'waitUntilDealerCardsGone']

if (Meteor.isServer) {
  Meteor.startup(function () {

    GameStats.remove({});
    for (var i = rules.length - 1; i >= 0; i--) {
      GameStats.insert({
        rule: rules[i],
        default_loss: 0,
        card_win: 0,
        card_loss: 0,
        default_win: 0
      });
    }
  });
}


if (Meteor.isClient) {
  var UserGameStats = new ReactiveArray([]);
  // UserGameStats.remove({});
  for (var i = rules.length - 1; i >= 0; i--) {
    UserGameStats.push({
      rule: rules[i],
      default_loss: 0,
      card_win: 0,
      card_loss: 0,
      default_win: 0
    });
  }
  console.log(UserGameStats);
  // counter starts at 0
  Template.body.helpers({
    results: function(){
      return GameStats.find({});
    },
    userResults: function(){
      return UserGameStats.list();
    }
  });

  Template.strategy.events({
    'click button': function (obj) {
      var rule = $(this)[0].rule;
      var ruleIndex = 0;
      for(var i=0; i<3; i++){
        if(UserGameStats[i].rule==rule){
          ruleIndex=i;
        }
      }
      // console.log(strategy.rule);
      var buttonType = $(obj.target).attr('class');
      // var numIter = 1;
      var result;
      if(buttonType=='playOne'){
        result = Meteor.playGame.runIterations(1, rule, true);
      } else if(buttonType=='playTen'){
        result = Meteor.playGame.runIterations(10, rule, true);
      } else if(buttonType=='playHundred'){
        result = Meteor.playGame.runIterations(100, rule, false);
      } else if(buttonType=='playTenThousand'){
        result = Meteor.playGame.runIterations(10000, rule, false);
      }
      var player_win = result[1][0];
      var dealer_win = result[1][1];
      var dealer_win_default = result[1][2];
      var player_win_default = result[1][3];
      console.log(result);
      // console.log($(this)[0])
      GameStats.update($(this)[0]._id, {$inc:
                                       {default_loss: dealer_win_default,
                                        card_win: player_win,
                                        card_loss: dealer_win,
                                        default_win: player_win_default}});

      UserGameStats.splice(ruleIndex, 1, {      //ugly hack since I can't figure out how to make arrays reactive with icnrements
                          rule: rule,
                          default_loss: UserGameStats[ruleIndex].default_loss+dealer_win_default,
                          card_win: UserGameStats[ruleIndex].card_win+player_win,
                          card_loss: UserGameStats[ruleIndex].card_loss+dealer_win,
                          default_win: UserGameStats[ruleIndex].default_win+player_win_default});
      console.log(UserGameStats);
      // console.log(numIter);
      // console.log(Meteor.playGame.runIterations(10000, rules[0], true));
      // console.log($(this).html());
    }
  });
  Template.strategy.helpers({
    generateChart: function(){
      return {
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false
          },
          title: {
              text: "Results"
          },
          tooltip: {
              pointFormat: '<b>{point.y:.0f}</b>'
          },
          plotOptions: {
              pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                      style: {
                          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                      },
                      connectorColor: 'silver'
                  }
              }
          },
          series: [{
              type: 'pie',
              name: 'genre',
              data: [
                  ['Default Win',  this.default_win],
                  ['Regular Win',  this.card_win],
                  ['Default Loss', this.default_loss],
                  ['Regualr Loss', this.card_loss]
              ]
          }]
      };
    }
  });


}

