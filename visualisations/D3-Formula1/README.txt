##################################################################################################################
######################################## FORMULA 1 VISUALISATION USING D3 ########################################
##################################################################################################################

The visualisation were primarily created using D3, however HTML, CSS, and Javascript were also ustilised. The 
html pages can be run statically on a locally hosted server, with the index.html file acting as the intiation 
page for both visualisations. Information on index.html explains the visualisations and how they are presented. 

However, each visualisation html page (drivers.html and constructors.html) can be run in isolation on a locally
hosted server. Each page contains information that explains the nature of each graphic, and all the neccessary
imports for that particular visualisation.

Certain elements of JQuery, CSS, Javascript, and D3 were imported using CDNS. Therefore, an internet connection 
is required in order to ensure the correct functionality of the visualisations and that the appropriate fomratting 
is maintained.

##################################################################################################################

FILE DESCRIPTIONS:
 	* index.htlm: The home page that introduces the visualisations.
 	* constructors.html: The html page with the constructors visualisation.
 	* drivers.html : The html page with the drivers visualisation.
 	* references.html: The html page with the list of references used for all visualisations.

##################################################################################################################

DIRECTORY DESCRIPTIONS:
 	* css: CSS file used in all html files:
   	    	- style.css: For general styling and front-end development 

 	* js: Javascript files used in all the HTML files:
	    	- javascript.js: For general styling and front-end development
			- D3-constructors.js: D3 used to create the constructors visualisation
			- D3-drivers.js: D3 used to create the drivers visualisation

 	* data: Contains two pre-processed databases, a jupyter notebook, and a folder with the sourced csv files. The 
	 		The contents of this directory are as folllows: 
	    	- constHistory.csv: Final constructor csv file used in visualisations
	     	- driverHistory.csv: Final driver csv file used in visualisations
		  	- preprocessing-F1data.ipynb: notebook where data was preprocessed using the R programming language
		  	- kaggle (directory): holds the csv files downloaded from Kaggle (see references.html)