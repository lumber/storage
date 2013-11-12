#! /bin/bash

##
# Vagrant bootstrap file
# 
# This script will boostrap a vagrant environment for the lumber/Storage application
#
# @package lumber/Storage
# @version 0.1.0
# @author Lawrence Goldstien @lgoldstien
##

# Make installations non-interactive
export DEBIAN_FRONTEND=noninteractive

# Update and upgrade the current software
apt-get update
apt-get upgrade -y

# Set up some basic software
apt-get install -y curl wget git

# Install NodeVersionManager globally
git clone https://github.com/creationix/nvm.git /opt/nvm
echo "source /opt/nvm/nvm.sh" >> /etc/skel/.bashrc
echo "source /opt/nvm/nvm.sh" >> /home/vagrant/.bashrc
source /opt/nvm/nvm.sh

# Install the latest node 0.10.*
nvm install v0.10.21

# Link /vagrant contents to home folder
ln -s /vagrant /home/vagrant/project
