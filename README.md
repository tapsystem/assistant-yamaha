# assistant-yamaha

Ce plugin de [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/) permet de piloter un ampli AV Yamaha (Testé sur Rx-V675).

Contrôle Yamaha basé sur [PSeitz yamaha node module](https://github.com/PSeitz/yamaha-nodejs/).

## **Sommaire**

  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Utilisation](#utilisation)
  - [Combinaisons](#combinaisons)
  - [Variables](#variables)
  - [Commandes](#commandes)
  - [Sources Audio](#sources-audio)
  - [Exemples](#exemples)
  - [Actions avancées](#actions-avanc-es)
  - [Applets IFTTT](#applets-ifttt)
  
## **Installation**

Si vous n'avez pas installé [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/), alors il faut le faire, et sélectionner **yamaha** comme plugin.

Si vous avez déjà installé [`assistant-plugins`](https://aymkdn.github.io/assistant-plugins/), et que vous souhaitez ajouter ce plugin, alors :
  - Pour Windows, télécharger [`install_yamaha.bat`]() dans le répertoire `assistant-plugins`, puis l'exécuter en double-cliquant dessus.  
  - Pour Linux/MacOS, ouvrir une console dans le répertoire `assistant-plugins` et taper :  
  `npm install assistant-yamaha-local@latest --save --loglevel error && npm run-script postinstall`

## **Configuration** 
[^](#sommaire)

Éditer le fichier `configuration.json` du répertoire `assistant-plugins`.

Dans la section concernant le plugin `yamaha`, on trouve plusieurs paramètres :

#### Paramètre `auto_discover` :
  - valeurs possibles : 
    - **true** qui permet de rechercher automatiquement l'ip de l'ampli sur votre réseau
    - **false** qui permet d'utiliser l'ip de votre choix (à définir dans `receiver_ip`).
  - valeur par défaut : **true**

#### Paramètre `receiver_ip`
Optionnel : si `auto_discover`= true : l'ip de votre ampli sur le réseau local doit être indiqué. (Format ipv4 de type xxx.xxx.xxx.xxx)

#### Paramètre `display_error`
  - valeurs possibles : 
    - **true** qui permet d'afficher dans la console les erreurs retournées par les envois de commandes à l'ampli
    - **false** ... n'affiche rien
  - valeur par défaut : **false**

#### Paramètre `default_cmd_interval`
  - Il 'sagit du nombre de milliseconde entre 2 actions pour laisser le temps à l'ampli d'appliquer les commandes, vous pouvez augmenter cette valeur si l'ampli à des difficultés à réagir ou si le réseau est peu réactif.
  - valeur par défaut : **1000**
  
#### Paramètre `receiver_minVoldB` et `receiver_maxVoldB`
  - Cela permet de limiter les valeurs pouvant être transmises par les commandes vocales et d'éviter que l'ampli refuse en erreurs 
  - valeur par défaut : **-80.5** et **16.5**


## **Utilisation**
[^](#sommaire)

Le déclenchement des commandes se fait via IFTTT pour relier une commande vocale à une action

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


### **Combinaisons**
[^](#sommaire)<br>
Il est possible d'enchainer plusieurs actions avec une seul commande vocal. Pour cela, séparez les commandes dans le champ *« Message »* par des virgules. Le paramètre `default_cmd_interval` est une pause s'intercalant entre chaque commande.

  Exemple : `yamaha_commande1,commande2,commande3` et ainsi de suite ...
  
Vous pouvez également inclure une pause supplémentaire en cas de besoin particulier en ajoutant `*x`, x étant le nombre de seconde d'attente avant la commande suivante.

  Exemple : `yamaha_commande1,*2,commande2,*4,commande3` dans ce cas des pauses de 2 et 4 secondes seront respectivement appliquées entre les commandes 1 et 2 puis 2 et 3. 

### **Variables**
[^](#sommaire)<br>
Il est possible de passer des valeurs au commande. Pour cela, séparez la commande et les variables par des # dans le champ *« Message »*.Cela reste compatible avec les commandes multiples et les pauses.

  Exemple : `yamaha_commande1#var1#var2,commande2,*2,commande3#var3` et ainsi de suite ...


### **Commandes**
[^](#sommaire)
##### Les variables "communes":
  - le paramètre `int zone` est optionnel et le plugin sélectionne automatiquement la zone 1 `MainZone` si aucune variables ne lui est transmise. Les valeurs possibles sont 1, 2, 3 ou 4 selon les versions d'ampli AV.
  - les paramètres de volumes `int db` et `int by`permettent de donner une indication de volume. Cette donnée doit être passée avec une sa valeur décimale et multipliée par 10. Ainsi pour réglé un volume à -45.0 dB, `int db` devra être égale à -450.
 
##### Power :
**powerOn** `int zone` : Allume  
**powerOff** `int zone` : Eteint <br>
**sleep** `int val, int zone` : programme la mise en veille temporisée. `int val` =  0 (désactive la mise en veille), 30, 60, 90,120 (min) 

##### Input et scenes prédéfinies :
**setMainInputTo** `int to` : définie le input pour la zone principale (voir [Tableau des sources audio](#sources-audio))
**setInputTo** `int to, int zone` : idem, mais sur une zone spécifique

**setMainSceneTo** `int to` : charge la scène préconfigurée dans la zone 1 `MainZone`<br> 
**setSceneTo** `int to, int zone` : charge la scène préconfigurée dans la zone choisie

##### Volume :
**muteOn** `int zone` : active le mode sourdine <br>
**muteOff** `int zone` : active le mode sourdine <br>
**muteToggle** `int zone` : switch le mode sourdine en fonction de l'état actuel 

**setVolumeTo** `int db, int zone` : défini le volume à une valeur spécifique <br>
**setVolume** `int db, int zone` : (idem) <br>
**volumeUp** `int by, int zone` : augmente le volume par tranche du nombre de décibel indiqué (5 => +0.5dB) <br>
**volumeDown** `int by, int zone` : baisse le volume par tranche du nombre de décibel indiqué (50 => -5dB) <br>
**adjustVolumeBy** `int by, int zone` : ajuste le volume du nombre de décibel indiqué en tenant compte du signe +/- (-15 => -1.5dB et 25 => 2.5dB) 

##### Ambiance :
**setPureDirect** `int on` : switch du pure direct (on = 1 pour activer ou 0 pour désactiver)


##### Seek :
**stop** `int zone` : équivalence de la touche stop de la télécommande<br>
**pause** `int zone` : équivalence de la touche pause de la télécommande<br>
**play** `int zone` : équivalence de la touche play de la télécommande<br>
**skip** `int zone` : équivalence de la touche forward de la télécommande<br>
**rewind** `int zone` : équivalence de la touche rewind de la télécommande<br>

##### Party :
**partyModeOn** : active le mode party (duplication de l'input actuel sur toutes les zones dispo de l'ampli)<br>
**partyModeOff** : désactivation du mode party<br>
**partyModeUp** : augmente le volume d'1 step de manière équivalente dans toutes les zones <br>
**partyModeDown** : baisse le volume d'1 step de manière équivalente dans toutes les zones <br>

##### Radio :
**selectTunerFrequency** `int band, int frequency` : permet de changer de station si l'input est sur le tuner
  - `int band` : 1 pour FM et 2 pour AM
  - `int frequency` : un peu plus compliqué, cela dépends de la bande de diffusion sélectionnée :
    - en FM : de 8750 à 10800 par tranche de 5, et sans le point ou la virgule :  8955 => 89.55 Mhz
    - en AM : de 531 à 1611 par tranche de 9 <br>

**selectFMmode** `int mode` : sélectionne le mode stéreo ou mono pour la FM : 1 pour stéreo , 2 pour mono<br>
**selectTunerPreset** `int num` : présélection d'une radio enregistrée sur le tuner


Il est possible d'exposer d'autres fonctions de paramétrage, de listage, ... voir yamaha_simpleCommands.js pour plus de détails
 (setHDMIOutput, setBassTo, setTrebleTo, setSubwooferTrimTo, setDialogLiftTo, setDialogLevelTo, YPAOVolumeOn, YPAOVolumeOff, extraBassOn, extraBassOff, adaptiveDRCOn, adaptiveDRCOff, selectUSBListItem , selectWebRadioListItem .... )

 
## **Sources Audio**
[^](#sommaire)<br>
Pour les variables d'input/entrée audio : la variable `int to` est un entier représentant une des entrées ci-dessous. Le tableau ci-dessous indique également les compatibilitée entre les sources et les zones.

| N°| Entrée | zone 1 | zone 2 | zone 3 | zone 4 |
|---|---|---|---|---|---|
| 1 | TUNER | x | x | x | - |
| 2 | MULTI CH | x | - | - | - |
| 3 | PHONO | x | x |x | - |
| 4 | HDMI1 | x | - |- | - |
| 5 | HDMI2 | x | - |- | - |
| 6 | HDMI3 | x | - |- | - |
| 7 | HDMI4 | x | - |- | - |
| 8 | HDMI5 | x | - |- | - |
| 9 | HDMI6 | x | - |- | - |
| 10 | HDMI7 | x | - |- | - |
| 11 | AV1 | x | x | x | x |
| 12 | AV2 | x | x | x | x |
| 13 | AV3 | x | x | x | x |
| 14 | AV4 | x | x | x | x |
| 15 | AV5 | x | x | - | x |
| 16 | AV6 | x | x | - | x |
| 17 | AV7 | x | x | - | x |
| 18 | V-AUX | x | x |x | x |
| 19 | AUDIO | x | - |- | - |
| 20 | AUDIO1 | x | x | x | - |
| 21 | AUDIO2 | x | x | x | - |
| 22 | AUDIO3 | x | x | x | - |
| 23 | AUDIO4 | x | x | x | - |
| 24 | NET | x | x | x | - |
| 25 | Rhapsody | x | x | x | - |
| 26 | SIRIUS IR x| x | x | - |
| 27 | Pandora | x| x | x | - |
| 28 | SERVER | x| x | x | - |
| 29 | NET RADIO | x| x | x | - |
| 30 | USB | x| x | x | - |
| 31 | iPod (USB) | x| x | x | - |
| 32 | AirPlay | x| x | x | - |


 
 ### Exemples
[^](#sommaire)<br>
Quelques exemples de commandes :
  - `yamaha_volumeDown#50` : Baisse le volume de 5dB
  - `yamaha_powerOn,*2,setInputTo#4#1,setVolumeTo#-400#1,sleep#90#1` : Allume l'ampli, attend 2 secondes, passe sur HDMI1, règle le volume à -40dB et active la veille auto dans 90 minutes. (et le tout en zone 1).
  - ... A vous de jouer !


### Actions avancées
[^](#sommaire)<br>
Si le js vous est familier, vous pouvez créer des chainages plus complexes avec des requêtes, promesses etc...
Pour cela, créez un fichier js dans dans le répertoire `assistant-plugins/node_modules/assistant-yamaha`. Le fichier doit se nommer `yamaha_presonnalCommands.js`. Il sera automatiquement loadé par le script au démarrage d'assistant-plugins.
Structure vierge du fichier :
```javascript
var Promise = require("bluebird");
var xml2js = Promise.promisifyAll(require("xml2js"));
function Yamaha(){}
		//votre code ici :

		//--
module.exports = Yamaha;
```

Exemple de commandes chainées : 
```javascript
var Promise = require("bluebird");
var xml2js = Promise.promisifyAll(require("xml2js"));
function Yamaha(){}
		//votre code ici :
		
			Yamaha.prototype.maFctPerso = function(){
				var self = this;
				return self.powerOn().then(function(){
					self.setMainSceneTo(2).then(function(){
						return self.setVolumeTo(-480);
					});	
				});
			}
			
		//--
module.exports = Yamaha;
```
Cette fonction allume l'ampli, attends la confirmation, passe en scène préconfigurée 2 sur l'ampli, puis régle le volume à -48.0dB. Et pour l'appeler via IFTTT, rien de plus simple : dans le champs *« Message »* de push note, mettre `yamaha_maFctPerso` et le tour est joué.


### Applets IFTTT
[^](#sommaire)<br>
Quelques exemples de commande IFTTT pour le principe : <br>
  - [Extinction](https://ifttt.com/applets/83601698d-alexa-declenche-extinction-coupe-freebox-ampli-et-lampe-au-bout-de-50-sec) :  Cette commande utilise plusieurs plugins de assistant-plugin et exécute dans l'ordre :
    - extinction de la freebox
    - extinction ampli
    - temporisation de 50 sec
    - extinction des lumière dans la maison (via une autre requête IFTTT)

  - ...
