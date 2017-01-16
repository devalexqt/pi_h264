//var socket = new WebSocket("ws://" + document.location.host)
//var wsavc

var player
function initPage(){
	console.log("==> initPage")
	var v = document.getElementsByTagName("video")[0];

	// v.addEventListener("seeked", function() {
	// 	console.log("seeked...")
	//   }, true);
	// v.addEventListener("loadeddata", function() {
	// 	console.log("loadeddata...")
	//   }, true);


	// v.addEventListener("canplaythrough", function() {
	// 	console.log("canplaythrough..., time: "+v.currentTime+", buffered: "+v.buffered.end(0)+", paused: "+v.paused)
	// 			//v.currentTime=v.currentTime
	// 			//v.pause()
	// 			//if(v.paused){v.play()}

	//   }, true);

	// setInterval(function(){
	// 	//var buffered=v.buffered.end(0)
	// 	console.log("==>buffered:"+v.buffered.end(0)+"/ "+v.currentTime+"/"+v.seekable.start(0))
	// },1000)

	// v.addEventListener("canplay", function() {
	// 	console.log("canplay...")
	// 	//v.currentTime=v.currentTime
	// 	//v.play()
	//   }, true);

	// v.addEventListener("timeupdate", function() {
	// 	//console.log("timeupdate...")
	//   }, true);
	

	// v.addEventListener("ended", function() {
	// 	console.log("ended...")
	//   }, true);


	// v.addEventListener("error", function() {
	// 	console.log("error...")
	//   }, true);

	// v.addEventListener("playing", function() {
	// 	console.log("playing...")
	//   }, true);

	// v.addEventListener("progress", function() {
	// 	//console.log("progress...")
	//   }, true);

	// v.addEventListener("waiting", function() {
	// 	console.log("waiting...")
	// 	//v.pause()
	//   }, true);

	// v.addEventListener("loadedmetadata", function() {
	// 	console.log("loadedmetadata...")
	//   }, true);

	// v.addEventListener("durationchange", function() {
	// 	console.log("durationchange...")
	// });


	// socket.onmessage=function(ev){
	// 	console.log("=>ws: new message: "+ev.data.toString())
	// }

	// socket.on("connect",function(ws){
	// 	console.log("=>ws: new connection")
	// })//

	// socket.on("message",function(data){
	// 	console.log("=>ws: new message: "+data.toString())
	// })//

	// socket.on("close",function(){
	// 	console.log("=>ws: closed")
	// })//

// 	var canvas = document.createElement("canvas");
// document.body.appendChild(canvas);

// // Create h264 player
// var uri = "ws://" + document.location.host;
// var wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
// wsavc.connect(uri);

//boadway
// player = new Player({
// 	useWorker: true,
// 	workerFile:"broadway/Decoder.js",
// 	webgl:true,
//   	size:{ width:640, height:360}
// })

// var container=document.getElementById("canvas_container_id")
//  	container.appendChild(player.canvas);


//h264 player

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
// setTimeout(function(){
// // Create h264 player
// var uri = "ws://" + document.location.host//"ws://192.168.1.24:8080"//"ws://" + document.location.host;
// 	wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
// 	wsavc.connect(uri)
// 	window.wsavc = wsavc;

	// wsavc.ws.onmessage=function(e){
	// 	console.log("==>onmessage..."+e.data)
	// }

//Create h264 player
	wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35)
	wsavc.connect("ws://" + document.location.host)
//expose instance for button callbacks
	window.wsavc = wsavc;
	socket=wsavc.ws

}//initPage



// socket.onmessage=function(e){
// 	console.log("==>socket message...")
// 	//player.decode(e.data)
// }//onmessage

function startVideo(){
	console.log("==>startVideo..")
	var data={
		action:"start_video"
		}
	socket.send(JSON.stringify(data))
	//wsavc.playStream()
}//startVideo

function stopVideo(){
	console.log("==>startVideo")
	var data={
		action:"stop_video"
		}
	socket.send(JSON.stringify(data))
	//wsavc.stopStream()
}//stopVideo