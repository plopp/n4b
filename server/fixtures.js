var schedule = Meteor.require('node-schedule');

if(Types.find().count() === 0){
    var digital = Types.insert({
      title: 'Digital'
    });
    
    var analog = Types.insert({
      title: 'Analog',
      unit: ''
    });

    var analogTempDegreesCelsius = Types.insert({
      title: 'Analog Temp °C',
      unit: '°C'
    })
}

if(Resources.find().count() === 0){
  var stove1 = Resources.insert({
    title: 'Stove',
    typeId: analog._id,
    unit: ''
  });
  
  var lampKitchen = Resources.insert({
    title: 'Kitchen lamp',
    typeId: digital._id,
  });

  var centralHeating = Resources.insert({
    title: 'Central heating',
    typeId: analog._id,
    unit: '°C'
  });

  var outlet1 = Resources.insert({
    title: 'Outlet livingroom',
    typeId: digital._id
  });

  var outlet2 = Resources.insert({
    title: 'Outlet bedroom',
    typeId: digital._id
  });

  var outlet3 = Resources.insert({
    title: 'Outlet bedroom 2',
    typeId: digital._id
  });

  var showerWater = Resources.insert({
    title: 'Shower water',
    typeId: digital._id
  });

  var bathroomVent = Resources.insert({
    title: 'Bathroom ventilation',
    typeId: digital._id
  });

}

// Fixture data 
if (Scenarios.find().count() === 0) {
  var now = new Date().getTime();

  // create two users
  var adminId = Meteor.users.insert({
    profile: { name: 'Administrator' }
  });
  var admin = Meteor.users.findOne(adminId);

  var exScenId = Scenarios.insert({
    title: 'Family coming home',
    userId: admin._id,
    author: admin.profile.name,
    submitted: now - 7 * 3600 * 1000
  });

  var exScenId2 = Scenarios.insert({
    title: 'Turn on shower',
    userId: admin._id,
    author: admin.profile.name,
    submitted: now - 8 * 3600 * 1000
  });

  var singleSchedJob1 = schedule.scheduleJob(new Date(2012, 11, 21, 5, 30, 0), function(){
      console.log('Job1 done.');
  });

  var rule = new schedule.RecurrenceRule();
  rule.second = 42;
  
  var recurSchedJob2 = schedule.scheduleJob(rule, function(){
    console.log('Job2 occurred.');
  });
  
  var job1 = Jobs.insert({
    scenId: exScenId,
    schedule: singleSchedJob1,
    recurring: false,
    finished: false
  });
  
  var job2 = Jobs.insert({
    scenId: exScenId,
    schedule: recurSchedJob2,
    recurring: true
  });

  Rules.insert({
    scenId: exScenId,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: now - 5 * 3600 * 1000,
    jobId: job1,
    value: 0,
    timerule: 'every wednesday at 3 pm',
    resourceId: stove1,
    title: 'Turn on stove.'
  });

  Rules.insert({
    scenId: exScenId,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: now - 3 * 3600 * 1000,
    jobId: job2,
    value: 22,
    valueMin: 10,
    valueMax: 35,
    timerule: 'every wednesday at 3 pm',
    resourceId: centralHeating,
    title: 'Lower heat.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: now - 3 * 3600 * 1000,
    jobId: job2,
    value: 0,
    timerule: 'every wednesday at 3 pm',
    resourceId: showerWater,
    title: 'Turn on water.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: now - 3 * 3600 * 1000,
    jobId: job2,
    value: 0,
    timerule: 'every wednesday at 3 pm',
    resourceId: showerWater,
    title: 'Turn off water.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: now - 3 * 3600 * 1000,
    jobId: job2,
    value: 0,
    timerule: 'every wednesday at 3 pm',
    resourceId: bathroomVent,
    title: 'Start ventilation in bathroom.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: now - 3 * 3600 * 1000,
    jobId: job2,
    value: 0,
    timerule: 'every wednesday at 3 pm',
    resourceId: bathroomVent,
    title: 'Stop ventilation in bathroom.'
  });
}