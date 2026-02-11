#!/usr/bin/env sh
# Run the API from the api-server directory so imports resolve.
cd "$(dirname "$0")"
uvicorn main:app --reload
