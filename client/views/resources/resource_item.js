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
    return new Date(this.datetime);
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
  }
});

Template.resourceItem.events({
  'click #delete-btn' : function(evt){
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
  },

  'mouseenter #delete-btn' : function(evt){
    $(evt.target).addClass("btn-danger");
  },
  'mouseleave #delete-btn' : function(evt){
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