Template.scenarioItem.helpers({
  usedResources: function() {
  	//coll = Rules.find({scenId: this._id});
  	//for(i = 0;i<coll.count();i++){
  	arr = []
  		Rules.find({scenId: this._id}).fetch().forEach(function(entry){
  			arr.push(Resources.findOne(entry.resourceId));
  		});
  		//console.log(i);
  		//console.log(coll.fetch()[i]);
  		//arr.push = Resources.findOne(coll.fetch()[i].resourceId);
  	//}

  	return arr;
  }
});

Template.scenarioItem.events({
  'click #delete-btn-scenario' : function(evt){
      //Delete occurrences
      var rulesVector = Rules.find({scenId:this._id});
      var rulesArr = rulesVector.fetch();
      for(var i = 0; i<rulesVector.count(); i++){
        var occVector = Occurrences.find({ruleId:rulesArr[i]._id});
        var occArr = occVector.fetch();
        for(var j = 0; j<occVector.count(); j++){
          Occurrences.remove(occArr[j]._id);
        }
        Rules.remove(rulesArr[i]._id);
      }
      Scenarios.remove(this._id);
      Meteor.Router.to("");
  },
  'mouseenter #delete-btn-scenario' : function(evt){
    $(evt.target).addClass("btn-danger");
  },
  'mouseleave #delete-btn-scenario' : function(evt){
    $(evt.target).removeClass("btn-danger");
  }
});