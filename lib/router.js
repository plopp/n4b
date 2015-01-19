
Router.configure({
  debug: true,
  layoutTemplate: 'layout',
  before: function() {
    console.log('before all');
  },
  loadingTemplate: 'loading'
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
        var ruleId = rule.resourceId;        
        Session.set("currentScenarioId", rule.scenId);
        Session.set("selectedResource", ruleId);
      }
      
    },
    waitOn: function() { return [Meteor.subscribe('rules'), Meteor.subscribe('types'), Meteor.subscribe('resources'), Meteor.subscribe('occurrences')]; }
  });
  
  this.route('resourceEdit',
  {
	path: '/resource/edit/:_id',
	data: function(){
		return Resources.findOne(this.params._id);		
	},
	onRun : function(){
		Session.set("currentResourceId", this.params._id);
		var res = Resources.findOne(this.params._id);
		if(res){
			Session.set("currentResourceId", res._id);
		}
	},
	waitOn: function() { Meteor.subscribe('resources'); }
  });
  
  this.route('graphItem', 
  {
    path:'/resource/:_id/graph',
    onRun: function(){
      Session.set('currentResourceGraphId', this.params._id); 
    },
    data: function(){
      //return Plotdata.find();
      var id = this.params._id; 
      return Plotdata.find({resourceId : id}).count();
    },
    waitOn: function() { return [Meteor.subscribe('plotdata'), Meteor.subscribe('resources')]; },
    action: function () {
      if (this.ready())
        this.render();
      else
        this.render('loading');
    }
  });
  this.route('resourcePage', {
      path: '/resources',
      waitOn: function() { return [Meteor.subscribe('resources'), Meteor.subscribe('types')]; }
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
      path: '/data',
	  waitOn: function() { return [Meteor.subscribe('resources'), Meteor.subscribe('types')]; }
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