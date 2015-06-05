
Router.configure({
  debug: true,
  layoutTemplate: 'layout',
  /*before: function() {
    console.log('before all');
    this.next();
  },*/
  loadingTemplate: 'loading'
});

Router.route('/', {
    name: 'dashboardPage'
});

Router.route('/scenarios',{
    name: 'scenariosList',
    waitOn: function() { 
      return [Meteor.subscribe('scenarios'), Meteor.subscribe('rules')]; 
    }
});

Router.route('/scenario/:_id',{
    name: 'scenarioPage',
    data: function(){
      return Scenarios.findOne(this.params._id);
    },
    waitOn: function() { 
      return [Meteor.subscribe('scenarios'), Meteor.subscribe('rules'), Meteor.subscribe('occurrences'), Meteor.subscribe('resources')]; 
    },
    onBeforeAction: function() {
      console.log(this.params._id);
      Session.set('currentScenarioId', this.params._id); 
      this.next();
    }
});

Router.route('/logs',{
    name: 'logsPage'
});

Router.route('/settings',{
    name: 'settingsPage',
    waitOn: function() {
      return Meteor.subscribe('occurrences');
    }
});

Router.route('cardsPage', {
      path: '/data',
      waitOn: function() { return [Meteor.subscribe('resources'), Meteor.subscribe('types')]; }
});

Router.route('resourcePage', {
      path: '/resources',
      waitOn: function() { return [Meteor.subscribe('resources'), Meteor.subscribe('types')]; }
});

Router.route('lineDiagramPage', {
      path: '/linediagram',
      waitOn: function() { return [Meteor.subscribe('resources'), Meteor.subscribe('types')]; }
});

Router.route('documentationPage', {
      path: '/documentation'
});

Router.route('graphItem', {
    path:'/resource/:_id/graph',
    onBeforeAction: function(){
      Session.set('currentResourceGraphId', this.params._id); 
      this.next();
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

Router.route('resourceEdit',
  {
  path: '/resource/edit/:_id',
  data: function(){
   return Resources.findOne(this.params._id);    
  },
  onBeforeAction : function(){
   Session.set("currentResourceId", this.params._id);
   var res = Resources.findOne(this.params._id);
   if(res){
     Session.set("currentResourceId", res._id);
   }
    this.next();
  },
  waitOn: function() { return [Meteor.subscribe('resources'), Meteor.subscribe('occurrences'), Meteor.subscribe('rules'), Meteor.subscribe('types')]; }
});

Router.route("scenarioSubmit",{
  path:"/add/scenario"
  //path:"/logs"
})

Router.route('ruleSubmit', {
    path:'/scenario/:_id/rule/submit',
    waitOn: function() { 
      return [Meteor.subscribe('scenarios'), 
      Meteor.subscribe('rules'), 
      Meteor.subscribe('types'),
      Meteor.subscribe('resources')];
    },
    onBeforeAction: function(){
      //Session.set("currentScenarioId", this.params._id);
      this.next();
    }
  });

Router.route('ruleEdit', 
  {
    path:'/rule/edit/:_id',
    data: function(){
      return Rules.findOne(this.params._id);      
    },
    onBeforeAction: function(){
      Session.set("currentRuleId", this.params._id);
      var rule = Rules.findOne(this.params._id);
      if(rule){
        Session.set("currentScenarioId", rule.scenId);
        Session.set("selectedResource", rule.resourceId);
      }
      this.next();
    },
    waitOn: function() { return [Meteor.subscribe('rules'), Meteor.subscribe('types'), Meteor.subscribe('resources'), Meteor.subscribe('occurrences')]; }
  });

Router.route('resourceSubmit', {
      path: '/resources/submit',
      waitOn: function() {return [Meteor.subscribe('types'), Meteor.subscribe('resources')];}
    });

//Router.map(function(){
  // this.route('/', {
  //   name: 'dashboardPage'
  // });
  
  // this.route('/scenarios', {
  //   name:'scenariosList',
  //   waitOn: function() { return [Meteor.subscribe('scenarios'), Meteor.subscribe('rules')]; },
  //   loadingTemplate: 'loading'
  // });
  // this.route('/scenario/:_id', {
  //   name:'scenarioPage',
  //   data: function(){
  //     return Scenarios.findOne(this.params._id);
  //     //Session.set('currentScenarioId', this.params._id);
  //   },
  //   waitOn: function() { return [Meteor.subscribe('scenarios'), Meteor.subscribe('rules'), Meteor.subscribe('occurrences'), Meteor.subscribe('resources')]; }
  // });
  // this.route('/scenario/submit', function(){
  //   this.render('scenarioSubmit');
  // });
 //  this.route('ruleSubmit', {
 //    path:'/scenario/:_id/rule/submit',
 //    waitOn: function() { 
 //      return [Meteor.subscribe('scenarios'), 
 //      Meteor.subscribe('rules'), 
 //      Meteor.subscribe('types'),
 //      Meteor.subscribe('resources')];
 //    },
 //    onRun: function(){
 //      Session.set("currentScenarioId", this.params._id);
 //      this.next();
 //    }
 //  });
 //  this.route('ruleEdit', 
 //  {
 //    path:'/rule/edit/:_id',
 //    data: function(){
 //      return Rules.findOne(this.params._id);      
 //    },
 //    onRun: function(){
 //      Session.set("currentRuleId", this.params._id);
 //      var rule = Rules.findOne(this.params._id);
 //      if(rule){
 //        var ruleId = rule.resourceId;        
 //        Session.set("currentScenarioId", rule.scenId);
 //        Session.set("selectedResource", ruleId);
 //      }
 //      this.next();
 //    },
 //    waitOn: function() { return [Meteor.subscribe('rules'), Meteor.subscribe('types'), Meteor.subscribe('resources'), Meteor.subscribe('occurrences')]; }
 //  });
  
 //  this.route('resourceEdit',
 //  {
	// path: '/resource/edit/:_id',
	// data: function(){
	// 	return Resources.findOne(this.params._id);		
	// },
	// onRun : function(){
	// 	Session.set("currentResourceId", this.params._id);
	// 	var res = Resources.findOne(this.params._id);
	// 	if(res){
	// 		Session.set("currentResourceId", res._id);
	// 	}
 //    this.next();
	// },
	// waitOn: function() { Meteor.subscribe('resources'); }
 //  });
  
 //  this.route('graphItem', 
 //  {
 //    path:'/resource/:_id/graph',
 //    onRun: function(){
 //      Session.set('currentResourceGraphId', this.params._id); 
 //      this.next();
 //    },
 //    data: function(){
 //      //return Plotdata.find();
 //      var id = this.params._id; 
 //      return Plotdata.find({resourceId : id}).count();
 //    },
 //    waitOn: function() { return [Meteor.subscribe('plotdata'), Meteor.subscribe('resources')]; },
 //    action: function () {
 //      if (this.ready())
 //        this.render();
 //      else
 //        this.render('loading');
 //    }
 //  });
 //  this.route('resourcePage', {
 //      path: '/resources',
 //      waitOn: function() { return [Meteor.subscribe('resources'), Meteor.subscribe('types')]; }
 //    });
 //  this.route('resourceSubmit', {
 //      path: '/resources/submit'
 //    });
 //  this.route('documentationPage', {
 //      path: '/documentation'
 //    });
 //  this.route('settingsPage', {
 //      path: '/settings'
 //    });
 //  this.route('logsPage', {
 //      path: '/logs'
 //    });
 //  this.route('cardsPage', {
 //      path: '/data',
	//   waitOn: function() { return [Meteor.subscribe('resources'), Meteor.subscribe('types')]; }
 //    });

//});