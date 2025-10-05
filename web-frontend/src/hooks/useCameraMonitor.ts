import { useEffect, useRef, useState } from 'react'

export function useCameraMonitor() {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const [enabled, setEnabled] = useState<boolean>(false)

	useEffect(() => {
		return () => {
			if (videoRef.current && videoRef.current.srcObject) {
				;(videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
			}
		}
	}, [])

	const start = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true })
		if (videoRef.current) {
			videoRef.current.srcObject = stream
			await videoRef.current.play()
		}
		setEnabled(true)
	}

	const stop = () => {
		if (videoRef.current && videoRef.current.srcObject) {
			;(videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
			videoRef.current.srcObject = null
		}
		setEnabled(false)
	}

	return { videoRef, enabled, start, stop }
}


