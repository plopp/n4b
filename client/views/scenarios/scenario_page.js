Template.scenarioPage.helpers({
  currentScenario: function() {
    return Scenarios.findOne(Session.get('currentScenarioId'));
  },
  rules: function() {
    return Rules.find({scenId: this._id});
  }
});

Template.scenarioPage.events({
  'submit form': function(e) {
    e.preventDefault();
    
    Meteor.Router.to('ruleSubmit', this._id);
  }
});