Template.ruleSubmit.helpers({
  resources : function(){
    return Resources.find();
  },
  valueTypeIsAnalog : function(){
    return Session.get("resourceType") === "Analog"; //Is Either Analog or Digital
  },
  valueTypeIsDigital : function(){
    return Session.get("resourceType") === "Digital"; //Is Either Analog or Digital
  },
  sliderVal : function(){
    return Session.get("valrange");
  },
  unit : function(){
    return Session.get("unit");
  },
  max : function() {
    return Session.get("max")
  },
  min : function() {
    return Session.get("min")
  }
});


Template.ruleSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    console.log(Session.get("currentScenarioId"));
    var rule = {
      title: $(e.target).find('[name=title]').val(),
      scenId: Session.get("currentScenarioId"),
      resourceId: Session.get("resourceId"),
      userId: "asdasdasd",
      creator: "user1",
      submitted: new Date().getTime(),
      value: Session.get("valrange"),
      timerule: 'at 11:47'
    }
    console.log(rule);
    rule._id = Rules.insert(rule);
    Meteor.Router.to('scenarioPage', Session.get("currentScenarioId"));
  },

  "change #resource_select": function(evt) {
    resourceId = $(evt.target).val();

    typeForThisResource = Types.findOne(Resources.findOne(resourceId).typeId);
    Session.set("resourceType", typeForThisResource.title);
    Session.set("unit", Resources.findOne(resourceId).unit);
    max = Resources.findOne(resourceId).max;
    min = Resources.findOne(resourceId).min;

    Session.set("max", max);
    Session.set("min", min);
    Session.set("valrange", Math.floor((max-min)/2));
    Session.set("resourceId", resourceId)

    //console.log(typeForThisResource);
    //console.log(Types.findOne(typeForThisResource));
  },

  "change #valrange": function(evt){
    Session.set("valrange",$(evt.target).val());
  }

});

Template.ruleSubmit.rendered = function(){
  $("#resource_select").trigger('change');
}
