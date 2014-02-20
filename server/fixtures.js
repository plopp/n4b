if(Types.find().count() === 0){
    var digital = Types.insert({
      title: 'Digital'
    });
    
    var analog = Types.insert({
      title: 'Analog',
    });

    var measurement = Types.insert({
      title: 'Measurement'
    });
}

var room1Temp;
var outsideTemp;

/*

Variabeldefinitioner:

DO - Sätts via scheman och tilldelar ex. MAIN.doWord1.X
Ska vara persistent!

MAIN.doWord1.0 := MAIN.r01;
  MAIN.r02;
  MAIN.r03;
  MAIN.r04;
  MAIN.r06;
  MAIN.r07;
  MAIN.r08;
  MAIN.r09;
  MAIN.r20;
  MAIN.r21;
  MAIN.r22;
  MAIN.r23;
  MAIN.r24;
  MAIN.r25;
  MAIN.r26;
  MAIN.r27;
  MAIN.r28;
  MAIN.r29;
  MAIN.r30;
  MAIN.r31;
  MAIN.r32;
  MAIN.r33;
  MAIN.r34;
  MAIN.r35;
  MAIN.r36;
  MAIN.r37;
  MAIN.r38;
  MAIN.r39;
  MAIN.r40;
  MAIN.r41;
  MAIN.r42;
  MAIN.r43;
  MAIN.r44;
  MAIN.r45;
  MAIN.r46;
  MAIN.r47;
  MAIN.r48;
  MAIN.r49;
  MAIN.r50;
  MAIN.r51;
  MAIN.r52;

DI 
*/

