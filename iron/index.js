/* 
Iron.js
Waffle CLI utility for packaging and processing of image collections
*/

var program = require("commander")

program.version('0.1.0')

toolkit   = Object.values ( require("require-all")({
  dirname:__dirname+"/tool",
  resolve:function(tool){
    return tool(program)
  }
}) )

if (process.argv.length > 2)
  program.parse(process.argv)
else 
  program.outputHelp()