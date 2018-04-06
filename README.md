# complete-logger
<<<<<<< HEAD
Complete logger for your nodejs application
=======
Complete logger for your nodejs application with HTML logs generated.

[![NPM version](https://img.shields.io/npm/v/complete-logger.svg)](https://www.npmjs.com/package/complete-logger)

## How to use

#### Install it as npm dependence

	npm install complete-logger


#### Log Messages
To log something into a console and files, you just have to firts instanciate "customise-log" object like this:

	var logger = require("complete-logger");            

Secondly, you have to set the output path of the logs trace and html by calling the init method of your object :
	
	logger.init({output:"/path/to/the/ouputs/logs/folder"});

Now you can log what you want by calling the log method of your object :
	
	logger.log(message, level);

They are two options here :
	
###### The level option
To specify the level of the log, we have 7 possibilities :

	- info    
	- success
	- fatal
	- warn
	- debug
	- error
	- default

"default" level is the default level use to set a normal info log or to customise output messages when no level are specified into a log method :
	
	logger.log(message);


#### Complete example

	var logger = require("complete-logger");
		logger.init({output:"Loggers"});
		logger.log("Information message", "info");


## License

[MIT](LICENSE)


Enjoy it !
>>>>>>> initial commit
