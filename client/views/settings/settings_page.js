Template.settingsPage.helpers({
  plcTime : function(){
    //TODO Read time from PLC
    return Session.get("time");
  },
  plcIpAddress : function(){
    //TODO Make editable and store in database
    return "10.90.1.10";
  },
  getNofOccurrences : function(){
  	return Occurrences.find().count();
  }
});

Meteor.setInterval(function(){
    Session.set('time', new Date());
},1000);

Template.settingsPage.events({
});
