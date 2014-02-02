var schedule = Meteor.require('node-schedule');
var later = Meteor.require('later');
later.date.localTime()
var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future')

//Checks to see if anything should be done this minute
var minuteRule = new schedule.RecurrenceRule();
minuteRule.second = 0;

var doJob = function(){
        doJobWithFuture().wait();
}.future();

var doJobWithFuture = function(){//Fiber(function(){
  //Check if any rule should be performed by matching occurences
    //for every rule.
    var future = new Future;
    var plcHandleNames = new Array();
    var plcValues = new Array();
    var occurrences = Occurrences.find().fetch();
    for (var h = occurrences.length - 1; h >= 0; h--) {
      if(new Date(occurrences[h].datetime) < new Date()){
        var curRule = Rules.findOne(occurrences[h].ruleId);
        Resources.update(curRule.resourceId, {$set: {value:curRule.value}});
        var curResource = Resources.findOne(curRule.resourceId);
        console.log(curResource.title + " has changed value to "+curResource.value);
        plcHandleNames.push(curResource.plcVar);
        plcValues.push(curResource.value);
        Occurrences.remove(occurrences[h]._id);
        console.log("Occurrence "+occurrences[h]._id+" has been removed. Remaining: "+Occurrences.find().count());
      }
    };
    if(plcHandleNames.length > 0){
      //We have data to write...do it
      future.return(sendToPlc(plcHandleNames, plcValues, 'write'));
    }
    console.log('Minute check done.');
};

//var minuteJob = schedule.scheduleJob(minuteRule, function(){ //Checks if any resource value should change
//});

var minute1log = schedule.scheduleJob(minuteRule, function(){ //Checks if any resource value should change
    doJob();
    collectLog(1);
});
var minute5log = schedule.scheduleJob('*/5 * * * *', function(){ //Checks if any resource value should change
    collectLog(5);
});
var minute10log = schedule.scheduleJob('*/10 * * * *', function(){ //Checks if any resource value should change
    collectLog(10);
});
var minute15log = schedule.scheduleJob('*/15 * * * *', function(){ //Checks if any resource value should change
    collectLog(15);
});

var collectLog = function(min){
    doLogWithFuture(min).wait();
}.future();


function doLogWithFuture(min){

    console.log("Start communication to PLC");
    var future = new Future;

    var plcHandleNames = new Array();
    var plcValues = new Array();
    console.log(min.toString()+" minute log");
    //Fetch all resources that have been configured to be sampled
    if(min > 0){
        res = Resources.find({logInterval: min}).fetch();
        for (var i = res.length - 1; i >= 0; i--) {
            curResource = res[i];
            plcHandleNames.push(curResource.plcVar);
            plcValues.push(curResource.value);
        };
        if(plcHandleNames.length > 0){
            console.log("Logging these resources: "+plcHandleNames.toString());
            future.return(sendToPlc(plcHandleNames, plcValues, 'read'));
        }
    }

    return future;
}

//Calculates the upcoming weeks occurrences
var weekRule = new schedule.RecurrenceRule(); //Calculates the upcoming weeks occurrences
weekRule.dayOfWeek = 0;
weekRule.hour = 12;
weekRule.minute = 0;
weekRule.second = 0;

var calcOcc = function(){
        calcOccWithFuture().wait();
}.future();

var calcOccWithFuture = function(){//Fiber(function(){
  //Check if any rule should be performed by matching occurences
    //for every rule.
    var future = new Future;
    var schedule = Meteor.require('node-schedule');
    var later = Meteor.require('later');

    console.log("Starting calculation of occurrences...");

    var nextSunday = later.schedule(later.parse.text("at 12:00 on sunday")).next();
    console.log("nextSunday: "+nextSunday);
    console.log("Scheduling from: "+new Date().toString()+" to "+nextSunday);

    //Clear existing occurrences that are newer than now - the remaining ones will have been missed and needs
    //to be performed.


    var rulesArr = Rules.find().fetch();
    var k = 0;
    var m = 0;
    for (var i = rulesArr.length - 1; i >= 0; i--) {
        calculatedOccurrences = later.schedule(later.parse.text(rulesArr[i].timerule)).next(11000,new Date(), nextSunday);
        for (var j = calculatedOccurrences.length - 1; j >= 0; j--) {
          if(Occurrences.find({ruleId: rulesArr[i]._id, datetime: new Date(calculatedOccurrences[j]).getTime()}).count() === 0){
              Occurrences.insert({ruleId: rulesArr[i]._id, datetime: new Date(calculatedOccurrences[j]).getTime()});
              //console.log("Scheduled "+Rules.findOne(rulesArr[i]._id).title+" at "+new Date(calculatedOccurrences[j]).toString()+" with rule "+rulesArr[i].timerule);
              k++;
          }
        };
    }
    //console.log("Added "+k+" occurrences. "+Occurrences.find().count()+" in total.");
    //console.log('Calculating new occurrences done.');
    return future
};

//var calcOccurrencesFiberTask = Fiber(function(){
      
//});


var recurSchedJob2 = schedule.scheduleJob(weekRule, function(){
  console.log("Weekrule");
  calcOcc();
  });


Meteor.methods({
  verifyTimerule: function(rule){
    var sched = later.parse.text(rule);
    occurrence = later.schedule(sched).next(1);

    return {
      result: sched.error,
      nextOccurrence: occurrence
    }
  },
  scheduleOccurrences: function(){
    console.log("Reschedule");
    calcOcc();

  },
  removeAllOccurrences: function(){
    Occurrences.remove({});
  }
});

/*!
  The following code is a modified version from Beckhoff Automation GmbH's TcAdsWebService.js
*/

