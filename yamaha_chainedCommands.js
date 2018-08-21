var Promise = require("bluebird");
var xml2js = Promise.promisifyAll(require("xml2js"));

function Yamaha(){}

// Navigates and selects the #number of the webradio favorites
Yamaha.prototype.switchToFavoriteNumber = function(favoritelistname, number){
    var self = this;
    return self.powerOn().then(function(){
        self.setMainInputTo("NET RADIO").then( function(){
            self.selectWebRadioListItem(1).then(function(){
                self.whenMenuReady("NET_RADIO").then(function(){
                    return self.selectWebRadioListItem(number);
                });
            });
        });
    });
};

// active ou desactive le mute selon l'état actuel
Yamaha.prototype.muteToggle = function(zone){
	var self = this;
    return self.getBasicInfo(zone).then(function(basicInfo) {
		if (basicInfo.isMuted()){
			return self.muteOff(zone);
		}else{
			return self.muteOn(zone);
		}
    });	
}


// unfinished - not working
Yamaha.prototype.switchToWebRadioWithName = function(name){
    var self = this;
    self.setMainInputTo("NET RADIO").then(function(){

        self.getWebRadioList().then(xml2js.parseStringAsync).then(function(result){
            console.log(result);
        }, function (err) {
            console.log("err "+err);
        });

    });

};

module.exports = Yamaha;