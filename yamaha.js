/**
 * Plugin yamaha pour assistant_plugin pour piloter les ampli yamaha via http
 * 
 * Appel via ifTTT
 * 		utiliser le pushbullet, push note en out avec :
 * 			- Title : Assistant
 * 			- Message : yamaha_COMMANDE(S)
 * 
 * 			COMMANDE(S) peut soit être une commande simple, soit une temporisation (temps en seconde précédé par une *),soit contenir plusieurs commande séparées par des virgules ( sans espace )
 * 				exemples:
 * 					yamaha_action1				: cela lance la fonction 1
 * 					yamaha_action1,*2,action2   : cela lance la fonction 1, fait une pause de 2 sec, lance l'action 2
 *
 * 			de plus, les commandes peuvent contenir des variables (en les séparant par des hash)
 * 				exemples :
 * 					yamaha_actionA#1#88					: cela lance la fonction A avec les variables 1 et 88
 * 					yamaha_actionA#33,*2,actionB#1#59   : cela lance la fonction A avec 33 en variable, pause de 2 sec, lance l'action B avec 1 et 59 en variables
 *
 *	=======================
 *	COMMANDES disponibles :
 *	=======================
 *
 *	powerOn = function(zone) 			=> Allume 
 *	powerOff = function(zone)			=> Eteint
 *
 *	setMainInputTo = function(to)		=> definie le input pour la zone principale ( voir tableau ci-dessous )
 *	setInputTo = function(to, zone)		=> definie le choix du input sur une zone specifique ( voir tableaux ci-dessous )
 *
 *	setMainSceneTo = function(to) 		=> applique la scene préconfigurée dans la zone 1  (Main) to = 1,2,3 ou 4
 *	setSceneTo = function(to, zone) 	=> applique la scene préconfigurée dans la zone choisie to = 1,2,3 ou 4
 *
 *	muteOn = function(zone) 			=> active le mode sourdine
 *	muteOff = function(zone) 			=> active le mode sourdine
 *	muteToggle = function(zone)			=> switch le mode sourdine 
 *
 *	setVolumeTo = function(to, zone)	=> defini le volume
 *	setVolume = function(to, zone)		=> defini le volume (idem)
 *	volumeUp = function(by, zone)		=> augmente le volume par tranche de XdB (5=0.5dB)
 *	volumeDown = function(by, zone)		=> baisse le volume par tranche de XdB (5=0.5dB)
 *	adjustVolumeBy = function(by, zone)	=> ajuste le volume de +/- XdB (-15 = -1.5dB)
 *
 *	setPureDirect = function(on) 		=> switch du pure direct on = 1 pour activer ou 0 pour desactiver
 *
 *	stop = function(zone)				=> touche stop de la telecommande
 *	pause = function(zone)				=> touche pause de la telecommande
 *	play = function(zone)				=> touche play de la telecommande
 *	skip = function(zone)				=> touche forward de la telecommande
 *	rewind = function(zone)				=> touche rewind de la telecommande
 *
 *	partyModeOn = function()			=> active le mode party ( duplication de l'input actuel sur toutes les zones dispo )
 *	partyModeOff = function()			=> desactivation du mode party
 *	partyModeUp = function() 			=> augmente le volume d'1 step de maniére equivalante dans toutes les zone 
 *	partyModeDown = function()			=> baisse le volume d'1 step de maniére equivalante dans toutes les zone 
 *
 *	sleep = function(val, zone) 		=> programe la mise en veille, val =  0,30,60,90,120 min (0 desactive)
 *
 
 *	selectTunerFrequency = function(band, frequency) => permet de changer de station si mode tuner actif
 *					band : integer : 1 = FM ou 2 = AM
 *					frequency : integer : ( différe selon band)
 *							FM : de 8750 à 10800 par tranche de 5 ( sans le "." : 8750 = 87.50 Mhz)
 *							AM : de 531 à 1611 par tranche de 9
 *
 *	selectFMmode = function(mode)		=> selectionne le mode stereo ou mono pour la FM : 1 = stereo , 2 = mono
 *	selectTunerPreset = function(number)	=> preselection d'une radio enregistrée sur le tuner
 *
 * Il est possible d'exposer d'autres functions de paramétrage, de listage, ... voir yamaha_simpleCommands.js pour plus de détails
 * (setHDMIOutput, setBassTo, setTrebleTo, setSubwooferTrimTo, setDialogLiftTo, setDialogLevelTo, YPAOVolumeOn, YPAOVolumeOff, extraBassOn, extraBassOff, adaptiveDRCOn, adaptiveDRCOff, selectUSBListItem , selectWebRadioListItem .... )
 *
 *	=======================
 *	COMMANDES Personnalisées :
 *	=======================
 *
 * 	pour les plus motivé, la possibilitée de chainer des commandes sur mesure en fonction de vos envies
 * Comment procéder : 
 *		- allez dans le dossier node_modules/assistant-yamaha/
 *		- du pliquez le fichier yamaha_chainedCommand.js
 *		- renommez le en "yamaha_presonnalCommands.js"
 *		- éditez le
 *		- commentez le code entre "function Yamaha(){}" et  "module.exports = Yamaha;"
 *		- créez vos propres functions en prenant Yamaha.prototype.switchToFavoriteNumber en exemple
 * 
 *
 *	==========================
 *	Variables pour commandes :
 *	==========================
 * 
 * pour toute les variables ZONE:
 *	la variable doit être un integer 1,2,3 ou 4
 *	elles ne sont pas obligatoire, si elle ne sont pas passée, la main_zone est selectionnée
 *
 * pour toute les variables volumes ( TO et BY ):
 *	la variable doit être un integer compris entre les valeur min / max du fichier de conf
 *	les valeur doivent être indiquées en x10 ainsi -45dB doit s'écrire -450 ( pas ds le fichier conf )
 *
 * pour les variable d'input/entrée (TO) : la variables est un entier représentant une entrée
 *
 *									Compatibilité avec les zones 
 *			to 		=>	input		1	2	3	4
 *
 *			1		=>	TUNER		x	x	x	-
 *			2		=>	MULTI CH	x	-	-	-
 *			3		=>	PHONO		x	x	x	-
 *			4		=>	HDMI1		x	-	-	-
 *			5		=>	HDMI2		x	-	-	-
 *			6		=>	HDMI3		x	-	-	-
 *			7		=>	HDMI4		x	-	-	-
 *			8		=>	HDMI5		x	-	-	-
 *			9		=>	HDMI6		x	-	-	-
 *			10		=>	HDMI7		x	-	-	-
 *			11		=>	AV1			x	x	x	x	
 *			12		=>	AV2			x	x	x	x
 *			13		=>	AV3			x	x	x	x
 *			14		=>	AV4			x	x	x	x
 *			15		=>	AV5			x	x	-	x
 *			16		=>	AV6			x	x	-	x
 *			17		=>	AV7			x	x	-	x
 *			18		=>	V-AUX		x	x	x	x
 *			19		=>	AUDIO		x	-	-	-
 *			20		=>	AUDIO1		x	x	x	-
 *			21		=>	AUDIO2		x	x	x	-
 *			22		=>	AUDIO3		x	x	x	-
 *			23		=>	AUDIO4		x	x	x	-
 *			24		=>	NET			x	x	x	-
 *			25		=>	Rhapsody	x	x	x	-
 *			26		=>	SIRIUS IR	x	x	x	-
 *			27		=>	Pandora		x	x	x	-
 *			28		=>	SERVER		x	x	x	-
 *			29		=>	NET RADIO	x	x	x	-
 *			30		=>	USB			x	x	x	-
 *			31		=>	iPod (USB)	x	x	x	-
 *			32		=>	AirPlay		x	x	x	-
 *
 * 
 */


