
Template.resourceList.helpers({
  resourceMeasurement: function() {
    var measurementTypeId = Types.find({title: 'Measurement'}).fetch()[0]._id;
    return Resources.find({typeId: measurementTypeId},{sort: {title: 1}});
  },
  resourceDigitalOutput: function() {
    var digitalTypeId = Types.find({title: 'Digital'}).fetch()[0]._id;
    return Resources.find({typeId: digitalTypeId},{sort: {plcVar: 1}});
  },
  resourceAnalogOutput: function() {
    var analogTypeId = Types.find({title: 'Analog'}).fetch()[0]._id;
    return Resources.find({typeId: analogTypeId},{sort: {plcVar: 1}});
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