/*

  Gruppbeteckningar

  p01 = 3-fas Teknikutrymme Uttag 1
  p02 = 3-fas Teknikutrymme Uttag 2
  p03 = 3-fas Utanför WC plan 1
  p04 = 3-fas plan 2
  p05 = spis
  p06 = värmepump
  p07 = reserv
  p08 = reserv
  p09 = reserv

  p20 = 9:1 Vardagsrum
  p21 = 9:2 Vardagsrum
  p22 = 9:3 Pentry
  p23 = 9:14 Uterum
  p24 = 9:5 HWC
  p25 = 9:6 Entré
  p26 = 9:7 Vindfång
  p27 = 9:8 Teknikrum
  p28 = 9:9 Teknikrum
  p29 = 9:10 Teknikrum
  p30 = 9:11 Teknikrum
  p31 = 9:12 Teknikrum
  p32 = 9:13 Teknikrum
  p33 = 9:4 Teknikrum
  p34 = 9:15 Sovrum 2
  p35 = 9:16 Sovrum 3
  p36 = 9:17 Allrum
  p37 = 9:18 Allrum
  p38 = 9:19 Sovrum 1
  p39 = 9:20? Uttag uterum
  p40 = 9:21= Uttag Vindfång
  p41 = 10:1 Uttag WC
  p42 = 10:2 uttag Teknikrum
  p43 = 10:3 Uttag vinfgång
  p44 = 10:4 Uttag kök
  p45 = Spisfläkt
  p46 = Kyl/Micro
  p47 = Elradiator Vindfång
  p48 = DM?
  p49 = VU Sov1
  p50 = VU Allrum
  p51 = VU Sov2
  p52 = Golvbasenhet

  Anslutningstabell

  MAIN.diWord1.0 = p01
  MAIN.diWord1.1 = p02
  MAIN.diWord1.2 = p03
  MAIN.diWord1.3 = p04
  MAIN.diWord1.4 = p05
  MAIN.diWord1.5 = p06
  MAIN.diWord1.6 = p07
  MAIN.diWord1.7 = p08
  
  MAIN.diWord1.8 = p09
  MAIN.diWord1.9 = p20
  MAIN.diWord1.10 = p21
  MAIN.diWord1.11 = p22
  MAIN.diWord1.12 = p23
  MAIN.diWord1.13 = p24
  MAIN.diWord1.14 = p25
  MAIN.diWord1.15 = p26

  MAIN.diWord2.0 = p27
  MAIN.diWord2.1 = p28
  MAIN.diWord2.2 = p29
  MAIN.diWord2.3 = p30
  MAIN.diWord2.4 = p31
  MAIN.diWord2.5 = p32
  MAIN.diWord2.6 = p33
  MAIN.diWord2.7 = p34

  MAIN.diWord2.8 = p35
  MAIN.diWord2.9 = p36
  MAIN.diWord2.10 = p37
  MAIN.diWord2.11 = p38
  MAIN.diWord2.12 = p39
  MAIN.diWord2.13 = p40
  MAIN.diWord2.14 = p41
  MAIN.diWord2.15 = p42

  MAIN.diWord3.0 = p43
  MAIN.diWord3.1 = p44
  MAIN.diWord3.2 = p45
  MAIN.diWord3.3 = p46
  MAIN.diWord3.4 = p47
  MAIN.diWord3.5 = p48
  MAIN.diWord3.6 = p49
  MAIN.diWord3.7 = p50

  MAIN.diWord3.8 = p51
  MAIN.diWord3.9 = p52
  MAIN.diWord3.10 = p60ext
  MAIN.diWord3.11 = p61ext
  MAIN.diWord3.12 = p62ext
  MAIN.diWord3.13 = p63ext
  MAIN.diWord3.14 = p64ext
  MAIN.diWord3.15 = p65ext

  MAIN.diWord4.0 = p66ext
  MAIN.diWord4.1 = p67ext
  MAIN.diWord4.2 = p68ext
  MAIN.diWord4.3 = x
  MAIN.diWord4.4 = x
  MAIN.diWord4.5 = x
  MAIN.diWord4.6 = x
  MAIN.diWord4.7 = x

  MAIN.diWord4.8 = r60 230V relä
  MAIN.diWord4.9 = r61 230V relä
  MAIN.diWord4.10 = r62 230V relä
  MAIN.diWord4.11 = p70
  MAIN.diWord4.12 = slinga1 (F01-F09)
  MAIN.diWord4.13 = slinga2 (F20-F61)
  MAIN.diWord4.14 = slinga3 (F80-F97)
  MAIN.diWord4.15 = x

  MAIN.doWord1.0 = k01
  MAIN.doWord1.1 = k02
  MAIN.doWord1.2 = k03
  MAIN.doWord1.3 = k04
  MAIN.doWord1.4 = r20
  MAIN.doWord1.5 = r21
  MAIN.doWord1.6 = r22
  MAIN.doWord1.7 = r23

  MAIN.doWord1.8 = r24
  MAIN.doWord1.9 = r25
  MAIN.doWord1.10 = r26
  MAIN.doWord1.11 = r27
  MAIN.doWord1.12 = r28
  MAIN.doWord1.13 = r29
  MAIN.doWord1.14 = r30
  MAIN.doWord1.15 = r31

  MAIN.doWord2.0 = r32
  MAIN.doWord2.1 = r33
  MAIN.doWord2.2 = r34
  MAIN.doWord2.3 = r35
  MAIN.doWord2.4 = r36
  MAIN.doWord2.5 = r37
  MAIN.doWord2.6 = r38
  MAIN.doWord2.7 = r39

  MAIN.doWord2.8 = r40
  MAIN.doWord2.9 = r41
  MAIN.doWord2.10 = r42
  MAIN.doWord2.11 = r43
  MAIN.doWord2.12 = r44
  MAIN.doWord2.13 = r45
  MAIN.doWord2.14 = r46
  MAIN.doWord2.15 = r47

  MAIN.doWord3.0 = r48
  MAIN.doWord3.1 = r49
  MAIN.doWord3.2 = r50
  MAIN.doWord3.3 = r51
  MAIN.doWord3.4 = r52
  MAIN.doWord3.5 = x
  MAIN.doWord3.6 = A-larm DUC
  MAIN.doWord3.7 = B-larm DUC

  MAIN.doWord3.8 = x
  MAIN.doWord3.9 = x
  MAIN.doWord3.10 = x
  MAIN.doWord3.11 = x
  MAIN.doWord3.12 = x
  MAIN.doWord3.13 = x
  MAIN.doWord3.14 = x
  MAIN.doWord3.15 = x
  
  MAIN.doWord4.0 = k01
  MAIN.doWord4.1 = k01
  MAIN.doWord4.2 = k01
  MAIN.doWord4.3 = k01
  MAIN.doWord4.4 = k01
  MAIN.doWord4.5 = k01
  MAIN.doWord4.6 = k01
  MAIN.doWord4.7 = k01

  MAIN.doWord4.8 = k01
  MAIN.doWord4.9 = k01
  MAIN.doWord4.10 = k01
  MAIN.doWord4.11 = k01
  MAIN.doWord4.12 = k01
  MAIN.doWord4.13 = k01
  MAIN.doWord4.14 = k01
  MAIN.doWord4.15 = k01


  Styrningar AI/AO

*/

