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
    next = later.schedule(textSched).next(1);
    console.log(next);



    var j = schedule.scheduleJob(later.schedule(textSched).next(1), job);

    function job(){
        console.log('The world is going to end today.');
        var j = schedule.scheduleJob(later.schedule(textSched).next(2)[1], job);
    }
    //console.log(j.job());
    //console.log(j);
    j.ruleId = ruleId;
    Jobs.insert(j);
    console.log(j);

    return rule.scenId;
  }
});