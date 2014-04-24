Template.scenarioSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    console.log("submit");
    var scenario = {
      title: $(e.target).find('[name=title]').val()
    }
    scenario._id = Scenarios.insert(scenario);
    console.log("Routing to the new scenario: "+Router.path('scenarioPage'));
    Router.go("scenarioPage", {_id: scenario._id});
  }
});

Template.scenarioSubmit.rendered = function(){
  Meteor.defer(function(){
    $("[name=title]").focus();
  });
};