Meteor.Router.add({
  '/': 'dashboard',

  '/scenarios': 'scenariosList',

  '/scenario/:_id': {
    to: 'scenarioPage', 
    and: function(id) { Session.set('currentScenarioId', id); }
  },

  '/submit/scenario': 'scenarioSubmit',

  '/submit/:_id/rule' : {
    to: 'ruleSubmit',
    and: function(id) { Session.set('currentScenarioId', id); }
  },

/*  '/rule/:_id': {
    to: 'rulePage', 
    and: function(id) { Session.set('currentRuleId', id); }
  },*/

  '/rule/:_id/edit': {
    to: 'ruleEdit', 
    and: function(id) { 
      Session.set('currentRuleId', id); 
      Session.set('val', Rules.findOne(id).value);
      //console.log(Session.get('val'));
    }    
  },

  '/resources': {
    to: 'resourcePage',
    and: function(id) {
      //console.log("Resource id: "+id);
      //Session.set('currentResourceId', id);
    }
  },

  '/documentation': 'documentationPage',

  '/settings': 'settingsPage',

  '/logs': 'logsPage'  
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