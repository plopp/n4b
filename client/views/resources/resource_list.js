
Template.resourceList.helpers({
  resource: function() {
    return Resources.find();
  }
});

Template.resourceList.events({
  'submit form': function(e) {
    e.preventDefault();
    console.log("submit");
    Meteor.Router.to('resourceSubmit');
  }
});