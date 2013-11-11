Meteor.Router.add({
  '/': 'scenariosList',

  '/scenario/:_id': {
    to: 'scenarioPage', 
    and: function(id) { Session.set('currentScenarioId', id); }
  },

  '/submit/scenario/': 'scenarioSubmit',

  '/rule/schedule/:_id':{
    to: 'ruleSchedule',
    and: function(id) {
      Meteor.call('scheduleThis',id,function (error, result) { 
          console.log("Error: "+error+", Result: "+result);
          if(error != undefined){
            throw new Meteor.Error(500, "Parse error "+error);
            Meteor.Router.to('/');
          }

          if(result != undefined){
            Meteor.Router.to('scenarioPage', result);
          }
      });
    }
  },
	/*
  '/scenario/:_id/edit': {
    to: 'scenarioEdit', 
    and: function(id) { Session.set('currentPostId', id); }    
  },
  */


});

/*
Meteor.Router.filters({
  'requireLogin': function(page) {
    if (Meteor.user())
      return page;
    else if (Meteor.loggingIn())
      return 'loading';
    else
      return 'accessDenied';
  },
  'clearErrors': function(page) {
    clearErrors();
    return page;
  }
});

Meteor.Router.filter('requireLogin', {only: 'postSubmit'});
Meteor.Router.filter('clearErrors'); */