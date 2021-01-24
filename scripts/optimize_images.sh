#!/bin/zsh

if [ $# = 0 ]; then
  echo "no args"
  exit 1
else
  /Applications/ImageOptim.app/Contents/MacOS/ImageOptim $1/*.(jpg|png)
fi
