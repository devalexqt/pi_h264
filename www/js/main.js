//var socket = new WebSocket("ws://" + document.location.host)
//	socket.binaryType = "arraybuffer"
//var wsavc
console.log(document.location.host)
var socket 
var player
var fps_display

var frame_list=[]
var frame_num=0//fps counter
var nal_packet_num=0
var first_picure=false


function initPage(){
	console.log("==> initPage")
	fps_display=document.getElementById("fps_id")

	socket= io("http://"+document.location.host)
	
	socket.on("data",function(data){
		console.log("message: "+JSON.stringify(data))
	})//message

	socket.emit("data",{data:"Hi from client!"})


	socket.on("nal_packet",function(data){//nal_packet//message
		nal_packet_num++
		//frame_list.push(data)

			player.decode(new Uint8Array(data),{frame:frame_num++})//frame_list.pop()

	})//nal_packet

// document.addEventListener("webkitRequestAnimationFrame",function(){
// 		console.log("requestAnimationFrame...")

// },true)

// window.requestAnimationFrame(function(){
// 	 		console.log("requestAnimationFrame...")
// })


//boadway
    // resultModule._broadwayOnHeadersDecoded = par_broadwayOnHeadersDecoded;
    // resultModule._broadwayOnPictureDecoded = par_broadwayOnPictureDecoded;

	player = new Player({
		useWorker: true,
		workerFile:"broadway/Decoder.js",
		webgl:true,
	  	size:{ width:640, height:360}
	})//player

//player.busy=false

	player.broadwayOnPictureDecoded=function(){
		console.log("_broadwayOnPictureDecoded")
	}
	player.broadwayOnHeadersDecoded=function(){
		console.log("_broadwayOnHeadersDecoded")
	}
	// player.onPictureDecoded=function(buffer, width, height, infos){
	// 	//player.busy=false
	// 	//console.log("==>>onPictureDecoded, frame:"+width+"x"+height+", num: "+infos[0].frame+"/ nal nal_packet_num: "+nal_packet_num)
	// }//onPictureDecoded

	// player.onRenderFrameComplete=function(){
	// 	//console.log("onRenderFrameComplete")
	// }

var container=document.getElementById("canvas_container_id")
 	container.appendChild(player.canvas);

//count fps
setInterval(function(){
	fps_display.innerHTML=frame_num+" fps"
	frame_num=0
},1000)

}//initPage

function startVideo(){
	console.log("==>startVideo..")
	socket.emit("start_stream",{action:"start_stream"})
}//startVideo

function stopVideo(){
	console.log("==>stopVideo")
	socket.emit("stop_stream",{action:"stop_stream"})
}//stopVideo