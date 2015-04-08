Template.ruleEdit.helpers({
  rule : function(){
    var ruleId = Session.get("currentRuleId");
    if(ruleId){
      return Rules.findOne(ruleId);
    }
  },
  resources : function(){
    //TODO If Types.find return more than one object there will be problems, that will happen if two Signal types are created with the same name.
    var type = Types.findOne({title: 'Measurement'});
    console.log("Fetching resources...");
    if(type){
      var resCurs = Resources.find({typeId: {$ne: type._id }});
      console.log(resCurs.count());
      return resCurs;
    }
  },
  selRes : function(){
    return Session.get("selectedResource");
  },
  valueTypeIsAnalog : function(resourceId){
    var selectedResource = Session.get("selectedResource");
    if(selectedResource == undefined){
      selectedResource = resourceId;
    }
    var res = Resources.findOne(selectedResource);
    if(res){
      var type = Types.findOne(res.typeId);
      if(type){
        return type.title === "Analog"; 
      }
    }
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
    var res = Resources.findOne(selectedResource);
    if(res){
      var type = Types.findOne(res.typeId);
      if(type){
        return type.title === "Digital"; 
      }
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
    if(selectedResource){
      return Resources.findOne(selectedResource).unit; 
      return Session.get("unit");
    }
  },
  max : function() {
    var selectedResource = Session.get("selectedResource");
    if(selectedResource){
        return Resources.findOne(selectedResource).max;; 
    }
  },
  min : function() {
    var selectedResource = Session.get("selectedResource");
    if(selectedResource){
        return Resources.findOne(selectedResource).min; 
    }
    //return Session.get("min");
  },
  getChecked : function() {
    var curRule = Session.get("currentRuleId");
    if(curRule){
      var rule = Rules.findOne(curRule);
      if(rule){        
        Session.set("checkboxVal",rule.value == 1 ? true : false);
        return (rule.value == 0 ? "" : "checked");
      }
    }
  },
  getVal : function() {
    return (Session.get("checkboxVal") == 0 ? "Off" : "On");
  },
  getResource : function(){
    var curRule = Session.get("currentRuleId");
    if(curRule){
      var rule = Rules.findOne(curRule);
      if(rule){
        return (rule.resourceId == this._id);        
      }
    }
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
        //val = $(e.target).find('[name=Value]').attr('checked') ? 1 : 0;
        val = Session.get("checkboxVal") ? 1 : 0; 
        break;
      default:
        val = 0;
        console.log("Resource type not found!");
    }

    var rule = {
      title: $(e.target).find('[name=title]').val(),
      resourceId: selRes,
      submitted: new Date().getTime(),
      value: val,
      timerule: $(e.target).find('[name=timerule]').val(),
    }

    console.log("Updated rule: ");
    console.log(rule);

    //Occurrences.remove({ruleId: this._id});

    var currentRuleId = Session.get('currentRuleId');
    var vector = Occurrences.find({ruleId:currentRuleId});
    var numOcc = vector.count();
    var arrOcc = vector.fetch();
    for(var i = 0; i < numOcc; i++){
      Occurrences.remove(arrOcc[i]._id);
    }
    console.log("Removed "+numOcc+" occurrences.");
    console.log("Updating rule: "+Session.get("currentRuleId"));
    rule._id = Rules.update(Session.get("currentRuleId"), {$set: rule}, function(error) {
      if (error) {
        // display the error to the user
        console.log(error.reason);
      } else {
        Meteor.call('scheduleOccurrences');
        Router.go("scenarioPage", {_id: Session.get("currentScenarioId")});
      }
    });


  },

  'click .delete': function(e) {
    e.preventDefault();

    var currentRuleId = Session.get('currentRuleId');

    if (confirm("Delete this post?")) {
      
      var vector = Occurrences.find({ruleId:currentRuleId});
      var numOcc = vector.count();
      var arrOcc = vector.fetch();
      for(var i = 0; i < numOcc; i++){
        Occurrences.remove(arrOcc[i]._id);
      }
      console.log("Removed "+numOcc+" occurrences.");

      Rules.remove(currentRuleId);
      Router.go('scenarioPage', {_id: Session.get("currentScenarioId")});
      /* TODO - make sure that every occurrence is cleaned */
    }
  },

  "change #resource_select": function(evt) {
    var resourceId = $(evt.target).val(); //The resource ID is stored in the value property in every option.
    Session.set("selectedResource", resourceId);
  },
  "change #valrange": function(evt){
    var val = $(evt.target).val();
    Session.set("val",val);
    console.log(val);
  },
  "change #valcheckbox": function(evt){

    Session.set("checkboxVal",!Session.get("checkboxVal"));    
	// $(evt.target).attr('checked') ? $(evt.target).attr('checked',false) : $(evt.target).attr('checked',true);
 //  var val = $(evt.target).attr('checked') ? 1 : 0;
 //  Session.set("val", val);
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
  //$('#resource_select').val("ccQbR8dnmi4voHRtq");
  // Meteor.defer(function() {
  //   console.log("redrawn...");
  //   console.log("Selected resource id: "+Session.get("selectedResource"));
  //   console.log("Text name: "+Resources.findOne(Session.get("selectedResource")).title);
  //   $('#resource_select').val("ccQbR8dnmi4voHRtq");
  //   $('#resource_select').val("ccQbR8dnmi4voHRtq");
  //   $('#resource_select').val("ccQbR8dnmi4voHRtq");
  //   $('#resource_select').val("ccQbR8dnmi4voHRtq");
  //   //var selVal = $('#resource_select').val();
  //   //console.log("DEBUG: Selected value:"+$('#resource_select').val();
  //   //Session.set("selectedResource", selVal);
  //   //console.log("Selected resource: "+Resources.findOne(selVal).title);
  // });
};