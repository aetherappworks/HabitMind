#!/bin/bash

BASE_URL="http://localhost:3000"
EMAIL="test_suggestion_$(date +%s)@example.com"
PASSWORD="TestPassword123!"
LANG="pt-br"

echo "========================================="
echo "Testing /ai/suggest endpoint"
echo "========================================="
echo ""

# Step 1: Register a new user
echo "Step 1: Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"name\": \"Test User\"
  }")

echo "Register Response: $REGISTER_RESPONSE"
echo ""

# Extract token from register response
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to get token from registration"
  exit 1
fi

echo "Token: $TOKEN"
echo "User ID: $USER_ID"
echo ""

# Step 2: Test /ai/suggest WITHOUT habits
echo "Step 2: Testing /ai/suggest WITHOUT habits..."
SUGGEST_RESPONSE=$(curl -s -X GET "$BASE_URL/ai/suggest?lang=$LANG" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: $LANG")

echo "Suggest Response (no habits): $SUGGEST_RESPONSE"
echo ""

# Step 3: Create a habit
echo "Step 3: Creating a habit..."
CREATE_HABIT_RESPONSE=$(curl -s -X POST "$BASE_URL/habits" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: $LANG" \
  -d "{
    \"title\": \"Exercise\",
    \"description\": \"Daily exercise routine\",
    \"frequency\": \"daily\",
    \"category\": \"exercise\"
  }")

echo "Create Habit Response: $CREATE_HABIT_RESPONSE"
HABIT_ID=$(echo "$CREATE_HABIT_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Habit ID: $HABIT_ID"
echo ""

# Step 4: Test /ai/suggest WITH habit
echo "Step 4: Testing /ai/suggest WITH habit..."
SUGGEST_RESPONSE=$(curl -s -X GET "$BASE_URL/ai/suggest?lang=$LANG" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: $LANG")

echo "Suggest Response (with habit): $SUGGEST_RESPONSE"
echo ""

echo "========================================="
echo "Test completed!"
echo "========================================="
