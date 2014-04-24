Template.scenarioPage.helpers({
  rules: function() {
    return Rules.find({scenId: this._id});
  }
});

Template.scenarioPage.events({
});