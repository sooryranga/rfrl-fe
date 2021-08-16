#@IgnoreInspection BashAddShebang
export ROOT=$(realpath $(dir $(lastword $(MAKEFILE_LIST))))
export DEBUG=true
export APP=api-rfrl
export LDFLAGS="-w -s"

start: 
	npm run serve