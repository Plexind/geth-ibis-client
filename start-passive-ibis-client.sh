#!/bin/bash

log_dir=ibis_logs
log_dir_old=$log_dir/old
log_file=$log_dir/ibis_log.ndjson
tmp_log_file=$log_dir/ibis_log.ndjson.temp
log_split_interval=300

# create directory for log files
mkdir -p $log_dir

# start Geth client
echo "Starting Geth client"
./build/bin/geth \
--log.json \
--log.debug \
--verbosity 5 \
2>> $log_file &

# start log splitter
echo "Starting log splitter"
echo "(Ctrl+C to terminate)"
while true
do
  sleep $log_split_interval
  echo "splitting log"

  # create directory for old logs
  mkdir -p $log_dir_old

  # create copy
  cp $log_file $tmp_log_file

  # clear current log (note: slight risk here to lose information due to race condition)
  >$log_file

  # move to 'old' directory
  mv $tmp_log_file $log_dir_old/ibis_log_$(date +%d%m%Y_%H%M%S).ndjson
done

# cleanup
pkill geth
