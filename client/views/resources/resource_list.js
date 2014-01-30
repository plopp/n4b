
Template.resourceList.helpers({
  resource: function() {
    return Resources.find({},{sort: {title: 1}});
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