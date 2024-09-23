# Your bash variables here
$AERO_PATH="public/aero" # The directory where aero's files should be

./node_modules/aero-proxy/examples/install-aero.sh

curl https://raw.githubusercontent.com/vortexdeveloperlabs/sdk/refs/heads/main/aeroHandleSimple.js -o public/aeroHandleSimple.js
cp ./node_modules/aero-proxy/examples/swWithSwitcher.js public/sw.js