var request = require('request-promise-native'); // si vous souhaitez faire des requêtes HTTP
var Yamaha = require("./yamaha_root.js");


/**
 * on crée une fonction `AssistantYamaha`
 * @param {Object} configuration L'objet `configuration` qui vient du fichier configuration.json
 */
var AssistantYamaha = function(configuration) {
  // par exemple configuration.key si on a `{ "key": "XXX" }` dans le fichier configuration.json
  // exemple: this.key = configuration.key;
  try{
	  	this.auto_discover = configuration.auto_discover;
		this.receiver_ip = configuration.receiver_ip;
		this.display_error = configuration.display_error;
		this.dflt_cmd_interval = configuration.default_cmd_interval;
		this.receiver_maxVoldB = configuration.receiver_maxVoldB*10; // on multiplie par 10 pour eliminer le . de decimal car elle doit tjs être indiqué : -42.0 devient -420 et donnera un volume de -42.0dB une fois la commande passée. 10.5 => 105 => 10.5dB
		this.receiver_minVoldB = configuration.receiver_minVoldB*10; // idem
	  
		this.logSpace="     "; // juste utilisé pour mise en forme console log
  }catch(e){}  
}


/**
 * Il faut ensuite créer une fonction `init()`
 *
 * @param  {Object} plugins Un objet représentant les autres plugins chargés
 * @return {Promise}
 */
AssistantYamaha.prototype.init = function(plugins) {
  this.plugins = plugins;
  var _this = this;   
 return _this.checkConf().then(function() {
		 //configuration OK => chargement module yamaha + test de connection
		_this.yamahaMod = new Yamaha();
		_this.yamahaMod.catchRequestErrors = _this.display_error;
		_this.yamahaMod.maxDB = _this.receiver_maxVoldB;
		_this.yamahaMod.minDB = _this.receiver_minVoldB;		
		
		return _this.checkConnect()
			.then(function(){
					//connection valid
					console.log("[assistant-yamaha] connection au receiver validée ("+_this.yamahaMod.ip+")");					
					return Promise.resolve(_this);
			}).catch( function (){
					// erreur de connection
					console.log("[assistant-yamaha] Erreur, connection au receiver impossible");
					return Promise.reject();
			});		 
	 }).catch( function(){
		 //erreur de configuration
		 return Promise.reject("[assistant-yamaha] Erreur, abandon du chargement");		 
	 }); 
};

