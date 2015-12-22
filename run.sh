. /home/node/.nvm/nvm.sh
nvm use v0.10.41
export NODE_TLS_REJECT_UNAUTHORIZED="0"
nohup node cluster.js >> connector.log 2>&1 &
