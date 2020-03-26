window.onload = function(){
    const video = document.querySelector("#video");

    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('models'),   //similar to any face detactor but it is small and quick for real time in any browser 
        faceapi.nets.faceLandmark68Net.loadFromUri('models'),  //for detection of face parts
        faceapi.nets.faceRecognitionNet.loadFromUri('models'), //allows the api to find face and to box around it
        faceapi.nets.faceExpressionNet.loadFromUri('models')   //for recognezing different face expressions
      ])
     .then(startVideo)


    function startVideo(){
        navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.error(err)
        )
    }
    video.addEventListener("play",()=>{
        const canvas = faceapi.createCanvasFromMedia(video) //intead of creating canvas element in html, we've created here
        document.body.appendChild(canvas)
        const displaySize = { width: video.width, height: video.height }    //so as to size the canvas according to the video
        faceapi.matchDimensions(canvas, displaySize)    //for making canvas size match the display size
        setInterval(async () => {       //setinterval because to run the code multiple times in a row and asynchronous because models are asynchronous
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()//detect all faces within the web cam
            console.log(detections); //  returns objects based on number of faces detected and all the details as detected
            const resizedDetections = faceapi.resizeResults(detections, displaySize)    //to size the box on the face
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)  //actual box appearing
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)   //gives the landmarks
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections) //gives the results based on your expressions
          }, 100)
    })
}
//loading models may take time, but usually quick