#!/bin/bash

# bootstrap.sh
# script to install/configure software on ubuntu LTS virtual machine
# TODO_PRODUCTION_SERVER

# Check if PUBLIC_KEY is set
if [ -z "$PUBLIC_KEY" ]; then
  echo "Error: PUBLIC_KEY environment variable is not set."
  exit 1
fi

# Update and install necessary packages
apt update && apt upgrade -y
apt install -y software-properties-common

# Install Docker
apt install -y docker.io
systemctl enable docker
systemctl start docker

# Install Docker Compose
DOCKER_COMPOSE_VERSION="v2.16.0"  # Change to the desired version
curl -SL "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configure UFW
ufw allow OpenSSH
ufw enable

# Install Certbot and Nginx
apt install -y certbot

# Obtain the SSL certificate using standalone mode
certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos --email "$EMAIL"


# Disable password authentication
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# Add SSH public key
mkdir -p ~/.ssh
echo "$PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Restart UFW to apply changes
systemctl restart ufw

echo "Bootstrap script completed successfully."