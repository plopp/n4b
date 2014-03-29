Template.resourceItem.helpers({
  resourceTitle: function() {
  	return Resources.findOne(this._id).title.toLowerCase();
  },
  hasUnit: function(){
  	return Resources.findOne(this._id).unit != null;
  },
  unit: function(){
  	return Resources.findOne(this._id).unit;
  },
  getTimestamp: function(){
    //return new Date(this.datetime);
    unix = Resources.findOne(this._id).timestamp;
    if(unix){
      return moment(new Date(unix)).fromNow();
    }
    else{
      return "never updated"
    }
  },
  getType: function(){
    return Types.findOne(Resources.findOne(this._id).typeId).title;
  },
  rules: function(){
    return Rules.find({resourceId: this._id});
  },
  hasRules : function(){
    return Rules.find({resourceId: this._id}).count() > 0;
  },
  isOutput: function() {
    var type = Types.findOne(this.typeId);
    return (type.title === 'Digital' || type.title === 'Analog');
  },
  isInput: function() {
    var type = Types.findOne(this.typeId);
    return (type.title === 'Measurement');
  },
  address : function() {
    return this.plcVar;
  },
  getNiceValue : function(){
    if(this.formatString){
      return sprintf(this.formatString,this.value);
    }
    else{
      return sprintf("%.1f",this.value);
    }
  }
});

Template.resourceItem.events({
  'click .delete-resource' : function(evt){
      //Delete occurrences
      /*var vector = Occurrences.find({ruleId:this._id});
      var numOcc = vector.count();
      var arrOcc = vector.fetch();
      for(var i = 0; i < numOcc; i++){
        Occurrences.remove(arrOcc[i]._id);
      }
      console.log("Removed "+numOcc+" occurrences.");

      Rules.remove({resourceId: this._id});
      
      Resources
      */
      /* TODO Handle delete of resource */
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
        //Meteor.Router.to("/resources");
      } 
  },

  'mouseenter .delete-resource' : function(evt){
    $(evt.target).addClass("btn-danger");
  },
  'mouseleave .delete-resource' : function(evt){
    $(evt.target).removeClass("btn-danger");
  },
  'click #view-rules' : function(evt){
    $("#showRulesDiv-"+this._id).toggle();
  }
});

Template.resourceItem.rendered = function(){
  $(".edit-rule").hide();
  $(".delete-rule").hide();
}