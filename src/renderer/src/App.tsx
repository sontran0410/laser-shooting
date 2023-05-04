import { useEffect, useRef } from 'react'
import Webcam from 'react-webcam'
import { Box } from '@mui/material'
function App(): JSX.Element {
  const webcamRef = useRef<Webcam>(null)
  const faceImgRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    // navigator.mediaDevices.enumerateDevices().then(console.log);
  }, [])
  useEffect(() => {
    const detectFace = async () => {
      if (webcamRef.current) {
        const imageBase64 = webcamRef.current.getScreenshot()
        // console.log(imageSrc)
        if (imageBase64) {
          const result = await window.electron.ipcRenderer.invoke('app.detect', imageBase64)
          const context = faceImgRef.current?.getContext('2d')
          if (context) {
            const imageElement = new Image()
            imageElement.onload = function () {
              context.drawImage(imageElement, 0, 0)
            }
            imageElement.src = `data:image/jpeg;base64,${result}`
          }
          return true
        }
      }
      return false
    }

    let handle = 0
    const nextTick = () => {
      handle = requestAnimationFrame(async () => {
        await detectFace()
        nextTick()
      })
    }
    nextTick()
    return () => {
      cancelAnimationFrame(handle)
    }
  }, [])
  return (
    <Box height="100%" width="100%">
      <Webcam
        ref={webcamRef}
        className="webcam"
        mirrored
        screenshotFormat="image/jpeg"
        audio={false}
        style={{ visibility: 'hidden' }}
      />
      <canvas className="outputImage" ref={faceImgRef} />
    </Box>
  )
}

export default App
