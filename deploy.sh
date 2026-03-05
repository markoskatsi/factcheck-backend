#!/bin/bash
docker stop factcheck-container
docker rm factcheck-container
git pull origin main
docker build -t factcheck-backend .
docker run -d --name factcheck-container --restart unless-stopped --env-file .env -p 3000:5000 factcheck-backend
echo "Deployment complete"
