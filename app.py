import os
import subprocess
import sys

def main():
    print("--- Bootstrapping Node.js Application on Hugging Face Spaces ---")

    # 1. Set HF required port
    os.environ['PORT'] = '7860'
    os.environ['VITE_API_URL'] = '' # Force relative paths for frontend

    # 2. Build the React Client
    print("Installing client dependencies...")
    client_dir = os.path.join(os.getcwd(), 'client')
    subprocess.run(['npm', 'install'], cwd=client_dir, check=True)
    
    print("Building React frontend...")
    subprocess.run(['npm', 'run', 'build'], cwd=client_dir, check=True)

    # 3. Setup the Node Server
    print("Installing server dependencies...")
    server_dir = os.path.join(os.getcwd(), 'server')
    subprocess.run(['npm', 'install'], cwd=server_dir, check=True)
    
    # 4. Start the Server
    print("Starting backend server on port 7860...")
    process = subprocess.Popen(
        ['npx', 'tsx', 'src/index.ts'], 
        cwd=server_dir,
        env=os.environ
    )
    
    # Keep the Python process alive while the Node server runs
    process.wait()

if __name__ == "__main__":
    main()
