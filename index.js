

module.exports = {
 /**
   * Complete Logger
   *
  */
  config : null,
  colors : require('colors/safe'),
  fs : require('fs'),
  clock : require("simple-clock"),
  loggers : null,
  starting : false,
  commitCount : {trace:0},
  init: function(config) {
  	var $this = this;

  	if(config && config.output){
	  	$this.config = config;
	
		$this.colors.setTheme({
				log : ['white', 'bold'], 
				error: ['red', 'bold'], 
				warn : ['yellow'], 
				info : ['yellow', 'bold'], 
				success : ['green', 'bold'], 
				debug : ['blue', 'bold'],  
				fatal : ['cyan']
		});

		$this.loggers = {"list":{},"contains":{}};

		// Récupération des loggers
		$this.loggers.list = {"trace":config.output+"/trace.log"};

		$this.readLoggers($this.loggers.list, 0);
	}

  },

  log : function(message, type){
  	var $this = this;

  	if($this.config && $this.config.output){
  		if($this.starting){
	  		$this.logToConsole({type:type?type:"default", msg:message});
	  	}
	  	else{
	  		$this.init();
	  		$this.logToConsole({type:type?type:"default", msg:message});
	  	}
  	}
  	else{
  		console.log(" Set configs before to continue ");
  	}
  	
  },

  readLoggers(list, iD, type, message){
		var $this = this;
		var id = Object.keys(list)[iD]?Object.keys(list)[iD]:null;

		if(id){

			try{
				var dataLog = $this.fs.readFileSync(list[id], {"encoding":"utf8","flag":"a+"});
				$this.loggers.contains[id] = {};

				try{
		            $this.loggers.contains[id]["log"] = dataLog.toString();
		        }catch(err){ 
		        	$this.loggers.contains[id]["log"] = "";
		        	$this.logToConsole({type:"error","msg":"Erreur de récupération du logger - "+list[id]+" : vérifiez le contenu "});
		        }
		        if($this.loggers.contains[id]["log"] != "")
		        	$this.loggers.contains[id]["log"] += " ------ \n";

		        $this.loggers.contains[id]["log"] += "\n\n ########## Logger du "+$this.clock.getTime("full")+" ########## \n\n";
		        $this.logToFile("Logger", list[id], $this.loggers.contains[id]["log"]);
		        
		        if(iD < Object.keys(list).length-1)
		        	$this.readLoggers(list, iD++);
		        else
		        {
		        	$this.starting = true;
		        }
			}catch(err){
				$this.logToConsole({type:"error","msg":"Erreur de création du logger - "+list[id]}, false);
			}
		
		}
  },

  logToConsole(content, excludeFile){
	var $this = this;
	var message = "";


	if(content.type=="default"){
		message = "\n   "+content.msg;
		message = $this.colors.white(message);
		if($this.loggers.contains["trace"])
		$this.loggers.contains["trace"]["log"] += " > NORM ~ "+content.msg+"   ~ "+$this.clock.getTime("h:min:s")+" \n";
	}
	else if(content.type=="error"){
		message = "\n   ERROR: "+content.msg;
		message = $this.colors.error(message);
		if($this.loggers.contains["trace"])
		$this.loggers.contains["trace"]["log"] += " > ERR  ~ "+content.msg+"   ~ "+$this.clock.getTime("h:min:s")+" \n";
	}   
	else if(content.type=="info"){
		message = "\n   INFO: "+content.msg;
		message = $this.colors.info(message);
		if($this.loggers.contains["trace"])
		$this.loggers.contains["trace"]["log"] += " > INFO ~ "+content.msg+"   ~ "+$this.clock.getTime("h:min:s")+" \n";
	}    
	else if(content.type=="success"){
		message = "\n   SUCCESS: "+content.msg;
		message = $this.colors.success(message);
		if($this.loggers.contains["trace"])
		$this.loggers.contains["trace"]["log"] += " > SUCC ~ "+content.msg+"   ~ "+$this.clock.getTime("h:min:s")+" \n";
	} 
	else if(content.type=="fatal"){
		message = "\n   FATAL: "+content.msg;
		message = $this.colors.fatal(message);
		if($this.loggers.contains["trace"])
		$this.loggers.contains["trace"]["log"] += " > FATAL ~ "+content.msg+"   ~ "+$this.clock.getTime("h:min:s")+" \n";
	} 
	else if(content.type=="warn"){
		message = "\n   WARN: "+content.msg;
		message = $this.colors.warn(message);
		if($this.loggers.contains["trace"])
		$this.loggers.contains["trace"]["log"] += " > WARN ~ "+content.msg+"   ~ "+$this.clock.getTime("h:min:s")+" \n";
	} 
	else if(content.type=="debug"){
		message = "\n   DEBUG: "+content.msg;
		message = $this.colors.debug(message);
		if($this.loggers.contains["trace"])
		$this.loggers.contains["trace"]["log"] += " > DEBUG ~ "+content.msg+"   ~ "+$this.clock.getTime("h:min:s")+" \n";
	} 

	if(!excludeFile){
		if($this.loggers.contains["trace"])
		$this.logToFile("trace", $this.loggers.list["trace"], $this.loggers.contains["trace"]["log"]);
		console.log(message);
	}
	
  },

  save(file){
	var $this = this;

	$this.init(file);
  },

  logToFile(title, file, data){
  	var $this = this;

	try{
		$this.fs.writeFileSync(file, data);
		$this.logToHTML(title, file, data);
	}catch(err){
		$this.log("error","Impossible d'enregistrer le log : "+err);
	}
	
  },

  logToHTML(title, file, data){
  	var $this = this;
  		file = file.replace(/.log/g, ".html");
  	var contain =  "<html>";
  		contain += "<head>";
  		contain += "<style>";
  		contain += "body{background-color:black; color:#fff;}";
  		contain += ".log-container{display:block;width:100%;height:auto;margin-bottom:20px;}";
  		contain += ".log-container .log-title{display:block;width:100%;height:40px;line-height:40px;text-align:center;}";
  		contain += ".SUCC{color:green;}";
  		contain += ".INFO{color:#FF9800;}";
  		contain += ".ERR{color:red;}";
  		contain += ".NORM{color:white;}";
  		contain += ".FATAL{color:cyan;}";
  		contain += ".WARN{color:#F7D500;}";
  		contain += ".DEBUG{color:blue;}";
  		contain += "</style>";
  		contain += "</head>";
  		contain += "<body>";

  		var logs = data.split("------");
  		var logs_contain = "<div class=\"logs-container\">";
  		for(var i=logs.length-1;i>=0;i--){
  			logs_contain += "<div class=\"log-container\">";

  			var section1 = logs[i].split("##########");

  			logs_contain += "<div class=\"log-title "+section1[2].split("~")[0].split(">")[1]+"\">";
  			logs_contain += "###### "+section1[1]+" ######";
  			logs_contain += "</div>";


  			var section2 = section1[2].split("~");
  			logs_contain += "<div class=\"log-type "+section2[0].split(">")[1]+"\">";
  			// logs_contain += section2[0].split(">")[1];
  			logs_contain += "</div>";

  			logs_contain += "<div class=\"log-message "+section1[2].split("~")[0].split(">")[1]+"\">";
  			logs_contain += section2[1];
  			logs_contain += "</div>";

  			logs_contain += "<div class=\"log-time\">";
  			logs_contain += section2[2];
  			logs_contain += "</div>";

  			logs_contain += "</div>";

  		}
  		logs_contain += "</div>";

  		contain += logs_contain;
  		contain += "</body>";
  		contain += "</html>";

		try{
			$this.fs.writeFileSync(file, contain);
			$this.commitCount[title] += 1;
		}catch(err){
			$this.log("error","Impossible d'enregistrer le log : "+err);	
		}
		
  }


};

