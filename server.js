var http=require("http")
var os=require("os")
var netInt=os.networkInterfaces()
var fs=require("fs")
var ffmpeg=require("./ffmpeg_stream.js")
var WebSocket=require("ws")

var server=http.createServer(function(req,res){
	console.log("==>new connection: "+req.connection.remoteAddress+", url: "+req.url)
	//res.end("Hi from Raspberry!")
	var filename=req.url=="/"?"/index.html":req.url
	var method=req.method.toLowerCase()
	//console.log("==>method: "+method)

if(method=="get"&&req.url!="/videostream.mp4"){
	var file=fs.createReadStream("www"+filename)
	file.on("error",function(err){
		console.log("Can't open file, err: "+err)
	})
	file.pipe(res)
}//if no videostream
	else if(method=="get"&&req.url=="/videostream.mp4"){
		console.log("==>video stream request....")
		// res.writeHead(206, {
		//                   'Transfer-Encoding': 'chunked'
		//                  , 'Content-Type': 'video/mp4'
		//                  //, 'Content-Length': 5000000000 // large size to fake a file
		//                  //, 'Accept-Ranges': 'bytes ' + start + "-" + end + "/" + total
		// });
		//var ff_stream=new ffmpeg.start(res)


	}//videostream

}).listen(8080)

var ff_stream
//websocket
var wsServer=new WebSocket.Server({server})//{port:8081}
	
	wsServer.on("connection",function(ws){
		console.log("==>new ws client: ")
		//ws.send("Same data!")
//new client
		ws.send(JSON.stringify({
		  action : "init",
		  width  : 640,
		  height : 360,
		}));

		ws.on("message",function(data){
			console.log("==>new ws message: "+data.toString())
			 	//ff_stream=new ffmpeg.start(wsServer)

			var j_data=JSON.parse(data.toString())
				if(j_data.action=="start_video"){
					console.log("==>starting video")
				ff_stream=new ffmpeg.start(wsServer)
				}//start video
				if(j_data.action=="stop_video"){
					console.log("==>stoping video")
					try{ff_stream.kill()}
					catch(e){console.log(e)}
				}//start video
		})//

		ws.on("close",function(){
			console.log("==>ws client closed: ")
		})//
	
})//cconected socked

console.log("Server started from smb!")
console.log(netInt)
