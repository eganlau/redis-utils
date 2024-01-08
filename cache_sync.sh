source .env
cd migrate/
./download.js -h $SOURCE_HOSTNAME -p $SOURCE_PORT -a $SOURCE_PASSWORD -n $SOURCE_DB --pattern '*'
./upload.js -h $DEST_HOSTNAME -p $DEST_PORT -n $DEST_DB

./download.js -h $DEST_HOSTNAME -p $DEST_PORT -n $DEST_DB --pattern '*'
./upload.js -h $SOURCE_HOSTNAME -p $SOURCE_PORT -a $SOURCE_PASSWORD -n $SOURCE_DB

cd ../count/
./count.js -h $DEST_HOSTNAME -p $DEST_PORT -n $DEST_DB
