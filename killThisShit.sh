killall node
killall python
grep -rl 'localhost:3000' ./client | xargs sed -i 's/localhost:3000/54.247.168.152:3000/g'
grep -rl 'localhost:3000' ./sdk | xargs sed -i 's/localhost:3000/54.247.168.152:3000/g'
