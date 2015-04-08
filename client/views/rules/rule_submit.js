Template.ruleSubmit.helpers({
  resources : function(){
    var digId = Types.findOne({title: 'Digital'});
    //var anaId = Types.findOne({title: 'Digital'});
    if(digId){
      var firstResource = Resources.findOne({typeId: digId._id});
      if(firstResource){
        //Session.set("selectedResource", firstResource._id);
        //TODO If Types.find return more than one object there will be problems, that will happen if two Signal types are created with the same name.
        return Resources.find({typeId: digId._id},{fields: {title: 1}});
      }
    }
  },
  valueTypeIsAnalog : function(){

    var selectedResource = Session.get("selectedResource");
    if(selectedResource == undefined){
      return false; //Error, default to false
    }

    var res = Resources.findOne(selectedResource);
    if(res){
      var typeId = res.typeId;
      var type = Types.findOne(typeId);
      if(type){
        return type.title === "Analog"; 
      }
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
    
    if(res){
      var typeId = res.typeId;
      var type = Types.findOne(typeId);
      if(type){
        return type.title === "Digital"; 
      }
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
  },
  getVal : function() {
	return (Session.get("checkboxVal") == 0 ? "Off" : "On");
    //return ($('input[name=Value]').prop("checked") ? "On" : "Off");
  },
  selRes : function(){
    console.log("WARNING - Session value changed: "+Session.get("selectedResource"));
    return Session.get("selectedResource");
  }
});


Template.ruleSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    var selRes = Session.get("selectedResource");
    console.log("Submitting: ",selRes);
    var val;
    switch(Types.findOne(Resources.findOne(selRes).typeId).title){
      case "Analog":
        val = Session.get("val");
        break;
      case "Digital":
        val = $(e.target).find('[name=Value]').prop("checked") ? 1 : 0;		
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
    console.log("DEBUG: "+rule.title);
    rule._id = Rules.insert(rule);
    Meteor.call('scheduleOccurrences');
    console.log("Scenario ID: "+Session.get("currentScenarioId"));
    Router.go("scenarioPage", {_id: Session.get("currentScenarioId")});
  },
  "change #resource_select": function(evt) {
    var resourceId = $(evt.target).val(); //The resource ID is stored in the value property in every option.
    console.log("CHANGED!",resourceId);
    Session.set("selectedResource", resourceId);
  },
  "change #valrange": function(evt){
    var val = $(evt.target).val();
    Session.set("val",val);
  },
  "change #valcheckbox": function(evt){
	Session.set("checkboxVal",!Session.get("checkboxVal"));    
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
    Session.set("checkboxVal",false);    
  //Meteor.defer(function() {
    /*var selVal = $('#resource_select').val();
    Session.set("selectedResource", selVal);
    console.log("Selected resource: "+Resources.findOne(selVal).title);
    $("[name=title]").focus();
    console.log("Rendered submit form.");*/
  //});
};