
Router.configure({
  debug: true,
  layoutTemplate: 'layout',
  before: function() {
    console.log('before all');
  }
});

Router.map(function(){
  this.route('dashboardPage', {
    path: '/'
  });
  this.route('scenariosList', {
    path:'/scenarios',
    waitOn: function() { return [Meteor.subscribe('scenarios'), Meteor.subscribe('rules')]; },
    loadingTemplate: 'loading'
  });
  this.route('scenarioPage', {
    path:'/scenario/:_id',
    data: function(){
      return Scenarios.findOne(this.params._id);
      //Session.set('currentScenarioId', this.params._id);
    },
    waitOn: function() { return [Meteor.subscribe('scenarios'), Meteor.subscribe('rules'), Meteor.subscribe('occurrences'), Meteor.subscribe('resources')]; }
  });
  this.route('scenarioSubmit', {
    path:'/scenario/submit'
  });
  this.route('ruleSubmit', {
    path:'/scenario/:_id/rule/submit',
    waitOn: function() { 
      return [Meteor.subscribe('scenarios'), 
      Meteor.subscribe('rules'), 
      Meteor.subscribe('types'),
      Meteor.subscribe('resources')];
    },
    onRun: function(){
      Session.set("currentScenarioId", this.params._id);
    }
  });
  this.route('ruleEdit', 
  {
    path:'/rule/edit/:_id',
    data: function(){
      return Rules.findOne(this.params._id);      
    },
    onRun: function(){
      Session.set("currentRuleId", this.params._id);
      var rule = Rules.findOne(this.params._id);
      if(rule){
        var resId = rule.resourceId;        
        Session.set("selectedResource", resId);
      }
      
    },
    waitOn: function() { return [Meteor.subscribe('rules'), Meteor.subscribe('types'), Meteor.subscribe('resources')]; }
  });
  this.route('graphItem', 
  {
    path:'/resource/:_id/graph',
    data: function(){
      Session.set('currentResourceGraphId', this.params._id); 
    }
  });
  this.route('resourcePage', {
      path: '/resources'
    });
  this.route('resourceSubmit', {
      path: '/resources/submit'
    });
  this.route('documentationPage', {
      path: '/documentation'
    });
  this.route('settingsPage', {
      path: '/settings'
    });
  this.route('logsPage', {
      path: '/logs'
    });
  this.route('cardsPage', {
      path: '/data'
    });
});

// Meteor.Router.add({
//   '/': 'dashboardPage',

//   '/scenarios': 'scenariosList',

//   '/scenario/:_id': {
//     to: 'scenarioPage', 
//     and: function(id) { Session.set('currentScenarioId', id); }
//   },

//   '/submit/scenario': 'scenarioSubmit',

//   '/submit/:_id/rule' : {
//     to: 'ruleSubmit',
//     and: function(id) { Session.set('currentScenarioId', id); }
//   },

//   '/rule/:_id/edit': {
//     to: 'ruleEdit', 
//     and: function(id) { 
      
//     }    
//   },

//   '/resources': {
//     to: 'resourcePage',
//     and: function(id) {
//     }
//   },

//   '/data': {
//     to: 'cardsPage',
//     and: function() {
//     }
//   }
//   ,

//   '/resources/submit': 'resourceSubmit',

//   '/documentation': 'documentationPage',

//   '/settings': 'settingsPage',

//   '/logs': 'logsPage' 

// });