/* TwinCat Ads Web Service Object for communication with PLC */
var TcAdsWebService = new (function () {
    var XMLHttpRequest = Meteor.require("xmlhttprequest").XMLHttpRequest;
    this.Response = (function (hasError, error, reader, isBusy) {

        this.isBusy = isBusy;
        this.hasError = hasError;
        this.error = error;
        this.reader = reader;
        this.getTypeString = (function () {
            return "TcAdsWebService.Response";
        });

    });

    this.Error = (function (errorMessage, errorCode) {
        //console.log("TcAdsWebService.Error: "+errorMessage+" Code: "+errorCode);
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
        this.getTypeString = (function () {
            return "TcAdsWebService.Error";
        });

    });

    this.ResquestError = (function (requestStatus, requestStatusText) {
        //console.log("TcAdsWebService.ResquestError: "+requestStatus+" Code: "+requestStatusText);
        this.requestStatus = requestStatus;
        this.requestStatusText = requestStatusText;
        this.getTypeString = (function () {
            return "TcAdsWebService.ResquestError";
        });

    });

    this.Client = (function (sServiceUrl, sServiceUser, sServicePassword) {
        //console.log("Creating a client to "+sServiceUrl+" User: "+sServiceUser+" Pass: "+sServicePassword);
        this.getTypeString = (function () {
            return "TcAdsWebService.Client";
        });

        this.readwrite = (function (sNetId, nPort, nIndexGroup, nIndexOffset, cbRdLen, pwrData, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

            var message =
                    "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<SOAP-ENV:Envelope " +
                    "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                    "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                    "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                    "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                    "<SOAP-ENV:Body><q1:ReadWrite xmlns:q1=\"http://beckhoff.org/message/\">" +
                    "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                    "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                    "<indexGroup xsi:type=\"xsd:unsignedInt\">" + nIndexGroup + "</indexGroup>" +
                    "<indexOffset xsi:type=\"xsd:unsignedInt\">" + nIndexOffset + "</indexOffset>" +
                    "<cbRdLen xsi:type=\"xsd:int\">" + cbRdLen + "</cbRdLen>" +
                    "<pwrData xsi:type=\"xsd:base64Binary\">" + pwrData + "</pwrData>" +
                    "</q1:ReadWrite></SOAP-ENV:Body></SOAP-ENV:Envelope>";
            //console.log(message);
            return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.Readwrite", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);

        });

        this.readState = (function (sNetId, nPort, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

            var message =
                    "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<SOAP-ENV:Envelope " +
                    "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                    "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                    "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                    "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                    "<SOAP-ENV:Body><q1:ReadState xmlns:q1=\"http://beckhoff.org/message/\">" +
                    "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                    "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                    "</q1:ReadState></SOAP-ENV:Body></SOAP-ENV:Envelope>";

            return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.ReadState", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);
        });

        this.writeControl = (function (sNetId, nPort, adsState, deviceState, pData, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

            var message =
                    "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<SOAP-ENV:Envelope " +
                    "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                    "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                    "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                    "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                    "<SOAP-ENV:Body><q1:WriteControl xmlns:q1=\"http://beckhoff.org/message/\">" +
                    "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                    "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                    "<adsState xsi:type=\"xsd:int\">" + adsState + "</adsState>" +
                    "<deviceState xsi:type=\"xsd:int\">" + deviceState + "</deviceState>" +
                    "<pData xsi:type=\"xsd:base64Binary\">" + pData + "</pData>" +
                    "</q1:WriteControl></SOAP-ENV:Body></SOAP-ENV:Envelope>";

            return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.WriteControl", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);
        });

        this.write = (function (sNetId, nPort, nIndexGroup, nIndexOffset, pData, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

            var message =
                    "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<SOAP-ENV:Envelope " +
                    "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                    "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                    "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                    "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                    "<SOAP-ENV:Body><q1:Write xmlns:q1=\"http://beckhoff.org/message/\">" +
                    "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                    "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                    "<indexGroup xsi:type=\"xsd:unsignedInt\">" + nIndexGroup + "</indexGroup>" +
                    "<indexOffset xsi:type=\"xsd:unsignedInt\">" + nIndexOffset + "</indexOffset>" +
                    "<pData xsi:type=\"xsd:base64Binary\">" + pData + "</pData>" +
                    "</q1:Write></SOAP-ENV:Body></SOAP-ENV:Envelope>";

            return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.Write", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);
        });

        this.read = (function (sNetId, nPort, nIndexGroup, nIndexOffset, cbLen, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {

            var message =
                    "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<SOAP-ENV:Envelope " +
                    "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance/\" " +
                    "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema/\" " +
                    "xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                    "SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\" >" +
                    "<SOAP-ENV:Body><q1:Read xmlns:q1=\"http://beckhoff.org/message/\">" +
                    "<netId xsi:type=\"xsd:string\">" + sNetId + "</netId>" +
                    "<nPort xsi:type=\"xsd:int\">" + nPort + "</nPort>" +
                    "<indexGroup xsi:type=\"xsd:unsignedInt\">" + nIndexGroup + "</indexGroup>" +
                    "<indexOffset xsi:type=\"xsd:unsignedInt\">" + nIndexOffset + "</indexOffset>" +
                    "<cbLen xsi:type=\"xsd:int\">" + cbLen + "</cbLen>" +
                    "</q1:Read></SOAP-ENV:Body></SOAP-ENV:Envelope>";

            return sendMessage(message, "http://beckhoff.org/action/TcAdsSync.Read", pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async);
        });

        var handleSyncResponse = function (xhr) {
            //console.log("Handle sync response...");
            var errorMessage = undefined, errorCode = 0;

            if (xhr.readyState != 4 || xhr.status != 200) {
                // Request has been aborted.
                //  Maybe because of timeout.
                var resp = undefined;
                try {
                    resp = new TcAdsWebService.Response(
                        true, new TcAdsWebService.ResquestError(xhr.status, xhr.statusText), undefined, false);
                } catch (err) {
                    // Internet Explorer throws exception on abort
                    resp = new TcAdsWebService.Response(
                        true, new TcAdsWebService.ResquestError(0, 0), undefined, false);
                }

                return resp;
            }
            var DOMParser = Meteor.require('xmldom').DOMParser;

            var sSoapResponse = new DOMParser().parseFromString(xhr.responseText);
            var faultstringNodes = sSoapResponse.getElementsByTagName('faultstring');
            if (faultstringNodes.length != 0) {

                errorMessage = faultstringNodes[0].firstChild.data;
                var errorCodeNodes = sSoapResponse.getElementsByTagName('errorcode');

                if (errorCodeNodes.length != 0) {
                    errorCode = sSoapResponse.getElementsByTagName('errorcode')[0].firstChild.data;
                } else {
                    errorCode = "-";
                }

                var resp = new TcAdsWebService.Response(
                            true, new TcAdsWebService.Error(errorMessage, errorCode), undefined, false);
                return resp;

            } else {

                var ppDataNodes = sSoapResponse.getElementsByTagName('ppData');
                var ppRdDataNodes = sSoapResponse.getElementsByTagName('ppRdData');
                var pAdsStateNodes = sSoapResponse.getElementsByTagName('pAdsState');
                var pDeviceStateNodes = sSoapResponse.getElementsByTagName('pDeviceState');

                var soapData = undefined;
                if (ppDataNodes.length != 0) {
                    //read
                    soapData = ppDataNodesfirstChild.data;
                } else if (ppRdDataNodes.length != 0) {
                    // readwrite
                    soapData = ppRdDataNodes[0].firstChild.data;
                } else if (pAdsStateNodes.length != 0 && pDeviceStateNodes.length) {
                    // readState
                    var adsState = pAdsStateNodes[0].firstChild.data;
                    var deviceState = pDeviceStateNodes[0].firstChild.data;

                    var writer = new TcAdsWebService.DataWriter();
                    writer.writeWORD(parseInt(adsState, 10));
                    writer.writeWORD(parseInt(deviceState, 10));

                    soapData = writer.getBase64EncodedData();
                }

                if (soapData) {
                    var resp = new TcAdsWebService.Response(
                                        false,
                                        undefined,
                                        new TcAdsWebService.DataReader(soapData), false);
                    return resp;
                } else {
                    // write completes without data in response
                    var resp = new TcAdsWebService.Response(false, undefined, undefined, false);
                    return resp;
                }
            }
        }

        var handleAsyncResponse = function (xhr, pCallback, userState) {
          //console.log("Handle async response...");
          //console.log("xhr.readystate: "+xhr.readyState);
            if (xhr.readyState < 4) {
                if (pCallback) {
                    var resp = new TcAdsWebService.Response(false, undefined, undefined, true);
                    pCallback(resp, userState);
                }
            }

            if (xhr.readyState == 4) {
                if (xhr.status == 200) {

                    var errorMessage = undefined, errorCode = 0;
                    var DOMParser = Meteor.require('xmldom').DOMParser;

                    fixResponse = xhr.responseText.replace(" >",">"); //Bug detected in Beckhoff SOAP-serialization, might affect actual data if it contains " >".
                    var sSoapResponse = new DOMParser().parseFromString(fixResponse, "application/xml");

                    // console.log("Status: "+xhr.status+" Response: "+sSoapResponse);
                    var faultstringNodes = sSoapResponse.getElementsByTagName('faultstring');


                    if (faultstringNodes.length != 0) {

                        errorMessage = faultstringNodes[0].firstChild.data;
                        var errorCodeNodes = sSoapResponse.getElementsByTagName('errorcode');

                        if (errorCodeNodes.length != 0) {
                            errorCode = sSoapResponse.getElementsByTagName('errorcode')[0].firstChild.data;
                        } else {
                            errorCode = "-";
                        }

                        if (pCallback) {
                            var resp = new TcAdsWebService.Response(
                                        true, new TcAdsWebService.Error(errorMessage, errorCode), undefined, false);
                            pCallback(resp, userState);
                        }

                    } else {

                        var ppDataNodes = sSoapResponse.getElementsByTagName('ppData');
                        // console.log("ppDataNodes: "+ppDataNodes);
                        var ppRdDataNodes = sSoapResponse.getElementsByTagName('ppRdData');
                        var pAdsStateNodes = sSoapResponse.getElementsByTagName('pAdsState');
                        var pDeviceStateNodes = sSoapResponse.getElementsByTagName('pDeviceState');
                        // console.log("Tags read...");
                        var soapData = undefined;
                        if (ppDataNodes.length != 0) {
                            //read
                            soapData = ppDataNodesfirstChild.data;
                        } else if (ppRdDataNodes.length != 0) {
                            // readwrite
                            soapData = ppRdDataNodes[0].firstChild.data;
                        } else if (pAdsStateNodes.length != 0 && pDeviceStateNodes.length) {
                            // readState
                            var adsState = pAdsStateNodes[0].firstChild.data;
                            var deviceState = pDeviceStateNodes[0].firstChild.data;

                            var writer = new TcAdsWebService.DataWriter();
                            writer.writeWORD(parseInt(adsState, 10));
                            writer.writeWORD(parseInt(deviceState, 10));

                            soapData = writer.getBase64EncodedData();
                        }
                        // console.log("Base64 encoded soapData: "+soapData);


                        if (soapData) {
                            if (pCallback) {
                                var resp = new TcAdsWebService.Response(
                                            false, undefined, new TcAdsWebService.DataReader(soapData), false);
                                if (pCallback)
                                    pCallback(resp, userState);
                            }
                        } else {

                            // write completes without data in response
                            if (pCallback) {
                                var resp = new TcAdsWebService.Response(false, undefined, undefined, false);
                                pCallback(resp, userState);
                            }
                        }


                    }

                } else {
                    // Request has been aborted.
                    //  Maybe because of timeout.
                    // console.log("Request aborted...xhr.status: "+xhr.status);
                    if (pCallback) {

                        var resp = undefined;
                        try {
                            resp = new TcAdsWebService.Response(
                        true, new TcAdsWebService.ResquestError(xhr.status, xhr.statusText), undefined, false);
                        } catch (err) {
                            // Internet Explorer throws exception on abort
                            resp = new TcAdsWebService.Response(
                        true, new TcAdsWebService.ResquestError(0, 0), undefined, false);
                        }
                        pCallback(resp, userState);
                    }
                }
            }
        }

        var sendMessage = function (message, method, pCallback, userState, ajaxTimeout, ajaxTimeoutCallback, async) {
            // console.log("Sending message...");
            if (async == null || async == undefined)
                async = true;

            var xhr = undefined;
            xhr = new XMLHttpRequest();

            if (xhr == undefined)
                return null;
            // console.log("XHR object is OK...");
            if (async) {
                // console.log("Async callback...");
                xhr.onreadystatechange = Meteor.bindEnvironment(function () {
                    handleAsyncResponse(xhr, pCallback, userState);
                });
            }

            if (sServiceUser && sServicePassword) {
                // console.log("Opening XHR with password and user...");
                xhr.open("POST", sServiceUrl, async, sServiceUser, sServicePassword);
            } else {
                // console.log("Opening XHR...");
                xhr.open("POST", sServiceUrl, async);
            }

            if ("timeout" in xhr && ajaxTimeout)
               // console.log("Timeout in XHR...");
                xhr.timeout = ajaxTimeout;

            if ("ontimeout" in xhr && ajaxTimeoutCallback) {
                // console.log("Timeout in XHR...");
                xhr.ontimeout = ajaxTimeoutCallback;
            }

            // console.log("Setting request header...");
            xhr.setRequestHeader("Content-Type", "text/xml; charset=utf-8");

            console.log("Nof Bytes: "+2*message.length);
            xhr.send(message);

            if (!async) {
                // console.log("Returning non async response handler.");
                return handleSyncResponse(xhr);
            }
            else {
                // console.log("Returning null since response handler is async.");
                return null;
            }
        }
    });

    this.DataReader = (function (data) {
        // console.log("Datareader..."+data);
        this.offset = 0;
        console.log("Data: "+data);
        this.decodedData = Base64.decode(data);

        this.getTypeString = (function () {
            return "TcAdsWebService.DataReader";
        });

        this.readSINT = (function () {
            var res = convertDataToInt(this.decodedData.substr(this.offset, 1), 1);
            this.offset = this.offset + 1;
            return res;
        });

        this.readINT = (function () {
            var res = convertDataToInt(this.decodedData.substr(this.offset, 2), 2);
            this.offset = this.offset + 2;
            return res;
        });

        this.readDINT = (function () {
            var res = convertDataToInt(this.decodedData.substr(this.offset, 4), 4);
            this.offset = this.offset + 4;
            return res;
        });

        this.readBYTE = (function () {
            var res = convertDataToUInt(this.decodedData.substr(this.offset, 1), 1);
            this.offset = this.offset + 1;
            return res;
        });

        this.readWORD = (function () {
            var res = convertDataToUInt(this.decodedData.substr(this.offset, 2), 2);
            this.offset = this.offset + 2;
            return res;
        });

        this.readDWORD = (function () {
            var res = convertDataToUInt(this.decodedData.substr(this.offset, 4), 4);
            this.offset = this.offset + 4;
            return res;
        });

        this.readBOOL = (function () {
            var res = this.decodedData.substr(this.offset, 1).charCodeAt(0);
            this.offset = this.offset + 4;
            return res;
        });

        this.readString = (function (length) {

            if (isNaN(length)) {
                throw "Parameter \"length\" has to be a valid number.";
            }

            var res = this.decodedData.substr(this.offset, length);
            this.offset = this.offset + length;
            return res;
        });

        this.readREAL = (function () {
            var decData = [];
            decData[0] = convertDataToUInt(this.decodedData.substr(this.offset + 0, 1), 1);
            decData[1] = convertDataToUInt(this.decodedData.substr(this.offset + 1, 1), 1);
            decData[2] = convertDataToUInt(this.decodedData.substr(this.offset + 2, 1), 1);
            decData[3] = convertDataToUInt(this.decodedData.substr(this.offset + 3, 1), 1);

            var binData = [];
            binData[0] = dec2Binary(decData[0]);
            binData[1] = dec2Binary(decData[1]);
            binData[2] = dec2Binary(decData[2]);
            binData[3] = dec2Binary(decData[3]);

            var binStr = binData[3] + binData[2] + binData[1] + binData[0];

            var res = binary2Real(binStr, TcAdsWebService.TcAdsWebServiceDataTypes.REAL);
            this.offset = this.offset + 4;
            return res;
        });

        this.readLREAL = (function () {
            var decData = [];
            decData[0] = convertDataToUInt(this.decodedData.substr(this.offset + 0, 1), 1);
            decData[1] = convertDataToUInt(this.decodedData.substr(this.offset + 1, 1), 1);
            decData[2] = convertDataToUInt(this.decodedData.substr(this.offset + 2, 1), 1);
            decData[3] = convertDataToUInt(this.decodedData.substr(this.offset + 3, 1), 1);
            decData[4] = convertDataToUInt(this.decodedData.substr(this.offset + 4, 1), 1);
            decData[5] = convertDataToUInt(this.decodedData.substr(this.offset + 5, 1), 1);
            decData[6] = convertDataToUInt(this.decodedData.substr(this.offset + 6, 1), 1);
            decData[7] = convertDataToUInt(this.decodedData.substr(this.offset + 7, 1), 1);

            var binData = [];
            binData[0] = dec2Binary(decData[0]);
            binData[1] = dec2Binary(decData[1]);
            binData[2] = dec2Binary(decData[2]);
            binData[3] = dec2Binary(decData[3]);
            binData[4] = dec2Binary(decData[4]);
            binData[5] = dec2Binary(decData[5]);
            binData[6] = dec2Binary(decData[6]);
            binData[7] = dec2Binary(decData[7]);

            var binStr = binData[7] + binData[6] + binData[5] + binData[4] + binData[3] + binData[2] + binData[1] + binData[0];

            var res = binary2Real(binStr, TcAdsWebService.TcAdsWebServiceDataTypes.LREAL);
            this.offset = this.offset + 8;
            return res;
        });
    });

    this.DataWriter = (function () {
        // console.log("DataWriter");
        this.getTypeString = (function () {
            return "TcAdsWebService.DataWriter";
        });

        this.getBase64EncodedData = (function () {
            return Base64.encode(byteArrayToBinaryString(byteArray));
        });

        this.writeSINT = (function (value) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.Integer, 1, byteArray);
        });

        this.writeINT = (function (value) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.Integer, 2, byteArray);
        });

        this.writeDINT = (function (value) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.Integer, 4, byteArray);
        });

        this.writeBYTE = (function (value) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.UnsignedInteger, 1, byteArray);
        });

        this.writeWORD = (function (value) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.UnsignedInteger, 2, byteArray);
        });

        this.writeDWORD = (function (value) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.UnsignedInteger, 4, byteArray);
        });

        this.writeBOOL = (function (value) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.BOOL, 1, byteArray);
        });

        this.writeString = (function (value, length) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.String, length, byteArray);
        });

        this.writeREAL = (function (value) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.REAL, 4, byteArray);
        });

        this.writeLREAL = (function (value) {
            byteArray = PrepareData(value, TcAdsWebService.TcAdsWebServiceDataTypes.LREAL, 8, byteArray);
        });

        var byteArray = [];

        var PrepareData = function (data, type, len, array) {
            var j = array.length;

            if (type == TcAdsWebService.TcAdsWebServiceDataTypes.String) {
                var k;

                for (k = 0; k < data.length; k++) {
                    array[j++] = data.charCodeAt(k);
                }

                for (; k < len; k++) {
                    array[j++] = 0;
                }

            }
            else if (type == TcAdsWebService.TcAdsWebServiceDataTypes.BOOL) {
                array[j++] = data;
            }
            else if (type == TcAdsWebService.TcAdsWebServiceDataTypes.Integer || type == TcAdsWebService.TcAdsWebServiceDataTypes.UnsignedInteger) {

                if (len == 1) {
                    array[j++] = ToByte(parseInt((data >> (0)), 10));
                }
                else if (len == 2) {
                    data = parseInt(data);
                    array[j++] = ToByte(parseInt((data >> (0)), 10));
                    array[j++] = ToByte(parseInt((data >> (8)), 10));
                }
                else if (len == 4) {
                    data = parseInt(data);

                    if (isNaN(data))
                        data = 0;

                    array[j++] = ToByte(parseInt((data >> (0)), 10));
                    array[j++] = ToByte(parseInt((data >> (8)), 10));
                    array[j++] = ToByte(parseInt((data >> (16)), 10));
                    array[j++] = ToByte(parseInt((data >> (24)), 10));
                }
            }
            else if (type == TcAdsWebService.TcAdsWebServiceDataTypes.REAL) {
                var binary = real2Binary(data, type);

                var subBytes = [];
                subBytes[0] = binary.substring(0, 8);
                subBytes[1] = binary.substring(8, 16);
                subBytes[2] = binary.substring(16, 24);
                subBytes[3] = binary.substring(24, 32);

                array[j++] = binary2Dec(subBytes[3]);
                array[j++] = binary2Dec(subBytes[2]);
                array[j++] = binary2Dec(subBytes[1]);
                array[j++] = binary2Dec(subBytes[0]);
            }
            else if (type == TcAdsWebService.TcAdsWebServiceDataTypes.LREAL) {
                var binary = real2Binary(data, type);

                var subBytes = [];
                subBytes[0] = binary.substring(0, 8);
                subBytes[1] = binary.substring(8, 16);
                subBytes[2] = binary.substring(16, 24);
                subBytes[3] = binary.substring(24, 32);

                subBytes[4] = binary.substring(32, 40);
                subBytes[5] = binary.substring(40, 48);
                subBytes[6] = binary.substring(48, 56);
                subBytes[7] = binary.substring(56, 64);

                array[j++] = binary2Dec(subBytes[7]);
                array[j++] = binary2Dec(subBytes[6]);
                array[j++] = binary2Dec(subBytes[5]);
                array[j++] = binary2Dec(subBytes[4]);
                array[j++] = binary2Dec(subBytes[3]);
                array[j++] = binary2Dec(subBytes[2]);
                array[j++] = binary2Dec(subBytes[1]);
                array[j++] = binary2Dec(subBytes[0]);
            }

            return array;
        }
    });

    this.TcAdsReservedIndexGroups = {
        "PlcRWMX": 16416,
        "PlcRWMB": 16416,
        "PlcRWRB": 16432,
        "PlcRWDB": 16448,
        "SymbolTable": 61440,
        "SymbolName": 61441,
        "SymbolValue": 61442,
        "SymbolHandleByName": 61443,
        "SymbolValueByName": 61444,
        "SymbolValueByHandle": 61445,
        "SymbolReleaseHandle": 61446,
        "SymbolInfoByName": 61447,
        "SymbolVersion": 61448,
        "SymbolInfoByNameEx": 61449,
        "SymbolDownload": 61450,
        "SymbolUpload": 61451,
        "SymbolUploadInfo": 61452,
        "SymbolNote": 61456,
        "IOImageRWIB": 61472,
        "IOImageRWIX": 61473,
        "IOImageRWOB": 61488,
        "IOImageRWOX": 61489,
        "IOImageClearI": 61504,
        "IOImageClearO": 61520,
        "DeviceData": 61696
    };

    this.TcAdsWebServiceDataTypes = {
        "String": 0,
        "BOOL": 1,
        "Integer": 2,
        "UnsignedInteger": 3,
        "LREAL": 4,
        "REAL": 5
    };

    this.AdsState = {
        "INVALID" : 0,
        "IDLE" : 1,
        "RESET" : 2,
        "INIT" : 3,
        "START" : 4,
        "RUN" : 5,
        "STOP" : 6,
        "SAVECFG" : 7,
        "LOADCFG" : 8,
        "POWERFAILURE" : 9,
        "POWERGOOD" : 10,
        "ERROR" : 11,
        "SHUTDOWN" : 12,
        "SUSPEND" : 13,
        "RESUME" : 14,
        "CONFIG" : 15,  
        "RECONFIG" : 16 
    };

    var byteArrayToBinaryString = function (arr) {
        var res = "";
        for (var i = 0; i < arr.length; i++) {
            res += String.fromCharCode(arr[i] & 0xFF);
        }
        return res;
    }

    var Base64 = (function () {

        var encode = function (data) {
            var out = "", c1, c2, c3, e1, e2, e3, e4;
            for (var i = 0; i < data.length; ) {
                c1 = data.charCodeAt(i++);
                c2 = data.charCodeAt(i++);
                c3 = data.charCodeAt(i++);
                e1 = c1 >> 2;
                e2 = ((c1 & 3) << 4) + (c2 >> 4);
                e3 = ((c2 & 15) << 2) + (c3 >> 6);
                e4 = c3 & 63;
                if (isNaN(c2))
                    e3 = e4 = 64;
                else if (isNaN(c3))
                    e4 = 64;
                out += tab.charAt(e1) + tab.charAt(e2) + tab.charAt(e3) + tab.charAt(e4);
            }
            return out;
        }

        var decode = function (data) {
            var out = "", c1, c2, c3, e1, e2, e3, e4;
            for (var i = 0; i < data.length; ) {
                e1 = tab.indexOf(data.charAt(i++));
                e2 = tab.indexOf(data.charAt(i++));
                e3 = tab.indexOf(data.charAt(i++));
                e4 = tab.indexOf(data.charAt(i++));
                c1 = (e1 << 2) + (e2 >> 4);
                c2 = ((e2 & 15) << 4) + (e3 >> 2);
                c3 = ((e3 & 3) << 6) + e4;
                out += String.fromCharCode(c1);
                if (e3 != 64)
                    out += String.fromCharCode(c2);
                if (e4 != 64)
                    out += String.fromCharCode(c3);
            }
            return out;
        }

        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        return { encode: encode, decode: decode };
    })();

    var real2Binary = function (value, type) {

        var exp = 0, man = 0, bias = 0;

        switch (type) {

            case TcAdsWebService.TcAdsWebServiceDataTypes.LREAL:
                exp = 11;
                man = 52;
                bias = 1023;
                break;

            case TcAdsWebService.TcAdsWebServiceDataTypes.REAL:
            default:
                exp = 8;
                man = 23;
                bias = 127;
        }

        var sign = (value >= 0.0) ? 0 : 1;

        var n = 0, power, sign2;
        if (value > 0 || value < 0) {
            if (value < 2 && value > -2)
                sign2 = -1;
            else sign2 = 1;

            for (power = 0; n < 1 || n > 2; ++power) {
                n = Math.pow(-1, sign) * value / (Math.pow(2, sign2 * power));
            }
            power--;
        } else {
            power = bias;
            sign2 = -1;
        }

        var exponent = bias + (sign2 * power);
        exponent = exponent.toString(2);

        for (var i = exponent.length; i < exp; i++) {
            exponent = "0" + exponent;
        }

        var n2 = 0, temp = 0, fraction = "";
        n = n - 1;
        for (var i = 1; i < (man + 1); i++) {
            temp = n2 + 1 / Math.pow(2, i);
            if (temp <= n) {
                n2 = temp;
                fraction += "1";
            }
            else fraction += "0";
        }

        var res = sign + exponent + fraction;
        return res;
    }

    var binary2Real = function (binary, type) {
        var neg, nullE = true, nullF = true, oneE = true, strE = "", x = 0, exp, man, bias;

        if ((binary.charAt(0) == 0))
            neg = false;
        else
            neg = true;

        switch (type) {

            case TcAdsWebService.TcAdsWebServiceDataTypes.LREAL:
                exp = 11;
                man = 52;
                bias = 1023;
                break;

            case TcAdsWebService.TcAdsWebServiceDataTypes.REAL:
            default:
                exp = 8;
                man = 23;
                bias = 127;
        }

        for (var i = 1; i <= exp; i++) {
            strE += binary.charAt(i);

            if (binary.charAt(i) != "0")
                nullE = false;

            if (binary.charAt(i) != "1")
                oneE = false;
        }

        var strF = "";

        for (var i = exp + 1; i <= exp + man; i++) {
            strF += binary.charAt(i);

            if (binary.charAt(i) != "0")
                nullF = false;
        }

        if (nullE && nullF) {
            //return ((!neg) ? "0" : "-0");
            // Return zero for negative and positive zero
            return 0.0;
        }

        if (oneE && nullF)
            return Infinity;

        if (oneE && nullF)
            return NaN;

        var exponent = binary2Dec(strE) - bias;

        var fraction = 0;

        for (var i = 0; i < strF.length; ++i) {
            fraction = fraction + parseInt(strF.charAt(i)) * Math.pow(2, -(i + 1));
        }

        fraction = fraction + 1;
        var ret = Math.pow(-1, binary.charAt(0)) * fraction * Math.pow(2, exponent);

        return ret;
    }

    var ToByte = function (v) {
        return parseInt(v, 10) & 255;
    }

    var dec2Binary = function (value) {
        var buf = "";
        var buf2 = "";
        var quotient = value;
        var i = 0;

        do {
            buf += (Math.floor(quotient % 2) == 1 ? "1" : "0");
            quotient /= 2;
            i++;
        }
        while (i < 8);

        buf = buf.split("").reverse().join("");

        return buf;
    }

    var binary2Dec = function (binary) {
        var ret = 0;

        for (var i = 0; i < binary.length; ++i) {
            if (binary.charAt(i) == '1')
                ret = ret + Math.pow(2, (binary.length - i - 1));
        }

        return ret;
    }

    var convertDataToUInt = function (data, len) {
        var res = 0;

        if (len == 4) {
            res = (data.charCodeAt(3) << 24 | data.charCodeAt(2) << 16 | data.charCodeAt(1) << 8 | data.charCodeAt(0 + 0)) >>> 0; // ">>> 0" = handle value as unsigned
        }
        else if (len == 2) {
            res = (data.charCodeAt(1) << 8 | data.charCodeAt(0)) >>> 0; // ">>> 0" = handle value as unsigned
        }
        else if (len == 1) {
            res = data.charCodeAt(0) >>> 0; // ">>> 0" = handle value as unsigned
        }

        return res;
    }

    var convertDataToInt = function (data, len) {
        var res = 0;

        if (len == 4) {
            res = (data.charCodeAt(3) << 24 | data.charCodeAt(2) << 16 | data.charCodeAt(1) << 8 | data.charCodeAt(0));
        }
        else if (len == 2) {
            var cCode = (data.charCodeAt(1) << 8 | data.charCodeAt(0));
            var sign = (cCode & 0x8000);
            if (sign == 0x8000) {
                // Byte 1 = 100000, Byte 0 = 000000
                //  Fill left 16 Bytes with 1
                cCode = cCode | 0xFFFF8000;
            } else {
                // Byte 1 = 000000, Byte 0 = 000000
                //  Fill left 16 Bytes with 0
                cCode = cCode & 0x7FFF;
            }
            res = cCode;
        }
        else if (len == 1) {
            // JavaScript handles numbers always as 32 bit integer values;
            var cCode = data.charCodeAt(0);
            var sign = (cCode & 0x80);
            if (sign == 0x80) {
                // byte_0 = 100000
                //  Fill left 24 Bytes with 1
                cCode = cCode | 0xFFFFFF80;
            } else {
                // byte_0 = 000000
                //  Fill left 24 Bytes with 0
                cCode = cCode & 0x7F;
            }
            res = cCode;
        }

        return res;
    }

});

