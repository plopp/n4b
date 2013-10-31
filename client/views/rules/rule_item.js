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
  }
});