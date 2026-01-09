#!/bin/sh
if [ -z "$HUSKY" ]; then
  export HUSKY=1
fi

if [ -f ~/.huskyrc ]; then
  . ~/.huskyrc
fi
