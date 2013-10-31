Template.scenarioPage.helpers({
  currentScenario: function() {
    return Scenarios.findOne(Session.get('currentScenarioId'));
  },
  rules: function() {
    return Rules.find({scenId: this._id});
  }
});