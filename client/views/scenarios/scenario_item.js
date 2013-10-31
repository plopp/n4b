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