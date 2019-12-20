[[ $1 = '' ]] && BRANCH="dev" || BRANCH=$1

DEST_FOLDER="/home/ubuntu/online-video-editor"

cd $DEST_FOLDER

git stash
# to stash package-lock.json file changes

git pull
git checkout $BRANCH
git pull origin $BRANCH

# rm -rf node_modules/

npm install

pm2 stop backend
pm2 start backend
pm2 stop frontend
pm2 start frontend
pm2 save
pm2 list