Template.settingsPage.helpers({
  plcTime : function(){
    //TODO Read time from PLC
    return new Date();
  },
  plcIpAddress : function(){
    //TODO Make editable and store in database
    return "192.168.0.87";
  }
});

Template.settingsPage.events({
});