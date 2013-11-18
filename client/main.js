Deps.autorun(function() {
  console.log("New rule added: "+Rules.find().count());
  Meteor.call('scheduleOccurrences');
});