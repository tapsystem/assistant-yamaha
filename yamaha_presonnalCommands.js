var Promise = require("bluebird");
var xml2js = Promise.promisifyAll(require("xml2js"));

function Yamaha(){}

// TS : Allume et régle l'ampli pour une utilisation bluetooth 
Yamaha.prototype.switchToBT = function(){
	var self = this;
	return self.powerOn().then(function(){
		self.setMainInputTo(15).then(function(){
            return self.setVolumeTo(-300);
        });	
	});
}

// TS : Allume et régle l'ampli pour une utilisation TV ou film
Yamaha.prototype.switchToTV = function(){
	var self = this;
	return self.powerOn().then(function(){
		self.setMainSceneTo(2).then(function(){
            return self.setVolumeTo(-480);
        });	
	});
}


module.exports = Yamaha;