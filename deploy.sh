#!/bin/bash
docker stop factcheck-container
docker rm factcheck-container
git fetch origin main
git reset --hard origin/main
docker build --no-cache -t factcheck-backend .
docker run -d --name factcheck-container --restart unless-stopped --env-file .env -p 3000:5000 factcheck-backend
echo "Deployment complete"
