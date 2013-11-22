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
    typeId: analog,
    max: 6,
    min: 0,
    unit: '#',
    value: 0,
    plcVar: 'MAIN.stove'
  });
  
  var lampKitchen = Resources.insert({
    title: 'Kitchen lamp',
    typeId: digital,
    value: 0,
    plcVar: 'MAIN.kitchenLamp'
  });

  var centralHeating = Resources.insert({
    title: 'Central heating',
    typeId: analog,
    max: 40,
    min: 5,
    unit: '°C',
    value: 0,
    plcVar: 'MAIN.centralHeating'
  });

  var outlet1 = Resources.insert({
    title: 'Outlet livingroom',
    typeId: digital,
    value: 0,
    plcVar: 'MAIN.outletLivingroom'
  });

  var outlet2 = Resources.insert({
    title: 'Outlet bedroom',
    typeId: digital,
    value: 0,
    plcVar: 'MAIN.outletBedroom'
  });

  var outlet3 = Resources.insert({
    title: 'Outlet bedroom 2',
    typeId: digital,
    value: 0,
    plcVar: 'MAIN.outletBedroom2'
  });

  var showerWater = Resources.insert({
    title: 'Shower water',
    typeId: digital,
    value: 0,
    plcVar: 'MAIN.showerWater'
  });

  var bathroomVent = Resources.insert({
    title: 'Bathroom ventilation',
    typeId: digital,
    value: 0,
    plcVar: 'MAIN.bathroomVentilation'
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

  var job1 = undefined;/*Jobs.insert({
    scenId: exScenId,
    schedule: singleSchedJob1,
    recurring: false,
    finished: false
  });*/
  
  var job2 = undefined; /*Jobs.insert({
    scenId: exScenId,
    schedule: recurSchedJob2,
    recurring: true
  });*/

  Rules.insert({
    scenId: exScenId,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: new Date().getTime(),
    value: 0,
    timerule: 'every 4 hour on the 0th min on the 0th sec',
    resourceId: stove1,
    title: 'Turn on stove.'
  });

  Rules.insert({
    scenId: exScenId,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: new Date().getTime(),
    value: 22,
    valueMin: 10,
    valueMax: 35,
    timerule: 'at 11:47',
    resourceId: centralHeating,
    title: 'Lower heat.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: new Date().getTime(),
    value: 0,
    timerule: 'at 11:47',
    resourceId: showerWater,
    title: 'Turn on water.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: new Date().getTime(),
    value: 0,
    timerule: 'at 11:48',
    resourceId: showerWater,
    title: 'Turn off water.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: new Date().getTime(),
    value: 0,
    timerule: 'at 17:29',
    resourceId: bathroomVent,
    title: 'Start ventilation in bathroom.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: new Date().getTime(),
    value: 0,
    timerule: 'at 10:15 am',
    resourceId: bathroomVent,
    title: 'Stop ventilation in bathroom.'
  });
}