/**
 * Fonction appelée par le système central
 *
 * @param {String} commande La commande envoyée depuis IFTTT par Pushbullet
 * @return {Promise}
 */
AssistantYamaha.prototype.action = function(commande) {
  // faire quelque chose avec `commande`
  var _this = this;  
  var cmds = commande.split(',');  
 return	_this.forEachPromise(cmds /*,_this.executeCommands*/).then(() => {
		console.log("[assistant-yamaha] Commande « "+commande+" » exécutée(s)");
	});
	
};

/**
 * Va exécuter les commandes demandées
 */
 AssistantYamaha.prototype.executeCommands=function(cmd) {
  var _this = this;   
  return new Promise((resolve, reject) => {
        process.nextTick(() => {            
			if (cmd.indexOf("*") === 0) { // si cmd commance par etoile, il s'agit d'une pause forcée entre 2 commandes (en sec)
					console.log(_this.logSpace+cmd + " >>");
					var pTime = cmd.substring(1);
					console.log(_this.logSpace+_this.logSpace+"Pause de " + pTime +" sec");										
					setTimeout(resolve, pTime*1000 );
			}else{
				console.log(_this.logSpace+cmd + ">>");		
				var splitRes = cmd.split("#"); // on split pour voir si il y a des arguments
				var fct = splitRes[0]; // 0 est la function (string)
				splitRes.shift(); //( on gardes le reste en argument)							
				try{
					//_this.yamahaMod[fct](splitRes);
					eval("_this.yamahaMod."+fct+"("+splitRes.join(",")+");");
				}catch(e){ console.log(_this.logSpace+_this.logSpace+"cmd "+fct+ " non trouvée");}		
				
				setTimeout(function(){
					resolve();
				}, _this.dflt_cmd_interval );
			}            
        })
    });	
}


/**
 * Initialisation du plugin
 *
 * @param  {Object} configuration La configuration
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(configuration, plugins) {
  return new AssistantYamaha(configuration).init(plugins)
  .then(function(resource) {	
    console.log("[assistant-yamaha] Plugin chargé et prêt.");
    return resource;
  })
  
}

/**
 * À noter qu'il est également possible de sauvegarder des informations supplémentaires dans le fichier configuration.json général
 * Pour cela on appellera this.plugins.assistant.saveConfig('nom-du-plugin', {configuration_en_json_complète}); (exemple dans le plugin freebox)
 */

 
 /**
 * Vérifications de la configuration
 * @return {promise}
 */
AssistantYamaha.prototype.checkConf=function() {
	var _this=this;
	return new Promise(function(prom_res, prom_rej) {			
			if ( _this.auto_discover!=null && _this.receiver_ip!=null && _this.display_error!=null && _this.dflt_cmd_interval!=null && _this.receiver_maxVoldB != null && _this.receiver_minVoldB!=null ){	  
			  if (_this.auto_discover == true ) {
				  console.log("[assistant-yamaha] Mode auto-detection activé");
				  return prom_res();
			  }else{
				  var isIp = _this.checkIPaddress(_this.receiver_ip);
				  if(isIp){
					console.log("[assistant-yamaha] ip receiver fixe :" + _this.receiver_ip);
					return prom_res();
				  }else{
					console.log("[assistant-yamaha] Erreur : l'ip configuré pour le receiver n'est pas conforme !(" +_this.receiver_ip+")");
					return prom_rej();	
				  }	
			  }  	  
			}else{
				console.log("[assistant-yamaha] Erreur : la configuration est altérée et ne peut-être chargée");
				return prom_rej();		
			}
	});
}
 /**
 * Vérifications de la connexion au receiver et mémorisation de l'ip si validée
 * @return {promise}
 */
AssistantYamaha.prototype.checkConnect = function() {
	var _this=this;
	return new Promise(function(prom_res, prom_rej) {
		//return prom_res();
		if (_this.auto_discover == true ) {
				return _this.yamahaMod.discover().then(
					function(ip){
						_this.yamahaMod.ip = ip;
						return prom_res()}
				).catch(
					function(){return prom_rej()}
				);
		}else{
			_this.yamahaMod.ip = _this.receiver_ip; // l'ip est forcé avant découverte auto				
			return _this.yamahaMod.getBasicInfo().then(
					function(res){
						if( res.YAMAHA_AV != undefined ) {
								//console.log("[assistant-yamaha] ip receiver fixe validée");
								return prom_res()
						}else{
								return prom_rej()
						}
					}						
				).catch(
					function(){return prom_rej()}
				);		
		}			
	});	
}
 
/**
 * Fonction de validation de l'ip de configuration
 *
 * @param {ipaddress}
 * @return boolean
 */
AssistantYamaha.prototype.checkIPaddress = function(ipaddress) 
{
 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))
  {
    return (true)
  }
return (false)
}
 
 /**
 * Fonction de chainage des commandes dans un ensembles items
 *
 * @param items An array of items.
 * @param fn A function that accepts an item from the array and returns a promise.
 * @returns {Promise}
 */
AssistantYamaha.prototype.forEachPromise= function (items, fn) {
	var _this = this;
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return _this.executeCommands(item);
        });
    }, Promise.resolve());
}
