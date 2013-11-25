Template.ruleItem.helpers({
  submittedText: function() {
    return new Date(this.submitted).toString();
  },
  resourceTitle: function() {
  	return Resources.findOne(this.resourceId).title.toLowerCase();
  },
  hasUnit: function(){
  	return Resources.findOne(this.resourceId).unit != null;
  },
  unit: function(){
  	return Resources.findOne(this.resourceId).unit;
  },
  jobs: function(){
  	return Jobs.find({ruleId: this._id});
  }
});

Template.ruleItem.events({
  'click #delete-btn' : function(evt){
      //Delete occurrences
      var vector = Occurrences.find({ruleId:this._id});
      var numOcc = vector.count();
      var arrOcc = vector.fetch();
      for(var i = 0; i < numOcc; i++){
        Occurrences.remove(arrOcc[i]._id);
      }
      console.log("Removed "+numOcc+" occurrences.");

      Rules.remove(this._id);
  }
});