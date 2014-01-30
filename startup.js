Meteor.startup(function(){
  console.log("Startup..");
  Meteor.call('scheduleOccurrences');
  
});