if(Resources.find().count() === 0){
  Resources.insert({
    title: 'Teknikrum, Uttag 1, 3-fas',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.k01'
  });

  Resources.insert({
    title: 'Teknikrum, Uttag 2, 3-fas',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.k02'
  });

  Resources.insert({
    title: 'Hall Plan 1, Uttag, 3-fas',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.k03'
  });

  Resources.insert({
    title: 'Plan 2, Uttag, 3-fas',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.k04'
  });

  Resources.insert({
    title: '9:1 Vardagsrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r20'
  });

  Resources.insert({
    title: '9:2 Vardagsrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r21'
  });

  Resources.insert({
    title: '9:3 Pentry',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r22'
  });

  Resources.insert({
    title: '9:14 Uterum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r23'
  });

  Resources.insert({
    title: '9:5 HWC',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r24'
  });

  Resources.insert({
    title: '9:6 Entré',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r25'
  });

  Resources.insert({
    title: '9:7 Vindfång',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r26'
  });

  Resources.insert({
    title: '9:8 Teknikrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r27'
  });

  Resources.insert({
    title: '9:9 Teknikrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r28'
  });

  Resources.insert({
    title: '9:10 Teknikrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r29'
  });

  Resources.insert({
    title: '9:11 Teknikrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r30'
  });

  Resources.insert({
    title: '9:12 Teknikrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r31'
  });


  Resources.insert({
    title: '9:13 Teknikrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r32'
  });

  Resources.insert({
    title: '9:4 Teknikrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r33'
  });

  Resources.insert({
    title: '9:15 Sovrum 2',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r34'
  });

  Resources.insert({
    title: '9:16 Sovrum 3',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r35'
  });

  Resources.insert({
    title: '9:17 Allrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r36'
  });

  Resources.insert({
    title: '9:18 Allrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r37'
  });

  Resources.insert({
    title: '9:19 Sovrum 1',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r38'
  });

  Resources.insert({
    title: '9:20 Uterum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r39'
  });

  Resources.insert({
    title: '9:21 Vindfång',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r40'
  });

  Resources.insert({
    title: '10:1 WC',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r41'
  });

  Resources.insert({
    title: '10:2 Teknikrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r42'
  });

  Resources.insert({
    title: '10:3 Vindfång',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r43'
  });

  Resources.insert({
    title: '10:4 Kök',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r44'
  });

  Resources.insert({
    title: 'Spisfläkt',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r45'
  });

  Resources.insert({
    title: 'Kyl/Micro',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r46'
  });

  Resources.insert({
    title: 'Elradiator Vindfång',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r47'
  });

  Resources.insert({
    title: 'DM',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r48'
  });

  Resources.insert({
    title: 'VU Sov 1',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r49'
  });

  Resources.insert({
    title: 'VU Allrum',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r50'
  });

  Resources.insert({
    title: 'VU Sov 2',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r51'
  });

  Resources.insert({
    title: 'Golvbasenhet',
    typeId: digital,
    max: 1,
    min: 0,
    unit: '',
    value: 0,
    plcVar: 'MAIN.r52'
  });
/*
  var centralHeating = Resources.insert({
    title: 'Central heating',
    typeId: analog,
    max: 40,
    min: 5,
    unit: '°C',
    value: 0,
    plcVar: 'MAIN.centralHeating'
  });
*/
  
  Resources.insert({
    title: 'Temperatur teknikrum',
    typeId: measurement,
    value: 0,
    unit: '°C',
    plcVar: 'MAIN.room1Temp',
    formatString: "%.1f"
  });

  Resources.insert({
    title: 'Analogtest',
    typeId: analog,
    value: 0,
    unit: 'mV',
    plcVar: 'MAIN.analogtest',
    formatString: "%.1f"
  });

  outsideTemp = Resources.insert({
    title: 'Temperatur utomhus',
    typeId: measurement,
    value: 0,
    unit: '°C',
    plcVar: 'MAIN.outsideTemp',
    formatString: "%.1f"
  });

  Resources.insert({
    title: 'Effekt elnät in',
    typeId: measurement,
    value: 0,
    unit: 'W',
    plcVar: 'MAIN.totalPowerFromAbbMeter',
    logInterval: 1,
    formatString: "%.0f"
  });

  Resources.insert({
    title: 'Effekt solpanel in',
    typeId: measurement,
    value: 0,
    unit: 'W',
    plcVar: 'MAIN.pvPower',
    formatString: "%.0f"
  });

  Resources.insert({
    title: 'Effekt uppmätta uttag',
    typeId: measurement,
    value: 0,
    unit: 'W',
    plcVar: 'MAIN.totalPowerFromPulseMeters',
    logInterval: 1,
    formatString: "%.0f"
  });

  Resources.insert({
    title: 'Effektförbr. hushållsel',
    typeId: measurement,
    value: 0,
    unit: 'W',
    plcVar: 'MAIN.totalPowerNotMeasured',
    logInterval: 1,
    formatString: "%.0f"
  });


/*

  waterLevel = Resources.insert({
    title: '',
    typeId: measurement,
    value: 0,
    unit: 'm',
    plcVar: 'MAIN.waterLevelActWeb',
    //logInterval: 1,
    formatString: "%.3f"
  });

waterLevel = Resources.insert({
    title: 'Temp air',
    typeId: measurement,
    value: 0,
    unit: '°C',
    plcVar: 'MAIN.tempAirWeb',
    //logInterval: 1,
    formatString: "%.1f"
  });

waterLevel = Resources.insert({
    title: 'Temp water',
    typeId: measurement,
    value: 0,
    unit: '°C',
    plcVar: 'MAIN.tempWaterWeb',
    //logInterval: 5,
    formatString: "%.1f"
  });

prepWebIn = Resources.insert({
    title: 'Precipitation 1h',
    typeId: measurement,
    unit: 'mm',
    value: 0,
    plcVar: 'MAIN.precipitation1hrWeb',
    //logInterval: 1,
    formatString: "%d"
  });

prepWebOut = Resources.insert({
    title: 'Precipitation 1h',
    typeId: analog,
    max: 100,
    min: 0,
    unit: 'mm',
    value: 0,
    plcVar: 'MAIN.precipitation1hrWeb',
    formatString: "%d"
  });


*/

/*for (var i = 1; i < 3; i++) {
  tempInsert = Resources.insert({
    title: 't'+i.toString(),
    typeId: measurement,
    value: 0,
    unit: '°C',
    plcVar: 'MAIN.t'+i.toString(),
    logInterval: 1,
    formatString: "%.1f"
  });

  for (var j = 0; j < 200; j++) {
    value = 2*Math.sin(j)*j*Math.cos(j)+3*i;
    Plotdata.insert({datetime: 1392577993000-j*60000, value: value, maxvalue: value, minvalue: value, resourceId: tempInsert});   
  };
*/

};

