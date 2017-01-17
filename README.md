##Live real time stream with no delay from Raspberry Pi to browser 
based on boradway https://github.com/mbebenita/Broadway browser sw h264 decoder.

In browser it use broadway h264 software decoder to decode NAL h264 packets and rende decoded frame to html canvas.  
For receive NAL h264 baseline packets from server (Raspberry Pi) it use websocket over sockets.io.  
On server it use raspberry camera for get NAL baseline h264 packets from spawned process and send it over sockets.io.  

```
    var proc = spawn('raspivid', [
    					'-t', '0',
    					'-o', '-',// out h264 to std out
    					"-n",
    					'-w', 640,
    					'-h', 360,
    					'-fps', 30,
    					'-pf', "baseline"//only accepted profile for decoder
    					]);
```
 Is it possible to use ffmpeg 3.2 with h264_omx support (need modify libavcodec/omx.c for enable baseline h264 profile, because default is High profile).  

ADD to libavcodec/omx.c at line 518 v3.2 for support baseline profile
!!!Do not need configure again if you already have compiled  ffmpeg, just run make command!!!
```
        avc.eProfile=OMX_VIDEO_AVCProfileBaseline;
```
Example:
```
   if (avctx->codec->id == AV_CODEC_ID_H264) {
        OMX_VIDEO_PARAM_AVCTYPE avc = { 0 };
        INIT_STRUCT(avc);
        avc.nPortIndex = s->out_port;
        err = OMX_GetParameter(s->handle, OMX_IndexParamVideoAvc, &avc);
        CHECK(err);
        avc.nBFrames = 0;
        avc.nPFrames = avctx->gop_size - 1;
        //add
        avc.eProfile=OMX_VIDEO_AVCProfileBaseline;/////////////////////////////// change h264 profile to baseline
        //avc.eLevel=OMX_VIDEO_AVCLevel3;//////////////////////////////////////// change level if you want
        //add
        err = OMX_SetParameter(s->handle, OMX_IndexParamVideoAvc, &avc);
        CHECK(err);
    }
 ```   
 Possible profile values:
 ```
OMX_VIDEO_AVCProfileBaseline 	Baseline profile
OMX_VIDEO_AVCProfileMain 	Main profile
OMX_VIDEO_AVCProfileExtended 	Extended profile
OMX_VIDEO_AVCProfileHigh 	High profile
OMX_VIDEO_AVCProfileHigh10 	High 10 profile
OMX_VIDEO_AVCProfileHigh422 	High 4:2:2 profile
OMX_VIDEO_AVCProfileHigh444 	High 4:4:4 profile
OMX_VIDEO_AVCProfileMax 
 ```
 Possible level value:
 ```
OMX_VIDEO_AVCLevel1 	Level 1
OMX_VIDEO_AVCLevel1b 	Level 1b
OMX_VIDEO_AVCLevel11 	Level 1.1
OMX_VIDEO_AVCLevel12 	Level 1.2
OMX_VIDEO_AVCLevel13 	Level 1.3
OMX_VIDEO_AVCLevel2 	Level 2
OMX_VIDEO_AVCLevel21 	Level 2.1
OMX_VIDEO_AVCLevel22 	Level 2.2
OMX_VIDEO_AVCLevel3 	Level 3
OMX_VIDEO_AVCLevel31 	Level 3.1
OMX_VIDEO_AVCLevel32 	Level 3.2
OMX_VIDEO_AVCLevel4 	Level 4
OMX_VIDEO_AVCLevel41 	Level 4.1
OMX_VIDEO_AVCLevel42 	Level 4.2
OMX_VIDEO_AVCLevel5 	Level 5
OMX_VIDEO_AVCLevel51 	Level 5.1
OMX_VIDEO_AVCLevelMax
 ```

```
>./configure --disable-encoders --enable-encoder='aac,h264_omx,mjpeg,libx264' --disable-decoders --enable-decoder='rawvideo,mjpeg,aac,h264_mmal' --enable-libfreetype --enable-static --enable-mmal --enable-omx-rpi --enable-yasm --enable-nonfree --enable-gpl --disable-doc

>make -j 4

>sudo make install
//comilation time 2h-3h
```
After that check ffmpeg decoders and encoders:
```
ffmpeg -decoders
 V..... h264_mmal            h264 (mmal) (codec h264)
 V....D mjpeg                MJPEG (Motion JPEG)
 V..... rawvideo             raw video
 A....D aac                  AAC (Advanced Audio Coding)
```
```
ffmpeg -encoders
 V..... h264_omx             OpenMAX IL H.264 video encoder (codec h264)
 VFS... mjpeg                MJPEG (Motion JPEG)
 A..... aac                  AAC (Advanced Audio Coding)
```
Type for more information about encoder/decoder:
```
ffmpeg -h decoder=h264_mmal
ffmpeg -h encoder=h264_omx
``` 


Spawn ffmpeg for get h264 stream from Raspberry Pi camera:
```
var proc=spawn("ffmpeg",[
						"-s","640x360",
						"-re",
						"-framerate","30",
						"-pixel_format","yuv420p",//"yuv420p",//yuyv422 
						"-i","/dev/video0",
						// "-c:v","h264_mmal",
						// "-i","/home/pi/360.mp4",
						"-c:v","h264_omx",
						"-b:v","1M",
						"-s","640x360",
						//"-s","1920x1080",
						"-an",
						//"-profile:v","baseline",//baseline
						//"-vf","drawtext='fontfile=/home/pi/ffmpeg/freefont/FreeSans.ttf:text=%{localtime\}':fontsize=50:fontcolor=yellow@1:box=1:boxcolor=red@0.9:x=(w-tw)/2:y=10",
						"-loglevel","error",
						"-stats",
						"-tune","zerolatency",
						"-f","h264",
						//"-reset_timestamps", "1",
						//"-movflags","isml+empty_moov+faststart",//+faststart//"frag_keyframe+empty_moov",
						//"-fflags","nobuffer",
						//"-frag_duration","5",
						"-y",
						//"cam_video.mp4"
						"-"
						])
```
With -vf (video filter option) you can write text, time, etc on video frame encoded in h264!

Raw stream from spawned proccess must be parsed as separate NAL units and sended over socket to client.
```
	const NALseparator    = new Buffer([0,0,0,1]);//NAL break
	....
	var rawstream=proc.stdout.pipe(new Split(NALseparator))

		rawstream.on("data",function(data){
		 socket.emit("nal_packet",Buffer.concat([NALseparator, data]))
	})

``` 

##Client (html)
Open page http://_raspberry_ip:8080 

After page was loaded socket connected to server and now you can push start/stop button to start/stop live stream.  
With 640x360 frame size and 30 fps mode I get no delay (~100ms or less).  
More resolution = more problem.


