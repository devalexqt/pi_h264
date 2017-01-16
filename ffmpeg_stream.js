var spawn = require('child_process').spawn;
const Split = require('stream-split');
const NALseparator    = new Buffer([0,0,0,1]);//NAL break

function start(stream){
console.log("==>>>>>start ffmpeg")

var proc1=spawn("ffmpeg",[
						// "-s","640x360",
						// "-re",
						// "-framerate","30",
						// "-pixel_format","yuv420p",//"yuv420p",//yuyv422 
						// //"-f","rawvideo",
						// "-i","/dev/video0",
						"-c:v","h264_mmal",
						"-i","/home/pi/1080.mp4",
						"-c:v","h264_omx",
						"-b:v","1M",
						"-s","640x360",
						//"-s","1920x1080",
						"-an",
						//"-c:a","copy",
						"-c:v","h264_omx",
						"-vprofile","baseline",//baseline
						//"-vf","drawtext='fontfile=/home/pi/ffmpeg/freefont/FreeSans.ttf:text=%{localtime\}':fontsize=50:fontcolor=yellow@1:box=1:boxcolor=red@0.9:x=(w-tw)/2:y=10",
						//"-loglevel","error",
						"-stats",
						//"-tune","zerolatency",
						"-f","h264",
						//"-reset_timestamps", "1",
						//"-movflags","isml+empty_moov+faststart",//+faststart//"frag_keyframe+empty_moov",
						"-fflags","nobuffer",
						//"-frag_duration","5",
						"-y",
						//"cam_video.mp4"
						"-"
						])
    var proc = spawn('raspivid', [//work!
    					'-t', '0',
    					'-o', '-',
    					'-w', 640,
    					'-h', 360,
    					'-fps', 30,
    					'-pf', "baseline"//'baseline'
    					]);

	var rawstream=proc.stdout.pipe(new Split(NALseparator))

	rawstream.on("data",function(data){
		//stream.send(Buffer.concat([NALseparator, data]),{ binary: true})
		broadcast(Buffer.concat([NALseparator, data]))
	})


function broadcast(data){
	stream.clients.forEach(function(socket) {
		socket.send(data,{ binary: true})
	})//clients
}//broadcast
	// proc.stdout.on("data",function(data){
	// 	//console.log("==>stdout: "+data.toString())
	// 	stream.send(data,{ binary: true})
	// })//on data
	// proc.stdout.pipe(stream).on("error",function(error){
	// 	console.log("==>pipe error: "+error)
	// })//pipe error

	proc.stderr.on("data",function(data){
		console.log("==>sdterr: "+data.toString())
	})//on error

	proc.on("close",function(code){
		console.log("process exit with code: "+code)
	})//on close

return proc
}//start

exports.start=start