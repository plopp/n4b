var later = Npm.require('later');
later.date.localTime();
var schedule = Npm.require('node-schedule');


Meteor.methods({
  scheduleThis: function (ruleId) {
    //check(arg1, String);
    //check(arg2, [Number]);
    // .. do stuff ..
    rule = Rules.findOne(ruleId);
    console.log(rule.timerule);

    textSched = later.parse.text(rule.timerule);
    if (textSched.error > 0){
      throw new Meteor.Error(404, "Parse error "+textSched.error);
      return rule.scenId;
    }
    
    //For serialization purposes, methods are stripped
    var s = {schedules: textSched.schedules, exceptions: textSched.exceptions};

    function job(){
        console.log('The world is going to end today.');
    }


    s.ruleId = ruleId; //Append ruleId for backtracking the rule
    Jobs.insert(s); //For scheduling: schedule.scheduleJob(s.schedules, job);
    return rule.scenId;
  }
});