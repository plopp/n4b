var schedule = Meteor.require('node-schedule');
var later = Meteor.require('later');
later.date.localTime()
var Fiber = Npm.require('fibers');

//Checks to see if anything should be done this minute
var minuteRule = new schedule.RecurrenceRule();
minuteRule.second = 0;

doJobFiberTask = Fiber(function(){
  //Check if any rule should be performed by matching occurences
    //for every rule.
    occurrences = Occurrences.find().fetch();
    for (var h = occurrences.length - 1; h >= 0; h--) {
      if(new Date(occurrences[h].datetime) < new Date()){
        curRule = Rules.findOne(occurrences[h].ruleId);
        console.log(curRule.title + " has changed value to "+curRule.value);
        Occurrences.remove(occurrences[h]._id);
        console.log("Occurrence "+occurrences[h]._id+" has been removed. Remaining: "+Occurrences.find().count());
      }
    };
    console.log('Minute check done.');
});

var minuteJob = schedule.scheduleJob(minuteRule, function(){ //Checks if any resource value should change
    doJobFiberTask.run();
});

//Calculates the upcoming weeks occurrences
var weekRule = new schedule.RecurrenceRule(); //Calculates the upcoming weeks occurrences
weekRule.dayOfWeek = 0;
weekRule.hour = 12;
weekRule.minute = 0;
weekRule.second = 0;

calcOccurrencesFiberTask = Fiber(function(){
      var schedule = Meteor.require('node-schedule');
      var later = Meteor.require('later');

      console.log("Starting calculation of occurrences...");

      var nextSunday = later.schedule(later.parse.text("at 12:00 on sunday")).next();
      console.log("nextSunday: "+nextSunday);
      console.log("Scheduling from: "+new Date().toString()+" to "+nextSunday);

      //Clear existing occurrences that are newer than now - the remaining ones will have been missed and needs
      //to be performed.

      rulesArr = Rules.find().fetch();
      var k = 0;
      for (var i = rulesArr.length - 1; i >= 0; i--) {
        calculatedOccurrences = later.schedule(later.parse.text(rulesArr[i].timerule)).next(11000,new Date(), nextSunday);
        for (var j = calculatedOccurrences.length - 1; j >= 0; j--) {
          if(Occurrences.find({ruleId: rulesArr[i]._id, datetime: new Date(calculatedOccurrences[j]).getTime()}).count() === 0){
            Occurrences.insert({ruleId: rulesArr[i]._id, datetime: new Date(calculatedOccurrences[j]).getTime()});
            console.log("Scheduled "+Rules.findOne(rulesArr[i]._id).title+" at "+new Date(calculatedOccurrences[j]).toString()+" with rule "+rulesArr[i].timerule);
            k++;
          }
        };
      }
      console.log("Added "+k+" occurrences. "+Occurrences.find().count()+" in total.");
      console.log('Calculating new occurrences done.');
    });

//Occurrences.remove({});
//if(Occurrences.find().count() === 0){
  calcOccurrencesFiberTask.run();
//}

var recurSchedJob2 = schedule.scheduleJob(weekRule, function(){
  calcOccurrencesFiberTask.run();
  });


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
  },
  verifyTimerule: function(rule){
    var sched = later.parse.text(rule);
    occurrence = later.schedule(sched).next(1);

    return {
      result: sched.error,
      nextOccurrence: occurrence
    }
  }
});