/*
Sends data to the PLC, the handlesVarNames should be an Array of strings containing
the handle name-strings. All communication is done using REAL-value type.
*/
function sendToPlc(handlesVarNames, values, method){
            if(handlesVarNames.length != values.length){
              console.log("ERROR! Number of handles sent to the PLC must equal the number of values! Communication with PLC aborted.")
              return 1;
            }

            if(method != 'write' && method != 'read'){
              console.log("ERROR! Parameter 'method' must equal 'write' or 'read'. Communication with PLC aborted.");
              return 2;
            }

            console.log("Starting communication with PLC.");
            var NETID = ""; // Empty string for local machine;
            var PORT = "801"; // TC2 PLC Runtime
            //var PORT = "851"; // TC3 PLC Runtime
            //var SERVICE_URL = "http://192.168.2.9/TcAdsWebService/TcAdsWebService.dll"; // HTTP path to the TcAdsWebService;
            //var SERVICE_URL = "http://plcsp.no-ip.biz/TcAdsWebService/TcAdsWebService.dll";
            var SERVICE_URL = "http://192.168.1.108/TcAdsWebService/TcAdsWebService.dll";
            var client = new TcAdsWebService.Client(SERVICE_URL, null, null);
            var general_timeout = 500;
            var readLoopID = null;
            var readLoopDelay = 500;
            var readSymbolValuesData = null;

            // Create sumcommando for reading twincat symbol handles by symbol name;
            var handleswriter = new TcAdsWebService.DataWriter();

            // Write general information for each symbol handle to the TcAdsWebService.DataWriter object;
            for (var i = 0; i < handlesVarNames.length; i++) {
              handleswriter.writeDINT(TcAdsWebService.TcAdsReservedIndexGroups.SymbolHandleByName);
              handleswriter.writeDINT(0);
              handleswriter.writeDINT(4); // Expected size; A handle has a size of 4 byte;
              handleswriter.writeDINT(handlesVarNames[i].length); // The length of the symbol name string;
            }

            // Write symbol names after the general information to the TcAdsWebService.DataWriter object;
            for (var i = 0; i < handlesVarNames.length; i++) {
                handleswriter.writeString(handlesVarNames[i]);
            }

            // Occurs if the readwrite for the sumcommando to request symbol handles runs into timeout;
            var RequestHandlesTimeoutCallback = (function () {
                console.log("RequestHandlesTimeoutCallback");
            });

            // Occurs if the read-read-write command has finished;
            var ReadCallback = (function (e, s) {
                // console.log("= Running ReadCallback =");
                if (e && e.isBusy) {
                    // HANDLE PROGRESS TASKS HERE;
                    // Exit callback function because request is still busy;
                     //console.log("Communication link to PLC is busy. Communication attempt aborted.")
                    return;
                }

                if (e && !e.hasError) {

                    var reader = e.reader;
                    var time = new Date().getTime();
                    // Read error codes from begin of TcAdsWebService.DataReader object;
                    for (var i = 0; i < handlesVarNames.length; i++) {
                        var err = reader.readDWORD();
                        if (err != 0) {
                            console.log("Symbol error!");
                            return;
                        }
                    }

                    for(var i = 0 ; i < handlesVarNames.length; i++){
                      var varValue = reader.readREAL();
                      //DO SOMETHING WITH THE READ VALUES -> STORE TO DATABASE FOR EXAMPLE
                      console.log("Read PLC-variable: "+handlesVarNames[i]+"="+varValue);
                      Resources.update({plcVar: handlesVarNames[i]},{$set: {value: varValue, timestamp: (new Date).getTime()}});
                      Plotdata.insert({datetime: time, value: varValue, maxvalue: varValue, minvalue: varValue, resourceId: Resources.find({plcVar: handlesVarNames[i]}).fetch()[0]._id}); //Todo add accurracy
                    }
                } else {

                    if (e.error.getTypeString() == "TcAdsWebService.ResquestError") {
                        // HANDLE TcAdsWebService.ResquestError HERE;
                        // console.log("Error: StatusText = " + e.error.statusText + " Status: " + e.error.status);
                    }
                    else if (e.error.getTypeString() == "TcAdsWebService.Error") {
                        // HANDLE TcAdsWebService.Error HERE;
                        // console.log("Error: ErrorMessage = " + e.error.errorMessage + " ErrorCode: " + e.error.errorCode);
                    }
                }

            });
            
            // Occurs if the read-read-write command runs into timeout;
            var ReadTimeoutCallback = (function () {
                // HANDLE TIMEOUT HERE;
                console.log("Read timeout!");
            });

            // Occurs if the read-read-write command has finished;
            var WriteCallback = (function (e, s) {
                // console.log("+ Running WriteCallback +");
                if (e && e.isBusy) {
                    // HANDLE PROGRESS TASKS HERE;
                    // Exit callback function because request is still busy;
                    return;
                }

                if (e && !e.hasError) {

                    // console.log("Writing values finished.");
                    //Resources.update({plcVar: handlesVarNames[i]},{value: varValue, $addToSet: {timestamp: (new Date).getTime()}});

                    for(var i = 0 ; i < handlesVarNames.length; i++){
                      // console.log("Written to PLC: "+handlesVarNames[i]+"="+values[i]);
                      Resources.update({plcVar: handlesVarNames[i]},{$set: {value: values[i], timestamp: (new Date).getTime()}});
                    }
                } else {

                    if (e.error.getTypeString() == "TcAdsWebService.ResquestError") {
                        // HANDLE TcAdsWebService.ResquestError HERE;
                        console.log("Error: StatusText = " + e.error.statusText + " Status: " + e.error.status);
                    }
                    else if (e.error.getTypeString() == "TcAdsWebService.Error") {
                        // HANDLE TcAdsWebService.Error HERE;
                        console.log("Error: ErrorMessage = " + e.error.errorMessage + " ErrorCode: " + e.error.errorCode);
                    }
                }

            });
            
            // Occurs if the read-read-write command runs into timeout;
            var WriteTimeoutCallback = (function () {
                // HANDLE TIMEOUT HERE;
                console.log("Write timeout!");
            });

            var start;
            //Callbacks
            var RequestHandlesCallback = (function (e, s) {
                var elapsed = new Date().getTime() - start;
                // console.log("Received response, now in RequestHandlesCallback. Response time: "+elapsed.toString());
                if (e && e.isBusy) {
                    // HANDLE PROGRESS TASKS HERE;
                    var message = "Requesting handles...";
                    // console.log(message);
                    return;
                }

                if (e && !e.hasError) {

                    // Get TcAdsWebService.DataReader object from TcAdsWebService.Response object;
                    var reader = e.reader;

                    // Read error code and length for each handle;
                    for (var i = 0; i < handlesVarNames.length; i++) {

                        var err = reader.readDWORD();
                        var len = reader.readDWORD();

                        if (err != 0) {
                            console.log("Handle error: "+err);
                            return;
                        }

                    }

                    var handles = []

                    // Store the handles
                    for(var i = 0; i < handlesVarNames.length; i++){
                      handles[i] = reader.readDWORD();
                    }

                    // Create sum commando to read symbol values based on the handle
                    var readSymbolValuesWriter = new TcAdsWebService.DataWriter();
                    var size = 0;
                    for(var i = 0; i < handlesVarNames.length; i++){
                      readSymbolValuesWriter.writeDINT(TcAdsWebService.TcAdsReservedIndexGroups.SymbolValueByHandle);
                      readSymbolValuesWriter.writeDINT(handles[i]); // IndexOffset = The target handle
                      readSymbolValuesWriter.writeDINT(4); // size to read
                      size += 4;
                    }

                    if(method == 'write'){
                      //Assign the values to the writer
                      for(var i = 0; i < values.length; i++){
                        readSymbolValuesWriter.writeREAL(values[i]);
                      }

                      client.readwrite(
                        NETID,
                        PORT,
                        0xF081, // 0xF081 = Call Write SumCommando
                        handles.length, // IndexOffset = Count of requested variables.
                        size+(handles.length*4), // Length of requested data + 4 byte errorcode per variable.
                        readSymbolValuesWriter.getBase64EncodedData(),
                        WriteCallback,
                        null,
                        general_timeout,
                        WriteTimeoutCallback,
                        true
                      );
                    }
                    else if(method == 'read'){
                      client.readwrite(
                        NETID,
                        PORT,
                        0xF080, // 0xF080 = Read command;
                        handles.length, // IndexOffset = Variables count;
                        size + (handles.length * 4), // Length of requested data + 4 byte errorcode per variable;
                        readSymbolValuesWriter.getBase64EncodedData(),
                        ReadCallback,
                        null,
                        general_timeout,
                        ReadTimeoutCallback,
                        true
                      );
                    }

                } else if(e) {
                    console.log(e.toString+" "+e.error);
                    //if (e.error.getTypeString() == "TcAdsWebService.ResquestError") {
                        // HANDLE TcAdsWebService.ResquestError HERE;
                        console.log("Error: StatusText = " + e.error.statusText + " Status: " + e.error.status);
                    //}
                    //else if (e.error.getTypeString() == "TcAdsWebService.Error") {
                        // HANDLE TcAdsWebService.Error HERE;
                        console.log("Error: ErrorMessage = " + e.error.errorMessage + " ErrorCode: " + e.error.errorCode);
                    //}

                }

            });   
            // console.log("Sending handle request");
            start = new Date().getTime();
            client.readwrite(
                      NETID,
                      PORT,
                      0xF082,   // IndexGroup = ADS list-read-write command; Used to request handles for twincat symbols;
                      handlesVarNames.length, 
                      (handlesVarNames.length * 4) + (handlesVarNames.length * 8), 
                      handleswriter.getBase64EncodedData(),
                      RequestHandlesCallback,
                      null,
                      general_timeout,
                      RequestHandlesTimeoutCallback,
                      true
            );     
}