/*for (var i = 1; i <= 50; i++) {
  Resources.insert({
    title: 'do'+i.toString(),
    typeId: digital,
    value: 0,
    unit: '',
    plcVar: 'MAIN.do'+i.toString(),
    logInterval: 0,
    formatString: "%d"
  });
};*/

/*
Resources.insert({
    title: 'up',
    typeId: measurement,
    value: 0,
    unit: '',
    plcVar: 'MAIN.up',
    logInterval: 1,
    formatString: "%d"
  });

Resources.insert({
    title: 'down',
    typeId: measurement,
    value: 0,
    unit: '',
    plcVar: 'MAIN.down',
    logInterval: 1,
    formatString: "%d"
  });

Resources.insert({
    title: 'left',
    typeId: measurement,
    value: 0,
    unit: '',
    plcVar: 'MAIN.left',
    logInterval: 1,
    formatString: "%d"
  });

Resources.insert({
    title: 'right',
    typeId: measurement,
    value: 0,
    unit: '',
    plcVar: 'MAIN.right',
    logInterval: 1,
    formatString: "%d"
  });

Resources.insert({
    title: 'enter',
    typeId: measurement,
    value: 0,
    unit: '',
    plcVar: 'MAIN.enter',
    logInterval: 1,
    formatString: "%d"
  });
*/

function populateData(data){
  console.log(data);
}
if (Plotdata.find().count() === 0) {
  
/*
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
  */
}



