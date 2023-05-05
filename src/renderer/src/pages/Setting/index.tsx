import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import colors from '@renderer/const/color'
import useCamera from '@renderer/queries/cameraQuery'
import { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { RocketLaunch } from '@mui/icons-material'
import { useToggle, useUpdateEffect } from 'usehooks-ts'
const FPS = 30
export default function Setting() {
  const [open, _toggleOpen, setOpen] = useToggle(false)
  const { data, isLoading } = useCamera()
  const [device, setDevice] = useState<MediaDeviceInfo | undefined>(undefined)
  const [started, toggleStart, _setStart] = useToggle(false)
  const [calib, toggleCalib] = useToggle(true)
  const webCamRef = useRef<Webcam>(null)
  const showRef = useRef<HTMLCanvasElement>(null)
  // const _laserPoint = useRef([0, 0])
  const [form, setForm] = useState({
    distance: 25,
    size: 50
  })

  useUpdateEffect(() => {
    if ((data || [])[0]) {
      if (!data?.some((_device) => _device.deviceId === device?.deviceId)) {
        setDevice((data || [])[0])
      }
    }
  }, [data])
  useEffect(() => {
    async function getFrameFromWebCam() {
      const imageBase64 = webCamRef.current?.getScreenshot()
      if (imageBase64) {
        const image = new Image()
        image.onload = () => {
          const context = showRef.current?.getContext('2d')
          if (context) {
            context.drawImage(image, 0, 0)
          }
        }
        image.src = imageBase64
      }
    }
    async function getFrameFromMainProcess() {
      const imageBase64 = webCamRef.current?.getScreenshot()
      if (imageBase64) {
        const result = (await window.electron.ipcRenderer.invoke(
          'app.detect',
          imageBase64
        )) as string
        const image = new Image()
        image.onload = () => {
          const context = showRef.current?.getContext('2d')
          if (context) {
            context.drawImage(image, 0, 0)
          }
        }
        image.src = `data:image/jpeg;base64,${result}`
      }
    }
    if (calib) {
      let handle = 0
      let timeout: NodeJS.Timeout | undefined = undefined
      const nextTick = () => {
        handle = requestAnimationFrame(async () => {
          const begin = Date.now()
          await getFrameFromWebCam()
          timeout = setTimeout(() => {
            if (handle >= 0) {
              nextTick()
            }
          }, 1000 / FPS - (Date.now() - begin))
        })
      }
      nextTick()
      return () => {
        cancelAnimationFrame(handle)
        clearTimeout(timeout)
        handle = -1
      }
    } else {
      if (started) {
        let handle = 0
        let timeout: NodeJS.Timeout | undefined = undefined
        const nextTick = () => {
          handle = requestAnimationFrame(async () => {
            const begin = Date.now()
            await getFrameFromMainProcess()
            timeout = setTimeout(() => {
              if (handle >= 0) {
                nextTick()
              }
            }, 1000 / FPS - (Date.now() - begin))
          })
        }
        nextTick()
        return () => {
          cancelAnimationFrame(handle)
          clearTimeout(timeout)
          handle = -1
        }
      }
    }
  }, [started, calib])
  useEffect(() => {
    window.electron.ipcRenderer.on('signal', (_, data) => {
      console.log(data)
    })
    return () => {
      window.electron.ipcRenderer.removeAllListeners('signal')
    }
  }, [])
  return (
    <Paper sx={{ width: '1280px', height: '480px' }} elevation={4}>
      <Stack height={'480px'} width="100%" direction={'row'}>
        <Box
          height={'480px'}
          width="640px"
          bgcolor={colors.slate[900]}
          display="flex"
          justifyContent={'center'}
          alignItems="center"
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Webcam
                mirrored
                screenshotFormat="image/jpeg"
                videoConstraints={{ deviceId: device?.deviceId }}
                height={'480px'}
                width={'640px'}
                ref={webCamRef}
                style={{ position: 'absolute', zIndex: -1 }}
              />
              <canvas ref={showRef} height={'480px'} width={'640px'} style={{ zIndex: 1 }} />
            </>
          )}
        </Box>
        <Stack width={640} paddingLeft="32px" paddingRight="16px" spacing={2}>
          <Stack
            justifyContent={'flex-end'}
            alignItems="center"
            width="100%"
            direction={'row'}
            height="64px"
          >
            {/* <Close /> */}
          </Stack>
          <Stack spacing={3} paddingRight="36px">
            <Autocomplete
              open={open}
              onClose={() => setOpen(false)}
              onBlur={() => setOpen(false)}
              onOpen={() => {
                setOpen(true)
              }}
              options={data || []}
              getOptionLabel={(option) => {
                return option.label
              }}
              isOptionEqualToValue={(opts, vl) => {
                return opts.deviceId === vl.deviceId
              }}
              value={
                device || {
                  deviceId: '',
                  groupId: '',
                  kind: 'videoinput',
                  label: '',
                  toJSON: () => ''
                }
              }
              onChange={(_event, deviceData) => {
                if (deviceData) {
                  setDevice(deviceData)
                }
              }}
              renderInput={(params) => <TextField {...params} label="Chọn thiết bị" />}
              loading={isLoading}
              disableClearable
            />
            <Stack direction={'row'} spacing={3}>
              <TextField
                label="Khoảng cách bắn (m)"
                type={'number'}
                value={form.distance}
                onChange={(ev) => {
                  setForm((form) => ({
                    ...form,
                    distance: Number(ev.target.value)
                  }))
                }}
                select
                fullWidth
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </TextField>
              {/* <TextField
                label="Kích cỡ bia (cm)"
                type={"number"}
                value={form.size}
                onChange={(ev) => {
                  setForm((form) => ({
                    ...form,
                    size: Number(ev.target.value),
                  }));
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Help />
                    </InputAdornment>
                  ),
                }}
              /> */}
            </Stack>
          </Stack>
          <Stack
            height={'100%'}
            width="100%"
            justifyContent={'flex-end'}
            alignItems="end"
            paddingBottom="32px"
            paddingRight="36px"
            direction={'row'}
            spacing={3}
          >
            <Button
              variant="contained"
              sx={{ width: '120px', padding: '8px' }}
              disableRipple
              endIcon={<RocketLaunch />}
              onClick={() => {
                toggleCalib()
              }}
              color={calib ? 'error' : 'warning'}
              disabled={started}
            >
              <Typography variant="subtitle2">{calib ? 'Hoàn tất' : 'Căn chỉnh'}</Typography>
            </Button>
            <Button
              variant="contained"
              sx={{ width: '120px', padding: '8px' }}
              disableRipple
              endIcon={<RocketLaunch />}
              onClick={() => {
                toggleStart()
              }}
              color={started ? 'error' : 'info'}
              disabled={calib}
            >
              <Typography variant="subtitle2">{started ? 'Stop' : 'Start'}</Typography>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}
