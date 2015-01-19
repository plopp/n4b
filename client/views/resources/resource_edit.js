Template.resourceEdit.helpers({
  resource : function(){
    var resourceId = Session.get("currentResourceId");
    if(resourceId){
      return Resources.findOne(resourceId);
    }
  }
});

/*
Handlebars.registerHelper('isHidden', function (a, b) {
      return (a === b)?' hidden': '';
    });
*/

Template.resourceEdit.events({
  'submit form': function(e) {
    e.preventDefault();
	
	var resourceId = Session.get("currentResourceId");
	Resources.update(
		{_id: resourceId}, 
		{$set: {
			title: $(e.target).find('[name=title]').val(), 
			unit: $(e.target).find('[name=unit]').val(),
			plcVar: $(e.target).find('[name=plc]').val()
		}}
	);
	Router.go('resourcePage');
  },

  'click .delete': function(e) {
    e.preventDefault();

    var currentRuleId = Session.get('currentRuleId');

    if(confirm("Deleting this resource will also remove all rules defined for it and also all occurrences created for it. Are you sure you want to delete it?")){      
        console.log("Deleting resource.");
        var rulesVector = Rules.find({resourceId:this._id});
        var rulesArr = rulesVector.fetch();
        for(var i = 0; i<rulesVector.count(); i++){
          var occVector = Occurrences.find({ruleId:rulesArr[i]._id});
          var occArr = occVector.fetch();
          for(var j = 0; j<occVector.count(); j++){
            Occurrences.remove(occArr[j]._id);
          }
          Rules.remove(rulesArr[i]._id);
        }
        Resources.remove(this._id);
        Router.go("/resources");
      } 
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