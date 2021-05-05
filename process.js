const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Yuri:IfMHnDqi7h8eFnzr@cluster0.p5voe.mongodb.net/textbooks?retryWrites=true&w=majority";
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var port = process.env.PORT || 3000;
// var path = require("path");
//var jsdom = require('jsdom');

var htmlSource = fs.readFile("FinalHome.html", function(err,txt){});

// function initMap(l1,l2) {
// var mapProp= {
//   center:new google.maps.LatLng(l1,-l2),
//   zoom:5,
// };
// map = new google.maps.Map(document.getElementById("map"),mapProp);
// }

http.createServer(function (req, res) {	  
	if (req.url == "/")
	{
		file = 'Final.html';
		fs.readFile(file, function(err, txt) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			if(err) {
                res.write("I have an error");
            }
			else {
				res.write(txt);
			}
        	res.end();
		});
	}
	else if (req.url == "/process")
	{
		res.writeHead(200, {'Content-Type':'text/html'});
		console.log ("Process the form");
		pdata = "";
		req.on('data', data => {
            pdata += data.toString();
        });
		// when complete POST data is received
		req.on('end', () => {
			pdata = qs.parse(pdata);    
            // on means when we have the data
	
            var date = pdata['date'];
            var entry = pdata['entry'];
            var latCoord = pdata['latCoord'];
			var lngCoord = pdata['lngCoord'];
            var color = pdata['color'];
            var fontColor = pdata['fontColor'];
	
            var insertQuery = {Date : date, Entry: entry, Lat: latCoord, Long: lngCoord, BGColor: color, Font: fontColor};
            var theQuery = "";
            MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
                if(err) { 
                    console.log("Connection err: " + err); return; 
                }
	
                var dbo = db.db("Final");
                var coll = dbo.collection('Diaries');
	
                //UNCOMMENT WHEN DONE coll.insertOne(insertQuery);
                console.log("success");
	
                coll.find(theQuery).toArray(function(err, items) {
                    if (err) {
                        console.log("Error: " + err);
                    } 
                    else 
                    {
                        console.log("Items: </br>");
                        file = 'FinalHome.html';
                        fs.readFile(file, function(err, txt) {
                        // console.log(txt);
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(txt);
						if (items.length == 0){
	                        console.log("Not found");
	                    } else {
	                        for (i=0; i<items.length; i++) {
	                        	// console.log(i + ": Time: " + items[i].Date + " Entry: " + items[i].Entry + "</br>");
                                res.write("<div style='padding: 20px;margin-top: 15px; width:60%;");
                                res.write("background-color: " + items[i].BGColor + "; color: " + items[i].Font);
                                res.write("'>");
	                        	res.write("<p id = 'dateLabel'>" + items[i].Date + "</p>");
	                        	res.write("<p id = 'entryLabel'>" + items[i].Entry  + "</p>" );
	                        	res.write("<p id = 'locationLabel'>" + items[i].Lat + " " + items[i].Long + "</p><br>");
                                res.write("</div>");
	                     	}
						}
                        res.end();
                        });
	
                    }  		
                });//end find	
	
                // db.close();  
            });  //end connect            
		});
	  }
	  else if (req.url == "/filter") {
	
		res.writeHead(200, {'Content-Type':'text/html'});
  		console.log ("Process the form");
	
  		pdata = "";
  		req.on('data', data => {
              pdata += data.toString();
          });
  		// when complete POST data is received
  		req.on('end', () => {
  			pdata = qs.parse(pdata);    
              // on means when we have the data
	
              MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
                  if(err) { 
                      console.log("Connection err: " + err); return; 
                  }
	
                  var dbo = db.db("Final");
                  var coll = dbo.collection('Diaries');
	
                  console.log("success");
				  var theQuery = { "Date":pdata["datepicker"] };
				  coll.find(theQuery).toArray(function(err, items) {
                      if (err) {
                          console.log("Error: " + err);
                      } 
                      else 
                      {
                          console.log("Items: </br>");
                          file = 'FinalFilter.html';
                          fs.readFile(file, function(err, txt) {
                          // console.log(txt);
                          res.writeHead(200, {'Content-Type': 'text/html'});
                          res.write(txt);
  						if (items.length == 0){
  	                        console.log("Not found");
							res.write("<p id = 'entryLabel'>No Entries</p>");
  	                    } else {
  	                        for (i=0; i<items.length; i++) {
  	                        	// console.log(i + ": Time: " + items[i].Date + " Entry: " + items[i].Entry + "</br>");
                                  res.write("<div style='padding: 20px;margin-top: 15px; width:60%;");
                                  res.write("background-color: " + items[i].BGColor + "; color: " + items[i].Font);
                                  res.write("'>");
                                  res.write("<p id = 'dateLabel'>" + items[i].Date + "</p>");
                                  res.write("<p id = 'entryLabel'>" + items[i].Entry  + "</p>" );
                                  res.write("<p id = 'locationLabel'>" + items[i].Lat + " " + items[i].Long + "</p><br>");
                                  res.write("</div>");
  	                     	}
  						}
                          res.end();
                          });
  	
                      }  		
                  });//end find	
	
                  // db.close();  
              });  //end connect            
  		});
	  }
	  else if (req.url == "/nofilter") {
	
		res.writeHead(200, {'Content-Type':'text/html'});
  		console.log ("Process the form");
	
  		pdata = "";
  		req.on('data', data => {
              pdata += data.toString();
          });
  		// when complete POST data is received
  		req.on('end', () => {
  			pdata = qs.parse(pdata);    
              // on means when we have the data
	
              MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
                  if(err) { 
                      console.log("Connection err: " + err); return; 
                  }
	
                  var dbo = db.db("Final");
                  var coll = dbo.collection('Diaries');
	
                  console.log("success");
				  var theQuery = "";
				  coll.find(theQuery).toArray(function(err, items) {
                      if (err) {
                          console.log("Error: " + err);
                      } 
                      else 
                      {
                          console.log("Items: </br>");
                          file = 'FinalHome.html';
                          fs.readFile(file, function(err, txt) {
                          // console.log(txt);
                          res.writeHead(200, {'Content-Type': 'text/html'});
                          res.write(txt);
  						if (items.length == 0){
  	                        console.log("Not found");
  	                    } else {
  	                        for (i=0; i<items.length; i++) {
  	                        	// console.log(i + ": Time: " + items[i].Date + " Entry: " + items[i].Entry + "</br>");
  	                        	  res.write("<div style='padding: 20px;margin-top: 15px; width:60%;");
                                  res.write("background-color: " + items[i].BGColor + "; color: " + items[i].Font);
                                  res.write("'>");
                                  res.write("<p id = 'dateLabel'>" + items[i].Date + "</p>");
                                  res.write("<p id = 'entryLabel'>" + items[i].Entry  + "</p>" );
                                  res.write("<p id = 'locationLabel'>" + items[i].Lat + " " + items[i].Long + "</p><br>");
                                  res.write("</div>");
  	                     	}
  						}
                          res.end();
                          });
  	
                      }  		
                  });//end find	
	
                  // db.close();  
              });  //end connect            
  		});
	  }
	  else 
	  {
		  res.writeHead(200, {'Content-Type':'text/html'});
		  res.write ("Unknown page request");
		  res.end();
	  } 
}).listen(port);