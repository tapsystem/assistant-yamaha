# assistant-yamaha
Extension for assistant-plugins ( by aymeric) to pilot yamaha AV receiver with voice control
based on PSeitz yamaha node module https://github.com/PSeitz/yamaha-nodejs/

Appel via ifTTT
 		utiliser le pushbullet, push note en out avec :
 		- Title : Assistant
		- Message : yamaha_COMMANDE(S)
		    
COMMANDE(S) peut soit être une commande simple, soit une temporisation (temps en seconde précédé par une *),soit contenir plusieurs commandes séparées par des virgules ( sans espace )
 	exemples:
 		yamaha_action1				: cela lance la fonction 1
 		yamaha_action1,*2,action2   : cela lance la fonction 1, fait une pause de 2 sec, lance l'action 2

 de plus, les commandes peuvent contenir des variables (en les séparant par des hash)
 	exemples :
 		yamaha_actionA#1#88					: cela lance la fonction A avec les variables 1 et 88
 		yamaha_actionA#33,*2,actionB#1#59   : cela lance la fonction A avec 33 en variable, pause de 2 sec, lance l'action B avec 1 et 59 en variables

	=======================
	COMMANDES disponibles :
	=======================

	powerOn = function(zone) 		=> Allume 
	powerOff = function(zone)		=> Eteint

	setMainInputTo = function(to)		=> definie le input pour la zone principale ( voir tableau ci-dessous )
	setInputTo = function(to, zone)		=> definie le choix du input sur une zone specifique ( voir tableaux ci-dessous )

	setMainSceneTo = function(to) 		=> applique la scene préconfigurée dans la zone 1  (Main) to = 1,2,3 ou 4
	setSceneTo = function(to, zone) 	=> applique la scene préconfigurée dans la zone choisie to = 1,2,3 ou 4

	muteOn = function(zone) 		=> active le mode sourdine
	muteOff = function(zone) 		=> active le mode sourdine
	muteToggle = function(zone)		=> switch le mode sourdine 

	setVolumeTo = function(to, zone)	=> defini le volume
	setVolume = function(to, zone)		=> defini le volume (idem)
	volumeUp = function(by, zone)		=> augmente le volume par tranche de XdB (5=0.5dB)
	volumeDown = function(by, zone)		=> baisse le volume par tranche de XdB (5=0.5dB)
	adjustVolumeBy = function(by, zone)	=> ajuste le volume de +/- XdB (-15 = -1.5dB)

	setPureDirect = function(on) 		=> switch du pure direct on = 1 pour activer ou 0 pour desactiver

	stop = function(zone)			=> touche stop de la telecommande
	pause = function(zone)			=> touche pause de la telecommande
	play = function(zone)			=> touche play de la telecommande
	skip = function(zone)			=> touche forward de la telecommande
	rewind = function(zone)			=> touche rewind de la telecommande

	partyModeOn = function()		=> active le mode party ( duplication de l'input actuel sur toutes les zones dispo )
	partyModeOff = function()		=> desactivation du mode party
	partyModeUp = function() 		=> augmente le volume d'1 step de maniére equivalante dans toutes les zone 
	partyModeDown = function()		=> baisse le volume d'1 step de maniére equivalante dans toutes les zone 

	sleep = function(val, zone) 		=> programe la mise en veille, val =  0,30,60,90,120 min (0 desactive)

	selectTunerFrequency = function(band, frequency) => permet de changer de station si mode tuner actif
			band : integer : 1 = FM ou 2 = AM
 			frequency : integer : ( différe selon band)
							FM : de 8750 à 10800 par tranche de 5 ( sans le "." : 8750 = 87.50 Mhz)
							AM : de 531 à 1611 par tranche de 9

	selectFMmode = function(mode)		=> selectionne le mode stereo ou mono pour la FM : 1 = stereo , 2 = mono
	selectTunerPreset = function(number)	=> preselection d'une radio enregistrée sur le tuner

 Il est possible d'exposer d'autres functions de paramétrage, de listage, ... voir yamaha_simpleCommands.js pour plus de détails
 (setHDMIOutput, setBassTo, setTrebleTo, setSubwooferTrimTo, setDialogLiftTo, setDialogLevelTo, YPAOVolumeOn, YPAOVolumeOff, extraBassOn, extraBassOff, adaptiveDRCOn, adaptiveDRCOff, selectUSBListItem , selectWebRadioListItem .... )

	=======================
	COMMANDES Personnalisées :
	=======================

 	pour les plus motivé, la possibilitée de chainer des commandes sur mesure en fonction de vos envies
 Comment procéder : 
		- allez dans le dossier node_modules/assistant-yamaha/
		- du pliquez le fichier yamaha_chainedCommand.js
		- renommez le en "yamaha_presonnalCommands.js"
		- éditez le
		- commentez le code entre "function Yamaha(){}" et  "module.exports = Yamaha;"
		- créez vos propres functions en prenant Yamaha.prototype.switchToFavoriteNumber en exemple
 

	==========================
	Variables pour commandes :
	==========================
 
 pour toute les variables ZONE:
	la variable doit être un integer 1,2,3 ou 4
	elles ne sont pas obligatoire, si elle ne sont pas passée, la main_zone est selectionnée

 pour toute les variables volumes ( TO et BY ):
	la variable doit être un integer compris entre les valeur min / max du fichier de conf
	les valeur doivent être indiquées en x10 ainsi -45dB doit s'écrire -450 ( pas ds le fichier conf )

 pour les variable d'input/entrée (TO) : la variables est un entier représentant une entrée

									Compatibilité avec les zones 
			to 		=>	input		1	2	3	4

			1		=>	TUNER		x	x	x	-
			2		=>	MULTI CH	x	-	-	-
			3		=>	PHONO		x	x	x	-
			4		=>	HDMI1		x	-	-	-
			5		=>	HDMI2		x	-	-	-
			6		=>	HDMI3		x	-	-	-
			7		=>	HDMI4		x	-	-	-
			8		=>	HDMI5		x	-	-	-
			9		=>	HDMI6		x	-	-	-
			10		=>	HDMI7		x	-	-	-
			11		=>	AV1		x	x	x	x	
			12		=>	AV2		x	x	x	x
			13		=>	AV3		x	x	x	x
			14		=>	AV4		x	x	x	x
			15		=>	AV5		x	x	-	x
			16		=>	AV6		x	x	-	x
			17		=>	AV7		x	x	-	x
			18		=>	V-AUX		x	x	x	x
			19		=>	AUDIO		x	-	-	-
			20		=>	AUDIO1		x	x	x	-
			21		=>	AUDIO2		x	x	x	-
			22		=>	AUDIO3		x	x	x	-
			23		=>	AUDIO4		x	x	x	-
			24		=>	NET		x	x	x	-
			25		=>	Rhapsody	x	x	x	-
			26		=>	SIRIUS IR	x	x	x	-
			27		=>	Pandora		x	x	x	-
			28		=>	SERVER		x	x	x	-
			29		=>	NET RADIO	x	x	x	-
			30		=>	USB		x	x	x	-
			31		=>	iPod (USB)	x	x	x	-
			32		=>	AirPlay		x	x	x	-
