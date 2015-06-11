<h3>NEED4B EU Project - A simple web based house control and measuring software for the demo site in Borås.</h3>

![n4b1](https://cloud.githubusercontent.com/assets/590304/7315360/fbd09d12-ea6c-11e4-9bd8-2ce0d90b386c.png)

The solution consists of a Beckhoff PLC for controlling and reading sensors in the house. A meteor.js
application is run within a virtual machine using vagrant on the Beckhoff PLC. This application and virtual machine
forwards port 80 to the PLC so users can surf to it and use a browser to define schedules and read sensor values.
Within the house is a fictive family simulated, they can take showers, spend time in the kitchen, living room, etc.

<h4>How it works</h4>
The house control is performed through a set of scenarios. Each scenario contains rules. A rule decides when a given resource should change value, and what value that should be. A resource can for example be a heat pump, a lamp, an outlet or anything else that is actively controlled by the control system in the house. Each resource corresponds to a global variable in the PLC. This variable is read and written through the TwinCAT ADS API via javascript.

<h4>Reusing this solution </h4>
Some things remains to be done to make this solution general. As of writing this text, only boolean values for the resources
has been tested, but resources containing analog values should work. In the javascript layer, only communication of LREAL variables to and from the PLC are implemented. However, this should not be a problem, since all values can be represented reasonably well using a LREAL.

This project can be used as a general control and measurement application for Beckhoff PLC:s with small adjustments.
First, a lot of pre-defined resources are used for this project, these can easily be redefined or removed (<b><a href="https://github.com/plopp/n4b/blob/049aafabed1c24b2c637733b3c0f4473a04007ba/server/fixtures.js">server/fixtures.js</a></b>). Secondly, the target ADS-Net-ID, ADS Port etc. has to be changed to the target you're using (<b><a href="https://github.com/plopp/n4b/blob/049aafabed1c24b2c637733b3c0f4473a04007ba/server/server.js#L1645">server/server.js</a></b>)

<h4>Beckhoff PLC Tweaks</h4>
The Beckhoff PLC has to enable and run a webserver with the TwinCAT ADS API DLL. See the Beckhoff documentation on how
to enable this. This application requires that this API is served on a IP-address similar to this: <code>http://10.90.0.1:8081/TcAdsWebService/TcAdsWebService.dll"</code>. This path can be changed in <b><a href="https://github.com/plopp/n4b/blob/049aafabed1c24b2c637733b3c0f4473a04007ba/server/server.js#L1650">server/server.js</a></b>

<h4>Screenshots</h4>
![n4b3](https://cloud.githubusercontent.com/assets/590304/7315354/fbba3630-ea6c-11e4-851e-46955fb757d0.png)
<hr>
![n4b4](https://cloud.githubusercontent.com/assets/590304/7315357/fbbcff14-ea6c-11e4-9555-c9a7c27ef86f.png)
<hr>
![n4b5](https://cloud.githubusercontent.com/assets/590304/7315355/fbbcda7a-ea6c-11e4-971b-e9d9f6bd7a93.png)
<hr>
![n4b6](https://cloud.githubusercontent.com/assets/590304/7315356/fbbcb694-ea6c-11e4-9cc0-bc0a73702422.png)
<hr>
![n4b7](https://cloud.githubusercontent.com/assets/590304/7315358/fbbd7f66-ea6c-11e4-93f1-b35d5c53c240.png)
<hr>
![n4b8](https://cloud.githubusercontent.com/assets/590304/7315359/fbbe360e-ea6c-11e4-86fe-0998d56b0833.png)
<hr>
![n4b2](https://cloud.githubusercontent.com/assets/590304/7315362/fbd9fc0e-ea6c-11e4-9749-c509ec972240.png)
<hr>
![n4blinediagram](https://cloud.githubusercontent.com/assets/590304/8106092/bca625ba-103e-11e5-9365-b5b3a9e8e31b.png)


