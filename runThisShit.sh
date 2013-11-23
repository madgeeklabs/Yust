grep -rl '54.247.168.152' ./client | xargs sed -i 's/54.247.168.152/localhost/g'
grep -rl '54.247.168.152' ./sdk | xargs sed -i 's/54.247.168.152/localhost/g'
cd server
nohup node app.js &
cd ..
cd sdk
cd app
nohup python -m SimpleHTTPServer 8000 &
cd ..
cd ..
cd client
cd app
nohup python -m SimpleHTTPServer 8001 &

