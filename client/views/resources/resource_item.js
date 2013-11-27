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

      Rules.remove(this._id);
      */
      /* TODO Handle delete of resource */
  },

  'mouseenter #delete-btn' : function(evt){
    $(evt.target).addClass("btn-danger");
  },
  'mouseleave #delete-btn' : function(evt){
    $(evt.target).removeClass("btn-danger");
  }
});

Template.resourceItem.rendered = function(){
  $(".edit-rule").hide();
  $(".delete-rule").hide();
}