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
    });

    var measurement = Types.insert({
      title: 'Measurement'
    });
}

var room1Temp;
var outsideTemp;

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

  room1Temp = Resources.insert({
    title: 'Room temperature',
    typeId: measurement,
    value: 0,
    unit: '°C',
    plcVar: 'MAIN.room1Temp'
  });

  outsideTemp = Resources.insert({
    title: 'Outside temperature',
    typeId: measurement,
    value: 0,
    unit: '°C',
    plcVar: 'MAIN.outsideTemp'
  });
}

function populateData(data){
  console.log(data);
}
if (Plotdata.find().count() === 0) {
  var jsonurl = "http://api.openweathermap.org/data/2.5/history/city/?id=2711537&cnt=30";

  var getreq = HTTP.get(jsonurl, function(error, result){
    if(!error){
      parsedContent = EJSON.parse(result.content);
      //console.log(.length);
      var samples = parsedContent.list;
      for(var i = 0; i<samples.length; i++){
        var time = new Date(parseInt(samples[i].dt)*1000).getTime();
        var value = samples[i].main.temp-273.15;
        var maxvalue = samples[i].main.temp_max-273.15;
        var minvalue = samples[i].main.temp_min-273.15;
        Plotdata.insert({datetime: time, value: value, maxvalue: maxvalue, minvalue: minvalue, resourceId: outsideTemp}); 
      }
    }
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
    timerule: 'at 11:47',
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
    timerule: 'at 11:47',
    resourceId: showerWater,
    title: 'Turn off water.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: new Date().getTime(),
    value: 0,
    timerule: 'at 11:47',
    resourceId: bathroomVent,
    title: 'Start ventilation in bathroom.'
  });

  Rules.insert({
    scenId: exScenId2,
    userId: admin._id,
    creator: admin.profile.name,
    submitted: new Date().getTime(),
    value: 0,
    timerule: 'at 11:47',
    resourceId: bathroomVent,
    title: 'Stop ventilation in bathroom.'
  });
}