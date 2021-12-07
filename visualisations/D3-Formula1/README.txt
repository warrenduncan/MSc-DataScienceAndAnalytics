##################################################################################################################
################################################## INSTRUCTIONS ##################################################
##################################################################################################################

The visualisation were primarily created using D3, however HTML, CSS, and Javascript were also utilised. The 
html pages can be run statically on a locally hosted server, with the index.html file acting as the initiation 
page for both visualisations. Information on index.html explains the visualisations and how they are presented. 

Each visualisation html page (drivers.html and constructors.html) can be run in isolation. Thus, it is not
a requirement that the visualisation is initiated using the index.html file.

Certain elements of JQuery, CSS, Javascript, and D3 were imported using CDNS. Therefore, an internet connection 
is required in order to ensure the correct functionality of the visualisations and that the appropriate formatting 
is maintained.

##################################################################################################################

FILE DESCRIPTIONS:
 	* index.htlm: The home page that introduces the visualisations.
 	* constructors.html: The html page with the constructors visualisation.
 	* drivers.html : The html page with the drivers visualisation.
 	* references.html: The html page with the list of references used for all visualisations.

##################################################################################################################

DIRECTORY DESCRIPTIONS:
 	* css: a styling CSS file used in all html files:
   	    	- style.css

 	* js: A javascript file used in all the HTML files:
	    	- javascript.js

 	* data: Contains two pre-processed databases and a preprocessing , directory with sourced csv files. The 
	 	The contents of this directory are as follows: 
	    	- constHistory.csv: Final constructor csv file used in visualisations
	     	- driverHistory.csv: Final driver csv file used in visualisations
		- F1-data-preprocessing (directory): A preprocessing directory where data was preprocessed using 
						   the R programming language. This directory contains the R 
						   preprocessing file and the raw csv files. Contents of the
						   directory are as follows:
			+ F1-data-preprocessing.Rproj: The R project where the preprocessing was done.
			+ data-preprocessing.R: The file containing the R code for preprocessing.
			+ kaggle (directory): The directory which contains raw data. Contents of the directory
					     are as follows:
		  		> races.csv: latest data on F1 races.
				> drivers.csv: latest data on F1 drivers.
				> constructors.csv: latest data on F1 constructors.
				> results.csv: latest data on F1 results.