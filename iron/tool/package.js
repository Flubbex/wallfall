var dirToJson = require('dir-to-json'),
    fs        = require("fs"),
    base      = process.cwd()
    

function toCollection(child)
{
  return child.path
}

function toCollectionSet(out,child){
  var spacer = " ".repeat(25).slice(child.name.length-1)
  
  console.log(child.name,':',spacer,child.children.length,'image(s)')
  
  out[child.name] = child.children.map(toCollection)
  
  return out
}

function listing(dirtree){
  console.log("--Packing",dirtree.children.length,"directories--")
  
  var out = dirtree.children.reduce(toCollectionSet,{})
  
  return JSON.stringify(out)
}  

module.exports = function(toolkit){
  
  toolkit.command("pack [directory] [destination]")
     .description("Package a directory into a listing, defaults: 'wallpaper', 'src' ")
     .option("-f, --filename <name>", "sets output filename")
     .action(function(_directory,_destination,options){
                var directory     = base + '/' + (_directory||'wallpaper'),
                    destination   = base + '/' + (_destination||'src'),
                    filename      = options.filename || 'listing.json'
                    
                dirToJson( directory )
                .then(( dirTree )=>{
                  fs.writeFile(destination+"/"+filename,
                               listing(dirTree), 
                               (err)=>{
                    if (err) 
                        console.log(err)
                    else 
                      console.log("Wrote listing to: \n\t"+destination+"/"+filename)
                  })
                  
                 })
                .catch(( err )=>{
                    throw err;
                })
              })
}