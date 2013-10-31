Meteor.Router.add({
  '/': 'scenariosList',

  '/scenario/:_id': {
    to: 'scenarioPage', 
    and: function(id) { Session.set('currentScenarioId', id); }
  },

	/*
  '/scenario/:_id/edit': {
    to: 'scenarioEdit', 
    and: function(id) { Session.set('currentPostId', id); }    
  },
  */

  '/submit': 'postSubmit'

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