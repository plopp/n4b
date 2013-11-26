Template.ruleSubmit.helpers({
  resources : function(){
    return Resources.find();
  },
  valueTypeIsAnalog : function(){
    var selectedResource = Session.get("selectedResource");
    if(selectedResource == undefined){
      return false; //Error, default to false
    }
    console.log(selectedResource);
    var res = Resources.findOne(selectedResource);
    if(res != undefined){
      var typeId = res.typeId;
      return Types.findOne(typeId).title === "Analog"; 
    }
    else{
      return false;
    }
    
    /*var selectedResId = Session.get("currentRuleId")
    if(selectedResId != undefined && resourceId != selectedResId){ //If selected resource differs form the store resourceId, the user has changed resource.
      return Types.findOne(Resources.findOne(selectedResId).typeId).title === "Analog";  
    }
    return Types.findOne(Resources.findOne(resourceId).typeId).title === "Analog";
    //return Session.get("resourceType") === "Analog"; //Is Either Analog or Digital*/
  },
  valueTypeIsDigital : function(){
    var selectedResource = Session.get("selectedResource");
    if(selectedResource == undefined){
      return true; //Error, default to true
    }
    var res = Resources.findOne(selectedResource);
    if(res != undefined){
      var typeId = res.typeId;
      return Types.findOne(typeId).title === "Digital"; 
    }
    else{
      return true;
    }
    
    /*var selectedResId = Session.get("resourceId");
    if(selectedResId != undefined && resourceId != selectedResId){ //If selected resource differs form the store resourceId, the user has changed resource.
      return Types.findOne(Resources.findOne(selectedResId).typeId).title === "Digital";  
    }
    return Types.findOne(Resources.findOne(resourceId).typeId).title === "Digital";
    //return Session.get("resourceType") === "Digital"; //Is Either Analog or Digital*/
  },
  sliderVal : function(){
    return Session.get("val");
  },
  unit : function(){
    var selectedResource = Session.get("selectedResource");
    return Resources.findOne(selectedResource).unit; 
    //return Session.get("unit");
  },
  max : function() {
    var selectedResource = Session.get("selectedResource");
    return Resources.findOne(selectedResource).max; 
    //return Session.get("max");
  },
  min : function() {
    var selectedResource = Session.get("selectedResource");
    return Resources.findOne(selectedResource).min; 
    //return Session.get("min");
  }
});


Template.ruleSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    var selRes = Session.get("selectedResource");
    var val;
    switch(Types.findOne(Resources.findOne(selRes).typeId).title){
      case "Analog":
        val = Session.get("val");
        break;
      case "Digital":
        val = $(e.target).find('[name=Value]').attr('checked') ? 1 : 0;
        break;
      default:
        val = 0;
        console.log("Resource type not found!");
    }

    var rule = {
      title: $(e.target).find('[name=title]').val(),
      scenId: Session.get("currentScenarioId"),
      resourceId: selRes,
      userId: "asdasdasd",
      creator: "user1",
      submitted: new Date().getTime(),
      value: val,
      timerule: $(e.target).find('[name=timerule]').val(),
    }
    rule._id = Rules.insert(rule);
    Meteor.Router.to('scenarioPage', Session.get("currentScenarioId"));
  },
  "change #resource_select": function(evt) {
    resourceId = $(evt.target).val(); //The resource ID is stored in the value property in every option.
    Session.set("selectedResource", resourceId)
  },
  "change #valrange": function(evt){
    val = $(evt.target).val();
    Session.set("val",val);
  },
  "change #valcheckbox": function(evt){
    val = $(evt.target).attr('checked') ? 1 : 0;
    Session.set("val", val);
  },
  'click #verify': function(e) {
    e.preventDefault();
    Meteor.call("verifyTimerule",$("#timerule").val(), function(error,r){
      if(r.result < 0 && $("#timerule").val().length > 0){
        $("#nextOccurrence").text(r.nextOccurrence);
        $("#verify").addClass("btn-success");
        $("#verify").removeClass("btn-danger");
      }
      else{
        $("#verify").addClass("btn-danger");
        $("#verify").removeClass("btn-success");
      }
    });
    
  }
});

Template.ruleSubmit.rendered = function() {
    
  Meteor.defer(function() {
    var selVal = $('#resource_select').val();
    Session.set("selectedResource", selVal);
    console.log("Selected resource: "+Resources.findOne(selVal).title);
    $("[name=title]").focus();
    console.log("Rendered submit form.");
  });
};