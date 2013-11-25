Template.ruleEdit.helpers({
  rule : function(){
    return Rules.findOne(Session.get("currentRuleId"));
  },
  resources : function(){
    return Resources.find();
  },
  selRes : function(){
    return Session.get("selectedResource");
  },
  valueTypeIsAnalog : function(resourceId){
    var selectedResource = Session.get("selectedResource");
    if(selectedResource == undefined){
      selectedResource = resourceId;
    }
    return Types.findOne(Resources.findOne(selectedResource).typeId).title === "Analog"; 
    
    /*var selectedResId = Session.get("currentRuleId")
    if(selectedResId != undefined && resourceId != selectedResId){ //If selected resource differs form the store resourceId, the user has changed resource.
      return Types.findOne(Resources.findOne(selectedResId).typeId).title === "Analog";  
    }
    return Types.findOne(Resources.findOne(resourceId).typeId).title === "Analog";
    //return Session.get("resourceType") === "Analog"; //Is Either Analog or Digital*/
  },
  valueTypeIsDigital : function(resourceId){
    var selectedResource = Session.get("selectedResource");
    if(selectedResource == undefined){
      selectedResource = resourceId;
    }
    console.log(selectedResource);
    console.log(Resources.findOne(selectedResource).title);
    return Types.findOne(Resources.findOne(selectedResource).typeId).title === "Digital"; 
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
  },
  isTrue : function() {
    return (Rules.findOne(Session.get("currentRuleId")).value != 0 ? true : false);
  },
  getSelected : function(){
    return Rules.findOne(Session.get("currentRuleId")).resourceId;
  }
});

/*
Handlebars.registerHelper('isHidden', function (a, b) {
      return (a === b)?' hidden': '';
    });
*/

Template.ruleEdit.events({
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

    console.log("Submit val: "+val);
    var rule = {
      title: $(e.target).find('[name=title]').val(),
      resourceId: selRes,
      submitted: new Date().getTime(),
      value: val,
      timerule: $(e.target).find('[name=timerule]').val(),
    }
    console.log(rule);
    rule._id = Rules.update(Session.get("currentRuleId"), {$set: rule}, function(error) {
      if (error) {
        // display the error to the user
        console.log(error.reason);
      } else {
        Meteor.Router.to('scenarioPage', Session.get("currentScenarioId"));
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentRuleId = Session.get('currentRuleId');
      Rules.remove(currentRuleId);
      Meteor.Router.to('scenarioPage', Session.get("currentScenarioId"));
      /* TODO - make sure that every occurrence is cleaned */
    }
  },

  "change #resource_select": function(evt) {
    resourceId = $(evt.target).val(); //The resource ID is stored in the value property in every option.
    Session.set("selectedResource", resourceId)
  },
  "change #valrange": function(evt){
    val = $(evt.target).val();
    Session.set("val",val);
    console.log(val);
  },
  "change #valcheckbox": function(evt){
    val = $(evt.target).attr('checked') ? 1 : 0;
    Session.set("val", val);
    console.log(Session.get("val"));
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

Template.ruleEdit.rendered = function() {
    
    
/*
    var element = document.getElementById('valrange');
    if(element != null || element != undefined){
      //element.value = Session.get("val");
      element.points = 1
      element.max = curResource.max;
      element.min = curResource.min
      element.value = curRule.value;
      Session.set("val", curRule.value);
    }

    var element = document.getElementById('valcheckbox');
    if(element != null || element != undefined){
      //element.value = Session.get("val");
      curRule.value != 0 ? element.checked = false : element.checked = true;
      Session.set("val", curRule.value);
    }
    console.log("rendered");
    */
  Meteor.defer(function() {
    var selVal = $('#resource_select').val();
    Session.set("selectedResource", selVal);
    console.log("Selected resource: "+Resources.findOne(selVal).title);

    //Session.set("val", Rules.findOne(Session.get("currentRuleId")).value);
    /*var curRule = Rules.findOne(Session.get("currentRuleId"));
    var curResource = Resources.findOne(curRule.resourceId);
    Session.set("resourceId", curRule.resourceId);

    var type = Types.findOne(curResource.typeId); //Get the resource type.
    Session.set("resourceType", type.title);
    
    var element = document.getElementById('resource_select');
    element.value = Session.get("resourceId");

    var unit = curResource.unit;
    Session.set("unit", unit); //Doesn't matter if unit is undefined

    var max = curResource.max;
    Session.set("max", max);

    var min = curResource.min;
    Session.set("min",min);

    var element = document.getElementById('valcheckbox');
    if(element != null){
      console.log(curRule.value);
      $( "#valcheckbox" ).prop( "checked", curRule.value );
      //element.checked = curRule.value;
    }
*/
    /*var val = curRule.value;
    Session.set("val", val);
*/
    

    //Set initial resourceId session variable
//    

    //Set initial val session variable
    //Session.set("val", Rules.findOne(Session.get("currentRuleId")).value);

    //Set initial resourceType session variable
    

    /*
    
    */
    //element.value = Rules.findOne(Session.get("currentRuleId")).resourceId;
  });
};