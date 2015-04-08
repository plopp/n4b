Template.ruleItem.helpers({
  submittedText: function() {
    return new Date(this.submitted).toString();
  },
  resourceTitle: function() {
    var res = Resources.findOne(this.resourceId);
    if(res){
  	 return res.title.toLowerCase();
    }
  },
  hasUnit: function(){
    var res = Resources.findOne(this.resourceId);
    if(res){
  	 return (res.unit != null);
    }
  },
  unit: function(){
    var res = Resources.findOne(this.resourceId);
    if(res){
     return res.unit;
    }  	
  },
  occurrences: function(){
  	return Occurrences.find({ruleId: this._id},{sort: {datetime: 1}});
  },
  getTimestamp: function(){
    return new Date(this.datetime);
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
  },
  'mouseenter #delete-btn' : function(evt){
    $(evt.target).addClass("btn-danger");
  },
  'mouseleave #delete-btn' : function(evt){
    $(evt.target).removeClass("btn-danger");
  },
  'click #view-occurrences' : function(evt){
    //TODO error if array length is larger than zero
    $($.find("#occ-"+this._id)[0]).toggle();
  }
});