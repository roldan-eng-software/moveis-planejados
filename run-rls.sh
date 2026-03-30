#!/bin/bash
set -a
source .env
set +a
node scripts/apply-rls.mjs
