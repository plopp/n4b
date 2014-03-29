
Template.resourceList.helpers({
  resourceMeasurement: function() { 	
	var cursor = Types.find({title: "Measurement"});
	if(cursor.count() > 0){
		var id = cursor.fetch()[0]._id;
		return Resources.find({typeId: id},{sort: {title: 1}});
	}	
  },
  resourceDigitalOutput: function() {
	var cursor = Types.find({title: "Digital"});
	if(cursor.count() > 0){
		var id = cursor.fetch()[0]._id;
		return Resources.find({typeId: id},{sort: {plcVar: 1}});
	}	
  },
  resourceAnalogOutput: function() {
	var cursor = Types.find({title: "Analog"});
	if(cursor.count() > 0){
		var id = cursor.fetch()[0]._id;
		return Resources.find({typeId: id},{sort: {plcVar: 1}});
	}
  },
  isOutput: function() {
  	var type = Types.findOne(this.typeId);
    return (type.title === 'Digital' || type.title === 'Analog');
  },
  isInput: function() {
    var type = Types.findOne(this.typeId);
    return (type.title === 'Measurement');
  }
});

Template.resourceList.events({
  'submit form': function(e) {
    e.preventDefault();
    console.log("submit");
    Meteor.Router.to('resourceSubmit');
  }
});