var ghpages = require('gh-pages'),
    fs        = require("fs"),
    base      = process.cwd()
    
module.exports = function(toolkit){
  
  toolkit.command("publish [directory]")
     .description("Publish a directory to github pages")
     .action(function(_directory,options){
                var directory     = base + '/' + (_directory||'build')
                
                ghpages.publish(directory,function(err){
                  if (err)
                    console.log(err)
                })
              })
}