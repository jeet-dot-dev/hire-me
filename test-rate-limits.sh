#!/bin/bash

# Rate Limiting Test Script
# This script tests the rate limiting implementation for both Next.js and Hono backends

echo "🔒 Testing Rate Limiting Implementation"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NEXTJS_URL="http://localhost:3000"
HONO_URL="http://localhost:8787"  # Adjust based on your Hono setup

echo -e "${YELLOW}Testing Next.js Rate Limiting...${NC}"
echo "Testing strict endpoint (auth/register):"

# Test strict rate limiting (5 requests/minute)
for i in {1..7}; do
  echo -n "Request $i: "
  response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"name":"test","email":"test@example.com","password":"password","role":"CANDIDATE"}' \
    "$NEXTJS_URL/api/auth/register")
  
  status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
  
  if [ "$status" = "429" ]; then
    echo -e "${RED}Rate Limited (429)${NC}"
  elif [ "$status" = "400" ]; then
    echo -e "${GREEN}Success (400 - expected validation error)${NC}"
  else
    echo -e "${YELLOW}Status: $status${NC}"
  fi
  
  sleep 1
done

echo ""
echo "Testing light endpoint (jobs/search):"

# Test light rate limiting (100 requests/minute)
for i in {1..5}; do
  echo -n "Request $i: "
  response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
    "$NEXTJS_URL/api/jobs/search?query=developer&filterBy=title")
  
  status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
  
  if [ "$status" = "429" ]; then
    echo -e "${RED}Rate Limited (429)${NC}"
  elif [ "$status" = "200" ] || [ "$status" = "400" ]; then
    echo -e "${GREEN}Success ($status)${NC}"
  else
    echo -e "${YELLOW}Status: $status${NC}"
  fi
  
  sleep 0.5
done

echo ""
echo -e "${YELLOW}Testing Hono Rate Limiting...${NC}"
echo "Testing AI endpoint (getTags):"

# Test Hono strict rate limiting (10 requests/minute)
for i in {1..12}; do
  echo -n "Request $i: "
  response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"description":"Software engineer job description"}' \
    "$HONO_URL/api/v1/getTags")
  
  status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
  
  if [ "$status" = "429" ]; then
    echo -e "${RED}Rate Limited (429)${NC}"
  elif [ "$status" = "200" ] || [ "$status" = "400" ]; then
    echo -e "${GREEN}Success ($status)${NC}"
  else
    echo -e "${YELLOW}Status: $status${NC}"
  fi
  
  sleep 1
done

echo ""
echo "🏁 Rate limiting test completed!"
echo ""
echo "Expected results:"
echo "- Next.js strict endpoints should be rate limited after 5 requests"
echo "- Next.js light endpoints should allow more requests"
echo "- Hono AI endpoints should be rate limited after 10 requests"
echo ""
echo "Check the server logs for rate limiting messages."
