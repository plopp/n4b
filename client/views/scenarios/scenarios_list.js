
Template.scenariosList.helpers({
  scenario: function() {
    return Scenarios.find();
  }
});

Template.scenariosList.events({
  'submit form': function(e) {
    e.preventDefault();
    console.log("submit");
    Meteor.Router.to('scenarioSubmit');
  }
});