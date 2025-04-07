# Start both frontend and backend servers

# Function to check if a port is in use
function Test-PortInUse {
    param($port)
    $listener = $null
    try {
        $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $port)
        $listener.Start()
        $listener.Stop()
        return $false
    } catch {
        return $true
    } finally {
        if ($listener) { $listener.Stop() }
    }
}

# Check if ports are already in use
if (Test-PortInUse 3000) {
    Write-Host "Port 3000 is already in use. Please stop any running frontend servers."
    exit 1
}

if (Test-PortInUse 8001) {
    Write-Host "Port 8001 is already in use. Please stop any running backend servers."
    exit 1
}

# Start backend server
Write-Host "Starting backend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ./backend; python -m uvicorn main:app --reload --port 8001"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 2

# Start frontend server
Write-Host "Starting frontend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ./advance-ecomerce-store; npm run dev"

Write-Host "
Servers started successfully!
Frontend: http://localhost:3000
Backend: http://localhost:8001

Press Ctrl+C in the respective windows to stop the servers."