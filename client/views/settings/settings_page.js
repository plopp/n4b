Template.settingsPage.helpers({
  plcTime : function(){
    //TODO Read time from PLC
    return Session.get("time");
  },
  plcIpAddress : function(){
    //TODO Make editable and store in database
    return "192.168.0.87";
  }
});

Meteor.setInterval(function(){
    Session.set('time', new Date());
},1000);

Template.settingsPage.events({
});
