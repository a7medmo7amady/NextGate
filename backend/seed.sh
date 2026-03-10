#!/usr/bin/env bash
# =============================================================================
# NextGate – seed script
# Creates a normal user, an admin user, promotes the admin in MongoDB,
# then uses the admin token to create sample flights.
#
# Prerequisites:
#   • Backend running on http://localhost:5000
#   • mongosh available in PATH
#   • jq available in PATH  (brew install jq / apt install jq)
# =============================================================================

set -euo pipefail

BASE="http://localhost:5000/api"
DB_NAME="nextgate"          # change if your DB name differs

# ── colours ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
section() { echo -e "\n${YELLOW}━━━  $*  ━━━${NC}"; }

# =============================================================================
# 1. Register – normal user
# =============================================================================
section "1 · Register normal user"

curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123"}' \
  | jq .

info "Normal user registered (jane@example.com)"

# =============================================================================
# 2. Register – admin user (role will be promoted below)
# =============================================================================
section "2 · Register admin user"

curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"adminpass123"}' \
  | jq .

info "Admin user registered (admin@example.com)"

# =============================================================================
# 3. Promote admin user in MongoDB
# =============================================================================
section "3 · Promote admin@example.com to role=admin via mongosh"

mongosh "$DB_NAME" --quiet --eval \
  'db.users.updateOne({email:"admin@example.com"},{$set:{role:"admin"}})' \
  | jq -R .

info "Role promoted to admin"

# =============================================================================
# 4. Login as admin – capture JWT
# =============================================================================
section "4 · Login as admin & capture token"

ADMIN_TOKEN=$(
  curl -s -X POST "$BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"adminpass123"}' \
  | jq -r '.token'
)

if [[ -z "$ADMIN_TOKEN" || "$ADMIN_TOKEN" == "null" ]]; then
  echo -e "${RED}[ERROR]${NC} Failed to obtain admin token. Aborting."
  exit 1
fi

info "Admin token obtained: ${ADMIN_TOKEN:0:40}..."

# =============================================================================
# 5. Login as normal user (demo – no further privileged calls)
# =============================================================================
section "5 · Login as normal user (demo)"

curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"password123"}' \
  | jq '{token:.token, user:.user}'

# =============================================================================
# 6. Create flights (admin only)
# =============================================================================
section "6 · Create flights using admin token"

FLIGHTS=(
  '{"flightNumber":"NG101","from":"New York","to":"London","date":"2026-06-15T08:00:00Z","price":450,"AvailableSeats":120,"seats":180}'
  '{"flightNumber":"NG202","from":"London","to":"Dubai","date":"2026-06-16T14:30:00Z","price":320,"AvailableSeats":60,"seats":200}'
  '{"flightNumber":"NG303","from":"Dubai","to":"Singapore","date":"2026-06-17T22:00:00Z","price":280,"AvailableSeats":5,"seats":150}'
  '{"flightNumber":"NG404","from":"Singapore","to":"Tokyo","date":"2026-06-18T06:45:00Z","price":195,"AvailableSeats":0,"seats":120}'
  '{"flightNumber":"NG505","from":"Tokyo","to":"New York","date":"2026-06-20T11:00:00Z","price":620,"AvailableSeats":88,"seats":250}'
)

for flight in "${FLIGHTS[@]}"; do
  FLIGHT_NUM=$(echo "$flight" | jq -r '.flightNumber')
  info "Creating flight $FLIGHT_NUM..."
  curl -s -X POST "$BASE/flights" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d "$flight" \
    | jq '{flightNumber:.flightNumber, from:.from, to:.to, date:.date, price:.price, seats:.seats, available:.AvailableSeats}'
done

section "Done – seed complete"
