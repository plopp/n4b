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
    return Session.get("val");
  },
  unit : function(){
    return Session.get("unit");
  },
  max : function() {
    return Session.get("max");
  },
  min : function() {
    return Session.get("min");
  }
});


Template.ruleSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    console.log(Session.get("currentScenarioId"));
    val = Session.get("resourceType") === "Analog" ? Session.get("val") : ($(e.target).find('[name=Value]').attr('checked') ? 1 : 0);
    console.log("val");
    var rule = {
      title: $(e.target).find('[name=title]').val(),
      scenId: Session.get("currentScenarioId"),
      resourceId: Session.get("resourceId"),
      userId: "asdasdasd",
      creator: "user1",
      submitted: new Date().getTime(),
      value: val,
      timerule: $(e.target).find('[name=timerule]').val(),
    }
    console.log(rule);
    rule._id = Rules.insert(rule);
    Meteor.Router.to('scenarioPage', Session.get("currentScenarioId"));
  },

  "change #resource_select": function(evt) {
    console.log("option changed");
    resourceId = $(evt.target).val(); //The resource ID is stored in the value property in every option.
    
    typeForThisResource = Types.findOne(Resources.findOne(resourceId).typeId); //Get the resource type.
    console.log(Resources.findOne(resourceId).title);
    Session.set("resourceType", typeForThisResource.title);
    Session.set("resourceId", resourceId)
    
    unit = Resources.findOne(resourceId).unit;
    Session.set("unit", unit); //Doesn't matter if unit is undefined
    
    max = Resources.findOne(resourceId).max;
    Session.set("max", max);

    min = Resources.findOne(resourceId).min;
    Session.set("min",min);

    if(typeof min == undefined || typeof max == undefined){
      Session.set("val", 0);
    }
    else{
      Session.set("val", Math.floor((max-min)/2));
    }
  },
  "change #valrange": function(evt){
    val = $(evt.target).val();
    Session.set("val",val);
    console.log(val);
  },

  "change #valcheckbox": function(evt){
    val = $(evt.target).attr('checked') ? 1 : 0;
    Session.set("val", val);
    console.log(val);
  },
  'click #verify': function(e) {
    e.preventDefault();
    Meteor.call("verifyTimerule",$("#timerule").val(), function(error,r){
      if(r.result < 0 && $("#timerule").val().length > 0){
        $("#nextOccurrence").text(r.nextOccurrence);
        $("#verify").addClass("btn-success");
        $("#verify").removeClass("btn-danger");
        console.log("Success");
      }
      else{
        $("#verify").addClass("btn-danger");
        $("#verify").removeClass("btn-success");
        console.log("Danger!");
      }
    });
    
  }

});
//later.parse.text('at 30:15 am').sched.error



Template.ruleSubmit.rendered = function(){
  /*resourceId = $("#resource_select").val(); //The resource ID is stored in the value property in every option.
  typeForThisResource = Types.findOne(Resources.findOne(resourceId).typeId); //Get the resource type.
  console.log(Resources.findOne(resourceId).title);
  Session.set("resourceType", typeForThisResource.title);
  Session.set("resourceId", resourceId)
    
  unit = Resources.findOne(resourceId).unit;
  Session.set("unit", unit); //Doesn't matter if unit is undefined
    
  max = Resources.findOne(resourceId).max;
  Session.set("max", max);

  min = Resources.findOne(resourceId).min;
  Session.set("min",min);

  if(typeof min == undefined || typeof max == undefined){
    Session.set("val", 0);
  }
  else{
    Session.set("val", Math.floor((max-min)/2));
  }*/
}
/*
function redraw(){
  
}
*/