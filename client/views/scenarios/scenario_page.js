Template.scenarioPage.helpers({
  rules: function() {
    return Rules.find({scenId: this._id});
  }
});

Template.scenarioPage.events({
	'click #submit':function(){
		console.log(Session.get('currentScenarioId'));
		Router.go('ruleSubmit',{_id:Session.get('currentScenarioId')});
	}
});