Template.scenarioSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    console.log("submit");
    var scenario = {
      title: $(e.target).find('[name=title]').val()
    }
    console.log(scenario);
    scenario._id = Scenarios.insert(scenario);
    Meteor.Router.to('scenarioPage', scenario._id);
  }
});

Template.scenarioSubmit.rendered = function(){
  Meteor.defer(function(){
    $("[name=title]").focus();
    console.log("Rendered submit form.");
  });
};