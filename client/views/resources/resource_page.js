Template.resourcePage.helpers({
    
});

Template.resourcePage.events({
  'submit form': function(e) {
    e.preventDefault();
    
    Meteor.Router.to('resourceSubmit', this._id);
  }
});