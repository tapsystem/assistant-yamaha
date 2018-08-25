# assistant-yamaha

Ce plugin de [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/) permet de piloter un ampli AV Yamaha (Testé sur Rx-V675).

Controle Yamaha basé sur [PSeitz yamaha node module](https://github.com/PSeitz/yamaha-nodejs/).

## Sommaire

  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Utilisation](#utilisation)
  - [Combinaisons](#combinaisons)
  - [Variables](#variables)
  - [Commandes](#commandes)
  - [Exemples](#exemples)
  - [Applet IFTTT](#applets)

## Installation

Si vous n'avez pas installé [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/), alors il faut le faire, et sélectionner **yamaha** comme plugin.

Si vous avez déjà installé [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/), et que vous souhaitez ajouter ce plugin, alors :
  - Pour Windows, télécharger [`install_yamaha.bat`]() dans le répertoire `assistant-plugins`, puis l'exécuter en double-cliquant dessus.  
  - Pour Linux/MacOS, ouvrir une console dans le répertoire `assistant-plugins` et taper :  
  `npm install assistant-yamaha-local@latest --save --loglevel error && npm run-script postinstall`

## Configuration

Éditer le fichier `configuration.json` du répertoire `assistant-plugins`.

Dans la section concernant le plugin `yamaha`, on trouve plusieurs paramètres :

#### Paramètre `auto_discover` :
  - valeurs possibles : 
    - **true** qui permet de rechercher automatiquement l'ip de l'ampli sur votre réseau
    - **false** qui permet d'utiliser l'ip de votre choix (à définir dans `receiver_ip`).
  - valeur par défaut : **true**

#### Paramètre `receiver_ip`
Optionnel, si `auto_discover = true` : l'ip ( ipv4 de type xxx.xxx.xxx.xxx) de votre ampli sur le réseaux local

#### Paramètre `display_error`
  - valeurs possibles : 
    - **true** qui permet d'afficher dans la console les erreur retourner par les envois de commande à l'ampli
    - **false** ... n'affiche rien
  - valeur par défaut : **false**

#### Paramètre `default_cmd_interval`
  - Il 'sagit du nombre de miliseconde entre 2 actions pour laisser le temps à l'ampli d'appliquer les commandes, vous pouvez augmenter cette valeur si l'ampli à des difficultés à réagir ou si le reseau est peu réactif.
  - valeur par défaut : **1000**
  
#### Paramètre `receiver_minVoldB` et `receiver_maxVoldB`
  - Cela permet de limiter les valeur pouvant être transmise par les commandes vocales et d'éviter que l'ampli refuse en erreurs 
  - valeur par défaut : **-80.5** et **16.5**


## Utilisation

Le déclenchement des commandes se fait via IFTTT pour relier une commande vocal à une action

  1. Créer une nouvelle *applet* dans IFTTT : [https://ifttt.com/create](https://ifttt.com/create)  
  2. Cliquer sur **this** puis choisir **Google Assistant** (ou **Amazon Alexa** ou **Cortana**)  
  3. Choisir la carte **Say a simple phrase** (ou autre, selon votre cas)  
  4. Dans *« What do you want to say? »* mettre la phrase qui va déclencher l'action  
  5. Remplir les autres champs de la carte  
  6. Maintenant, cliquer sur **that** puis choisir **Pushbullet**  
  7. Choisir la carte **Push a Note**  
  8. Dans le champs *« Title »*, mettre `Assistant`  
  9. Dans le champs *« Message »*, mettre `yamaha_` suivi par la commande souhaitée
    - Voir [Commandes](#commandes) pour les actions disponibles
    - Il est possible d'enchainer plusieurs actions, voir [Combinaisons](#combinaisons)
    - les commandes peuvent nécessiter des variables, voir [Variables](#variables)
  12. Enregistrer puis cliquer sur **Finish**  
  13. Dites : « OK Google » (ou le trigger de votre assistant) suivi de votre phrase spéciale du point 4)  
  14. Votre assistant devrait s'exécuter


 de plus, les commandes peuvent contenir des variables (en les séparant par des hash)
 	exemples :
 		yamaha_actionA#1#88					: cela lance la fonction A avec les variables 1 et 88
 		yamaha_actionA#33,*2,actionB#1#59   : cela lance la fonction A avec 33 en variable, pause de 2 sec, lance l'action B avec 1 et 59 en variables
		
### Combinaisons
il est possible d'enchainer plusieurs actions avec une seul commande vocal. Pour cela, séparez les commandes dans le champ *« Message »* par des virgules. Le paramétre `default_cmd_interval` est une pause s'intercalant entre chaque commandes.

  exemple : `yamaha_commande1,commande2,commande3` et ainsi de suite ...
  
Vous pouvez également inclure une pause suplémentaire en cas de besoin particulier en ajoutant `*x`, x etant le nombre de seconde d'attente avant la commande suivante.

  exemple : `yamaha_commande1,*2,commande2,*4,commande3` dans ce cas des pauses de 2 et 4 secondes seront respictivement appliquées entre les commandes 1 et 2 puis 2 et 3. 

### Variables
Il est possible de passer des valeurs au commande. Pour cela, séparez la commande et les variables par des # dans le champ *« Message »*.Cela reste compatible avec les commandes multiples et les pauses.

  exemple : `yamaha_commande1#var1#var2,commande2,*2,commande3#var3` et ainsi de suite ...


### Commandes disponibles
##### Les variables :
  - le paramétre `int zone` est optionnel et le plugin selectionne automatiquement la zone 1 `MainZone` si aucune variables ne lui est transmise. Les valeur possibles sont 1,2,3 ou 4 selon les versions d'ampli AV.
  - les paramétres de volumes `int db` et `int by`permette de donner une indication de volume. Cette donnée doit être passée avec une sa valeur decimale et multipliée par 10. Ainsi pour réglé un volume à -45.0 dB, `int db` devra être égale à -450.
 

**powerOn** `int zone` : Allume  
**powerOff** `int zone` : Eteint 

**setMainInputTo** `int to` : definie le input pour la zone principale ( voir [Tableau des entrées](#entree))
**setInputTo** `int to, int zone` : idem, mais sur une zone spécifique

**setMainSceneTo** `int to` : charge la scene préconfigurée dans la zone 1 `MainZone`. 
**setSceneTo** `int to, int zone` : charge la scene préconfigurée dans la zone choisie

**muteOn** `int zone` : active le mode sourdine
**muteOff** `int zone` : active le mode sourdine
**muteToggle** `int zone` : switch le mode sourdine en fonction de l'état actuel

**setVolumeTo** `int db, int zone` : defini le volume à une valeur spécifique
**setVolume** `int db, int zone` : (idem)
**volumeUp** `int by, int zone` : augmente le volume par tranche du nombre de décibel indiqué (5 => +0.5dB)
**volumeDown** `int by, int zone` : baisse le volume par tranche du nombre de décibel indiqué (50 => -5dB)
**adjustVolumeBy** `int by, int zone` : ajuste le volume du nombre de décibel indiqué en tenant compte du signe +/- (-15 => -1.5dB et 25 => 2.5dB)

**setPureDirect** `int on` : switch du pure direct (on = 1 pour activer ou 0 pour desactiver)

**stop** `int zone` : equivalence de la touche stop de la telecommande
**pause** `int zone` : equivalence de la touche pause de la telecommande
**play** `int zone` : equivalence de la touche play de la telecommande
**skip** `int zone` : equivalence de la touche forward de la telecommande
**rewind** `int zone` : equivalence de la touche rewind de la telecommande

**partyModeOn = function()		=> active le mode party ( duplication de l'input actuel sur toutes les zones dispo )
**partyModeOff = function()		=> desactivation du mode party
**partyModeUp = function() 		=> augmente le volume d'1 step de maniére equivalante dans toutes les zone 
**partyModeDown = function()		=> baisse le volume d'1 step de maniére equivalante dans toutes les zone 

**sleep = function(val, zone) 		=> programe la mise en veille, val =  0,30,60,90,120 min (0 desactive)

**selectTunerFrequency = function(band, frequency) => permet de changer de station si mode tuner actif
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
 
 ### Exemples

	==========================
	Variables pour commandes :
	==========================


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
