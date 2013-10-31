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
  },
  isScheduled: function(){
  	return Jobs.find({ruleId: this._id}).count() > 0;
  }
});