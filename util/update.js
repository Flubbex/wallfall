var dirToJson = require('dir-to-json'),
    fs        = require("fs")

  
dirToJson( "./wallpaper")
.then( function( dirTree ){
  fs.writeFile("./src/listing.json",
               JSON.stringify(dirTree), 
               function(err) {
    if (err) {
        return console.log(err)
    }
    
    console.log("done")
  }); 
  
 })
.catch( function( err ){
    throw err;
});