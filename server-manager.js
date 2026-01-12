import { spawn, exec } from 'child_process';
import readline from 'readline';
import http from 'http';

let frontendProcess = null;
let backendProcess = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log('\n=== Golden Stitch Server Manager ===');
  console.log(`Frontend: ${frontendProcess ? 'RUNNING (port 8080)' : 'STOPPED'}`);
  console.log(`Backend:  ${backendProcess ? 'RUNNING (port 3002)' : 'STOPPED'}`);
  console.log('\nOptions:');
  console.log('1. Start Frontend');
  console.log('2. Stop Frontend');
  console.log('3. Start Backend');
  console.log('4. Stop Backend');
  console.log('5. Start Both');
  console.log('6. Stop Both');
  console.log('7. Open Browser');
  console.log('8. Exit');
  console.log('=====================================');

  rl.question('Choose an option (1-8): ', (answer) => {
    handleChoice(answer.trim());
  });
}

async function handleChoice(choice) {
  switch (choice) {
    case '1':
      startFrontend();
      break;
    case '2':
      await stopFrontend();
      break;
    case '3':
      startBackend();
      break;
    case '4':
      await stopBackend();
      break;
    case '5':
      startBoth();
      break;
    case '6':
      await stopBoth();
      break;
    case '7':
      openBrowser();
      break;
    case '8':
      exitManager();
      return;
    default:
      console.log('Invalid option. Please try again.');
  }

  // Show menu again after a short delay
  setTimeout(showMenu, 1000);
}

function startFrontend() {
  if (frontendProcess) {
    console.log('Frontend is already running.');
    return;
  }

  console.log('Starting frontend...');
  frontendProcess = exec('npx vite --port 8080', {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024
  });

  frontendProcess.stdout?.on('data', (data) => {
    console.log('[Frontend]', data.toString().trim());
  });

  frontendProcess.stderr?.on('data', (data) => {
    console.error('[Frontend]', data.toString().trim());
  });

  frontendProcess.on('close', (code) => {
    console.log(`Frontend stopped with code ${code}`);
    frontendProcess = null;
  });
}

function stopFrontend() {
  return new Promise((resolve) => {
    if (frontendProcess) {
      console.log('Stopping frontend...');
      frontendProcess.kill();
      frontendProcess.on('close', () => {
        resolve();
      });
    } else {
      console.log('Frontend is not running.');
      resolve();
    }
  });
}

function startBackend() {
  if (backendProcess) {
    console.log('Backend is already running.');
    return;
  }

  console.log('Starting backend...');
  backendProcess = exec('npx tsx server/node-build.ts', {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024
  });

  backendProcess.stdout?.on('data', (data) => {
    console.log('[Backend]', data.toString().trim());
  });

  backendProcess.stderr?.on('data', (data) => {
    console.error('[Backend]', data.toString().trim());
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend stopped with code ${code}`);
    backendProcess = null;
  });
}

function stopBackend() {
  return new Promise((resolve) => {
    if (backendProcess) {
      console.log('Stopping backend...');
      // Try to call shutdown endpoint first
      const req = http.request({
        hostname: 'localhost',
        port: 3002,
        path: '/api/shutdown',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          // Wait a bit for shutdown
          setTimeout(() => {
            if (backendProcess) {
              backendProcess.kill('SIGKILL'); // Force kill if still running
            }
          }, 2000);
        });
      });

      req.on('error', () => {
        // If endpoint fails, force kill
        backendProcess.kill('SIGKILL');
      });

      req.write(JSON.stringify({}));
      req.end();

      // Listen for close
      backendProcess.on('close', () => {
        resolve();
      });
    } else {
      console.log('Backend is not running.');
      resolve();
    }
  });
}

function startBoth() {
  startFrontend();
  setTimeout(startBackend, 2000); // Start backend after frontend
}

async function stopBoth() {
  await stopFrontend();
  await stopBackend();
}

function openBrowser() {
  console.log('Opening browser...');
  exec('start https://the-golden-stitch.netlify.app/login', (error) => {
    if (error) {
      console.log('Failed to open browser. Please manually navigate to https://the-golden-stitch.netlify.app/login');
    }
  });
}

async function exitManager() {
  console.log('Stopping all servers...');
  await stopBoth();
  setTimeout(() => {
    console.log('Goodbye!');
    process.exit(0);
  }, 1000);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Shutting down...');
  exitManager();
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM. Shutting down...');
  exitManager();
});

// Start the manager
console.log('Welcome to Golden Stitch Server Manager!');
showMenu();