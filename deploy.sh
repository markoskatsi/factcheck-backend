#!/bin/bash
git pull origin main
docker build -t factcheck-backend .
docker stop factcheck-container
docker rm factcheck-container
docker run -d --name factcheck-container --restart unless-stopped --env-file .env -p 3000:5000 factcheck-backend
echo "Deployment complete"
