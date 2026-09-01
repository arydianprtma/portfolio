Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "H:\portfolio"

' 1. Start Next.js server silently in background
WshShell.Run "cmd /c npm run start", 0, False

' 2. Start Cloudflare Tunnel silently in background
WshShell.Run "cmd /c C:\cloudflared\cloudflared.exe --protocol http2 tunnel run --token eyJhIjoiNzA5ZDMyMDQ0MzRlZmMxMmI5YzI1NWZhMGZhMjc1ZmUiLCJ0IjoiYWFkY2QzMTYtMTg3Zi00ZWE0LTkzNzAtMDYyOTI5NDcxNzRiIiwicyI6Ik1UWTJOemt3TkRNdE1UZzJPQzAwWWpVMExUazJNV0l0T1RSbU5HTXpaRGRsWm1ReiJ9", 0, False

Set WshShell = Nothing
