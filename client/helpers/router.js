Router.map(function(){
  this.route('dashboardPage', 
    {
      path: '/'
    });
  this.route('scenariosList', 
    {
      path:'/scenarios'
    });
  this.route('scenarioPage', 
    {
      path:'/scenario/:_id',
      data: function(){
        Session.set('currentScenarioId', id);
      }
    });
  this.route('scenarioSubmit', 
    {
      path:'/submit/scenario'
    });
  this.route('ruleSubmit', 
    {
      path:'/submit/:_id/rule',
      data: function(){
        Session.set('currentScenarioId', id);
      }
    });
  this.route('ruleEdit', 
    {
      path:'/rule/:_id/edit',
      data: function(){
        Session.set('currentRuleId', this.params._id); 
        Session.set('val', Rules.findOne(this.params._id).value);
      }
    });
  
  this.route('resourcePage', {
      path: '/resources'
    });
  this.route('resourceSubmit', {
      path: '/resources/submit'
    });
  this.route('documentationOage', {
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