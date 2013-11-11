Template.scenarioSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    console.log("submit");
    var scenario = {
      title: $(e.target).find('[name=title]').val()
    }
    console.log(scenario);
    scenario._id = Scenarios.insert(scenario);
    Meteor.Router.to('scenarioPage', scenario);
  }
});