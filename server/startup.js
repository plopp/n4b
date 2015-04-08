Meteor.startup(function(){
  console.log("Startup..");
  //Meteor.call('readAllPlcVarOnStartupMethod');
  //console.log(new Later);
  Meteor.call('scheduleOccurrences');
});

Meteor.publish('jobs', function(){
	return Jobs.find();
});

Meteor.publish('occurrences', function(){
	return Occurrences.find();
});

Meteor.publish('plotdata', function(){
	return Plotdata.find();
});

Meteor.publish('pvdata', function(){
	return Pvdata.find();
});

Meteor.publish('resources', function(){
	return Resources.find();
});

Meteor.publish('rules', function(){
	return Rules.find();
});

Meteor.publish('scenarios', function(){
	return Scenarios.find();
});

Meteor.publish('types', function(){
	return Types.find();
});