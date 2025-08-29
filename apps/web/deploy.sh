#!/bin/bash

# Deploy script for Neeiz Web to CapRover
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment to CapRover..."

# Check if CAPROVER_NEEIZ_WEB_TOKEN is set
if [ -z "$CAPROVER_NEEIZ_WEB_TOKEN" ]; then
    echo "❌ Error: CAPROVER_NEEIZ_WEB_TOKEN environment variable is not set"
    echo "Please set it with: export CAPROVER_NEEIZ_WEB_TOKEN=your_token_here"
    exit 1
fi

# Check if caprover is installed
if ! command -v caprover &> /dev/null; then
    echo "📦 Installing caprover CLI..."
    npm install -g caprover
fi

# Login to CapRover
echo "🔐 Logging in to CapRover..."
caprover login --caproverUrl https://neeiz.lslly.com --caproverPassword "$CAPROVER_NEEIZ_WEB_TOKEN"

# Deploy the application
echo "📤 Deploying neeiz-web..."
caprover deploy --appName neeiz-web --imageName neeiz-web:latest

echo "✅ Deployment completed successfully!"
echo "🌐 Your app should be available at: https://neeiz-web.lslly.com" 