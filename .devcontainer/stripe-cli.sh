#!/bin/bash
set -e

sudo curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | sudo gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list
sudo apt update
sudo apt install -y stripe