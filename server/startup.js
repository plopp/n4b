Meteor.startup(function(){
  console.log("Startup..");
  Meteor.call('readAllPlcVarOnStartupMethod');
  //Meteor.call('scheduleOccurrences');
});