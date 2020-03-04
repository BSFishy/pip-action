#!/bin/sh -l

version=$1
packages=$2

echo "Installing $packages"

if [[ $version == 3* ]];
then
    python2 -m pip $packages
elif [[ $version == 2* ]];
then
    python3 -m pip $packages
else
    echo "Could not understand Python version $version"
    exit 1
fi
