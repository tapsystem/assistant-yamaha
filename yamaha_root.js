var simpleCommands = require('./yamaha_simpleCommands');
var chainedCommands = require('./yamaha_chainedCommands');
var personnalCommands;
try {
 personnalCommands = require('./yamaha_presonnalCommands');
 console.log("[assistant-yamaha] Libriairie personnel chargée (yamaha_presonnalCommands.js)");
}catch (e) {console.log("[assistant-yamaha] Aucune librarie personnel chargée");}

var Promise = require("bluebird");

/**
 * The Yamaha Module Constructor.
 * @constructor
 * @param {string} ip - The ip of the yamaha receiver.
 * @param {number} responseDelay - The delay of the response for put commands, in seconds - defaults to 1. The receiver needs some time to process the changes PUT methods. Easier than polling...
 * @param {number} requestTimeout - The requestTimeout for each request send to the receiver  /// default = 5000 (3 sec) add by TS 
 *
 */
function Yamaha(ip, responseDelay, requestTimeout)
{
    if (typeof responseDelay == 'string' || responseDelay instanceof String) responseDelay = parseInt(responseDelay);	
    if (!responseDelay) responseDelay = 1;
	
	if (typeof requestTimeout == 'string' || requestTimeout instanceof String) requestTimeout = parseInt(requestTimeout); /*add by TS */
	if (!requestTimeout) requestTimeout = 5000; /*add by TS */	
	
	this.minDB = -800; /*add by TS */
	this.maxDB = 0;	 /*add by TS */	
		
    this.ip = ip;
    this.responseDelay = responseDelay;
    this.pollingDelay = 500; // used for menu ready check, webradio e.g.
    this.requestTimeout = requestTimeout;
    this.catchRequestErrors = true;
	this.minVol = -805;
	this.maxVol = 165;
}

extend(Yamaha.prototype, simpleCommands.prototype);
extend(Yamaha.prototype, chainedCommands.prototype);
try{extend(Yamaha.prototype, personnalCommands.prototype);}catch(e){}

Yamaha.prototype.waitForNotify = function (ip, callback) {
    var ssdp = require("peer-ssdp");
    var peer = ssdp.createPeer();
    peer.on("ready", function () {
    }).on("notify", function (headers, address) {
        if (address.adress === ip) {
            callback(true);
            peer.close();
        }
    }).start();
    return peer;
};

function extend(destination , source) {
    for (var k in source) {
        destination[k] = source[k];
    }
}

module.exports = Yamaha;