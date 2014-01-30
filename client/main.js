Deps.autorun(function() {
  var count = Rules.find().fetch();
  Meteor.call('scheduleOccurrences');
});
