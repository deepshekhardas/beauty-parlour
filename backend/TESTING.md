# Testing Guide

## Prerequisites for Running Tests

### MongoDB Requirement
Tests require a running MongoDB instance. You have two options:

#### Option 1: Local MongoDB (Recommended for Development)
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl start mongod
   ```
3. Run tests:
   ```bash
   npm test
   ```

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Update `.env.test` with your Atlas connection string
3. Run tests:
   ```bash
   npm test
   ```

## Test Configuration

- **Test Database**: `beautyparlour-test` (automatically created/dropped)
- **Test Environment**: Uses `.env.test` file
- **Timeout**: 30 seconds for DB operations
- **Execution**: Sequential (`--runInBand`) to avoid race conditions

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Run with verbose output
npm test -- --verbose
```

## Current Test Status

✅ **Frontend Lint**: All errors fixed  
⚠️ **Backend Tests**: Requires MongoDB connection

### Test Files
- `tests/health.test.js` - API health check (no DB required) ✅
- `tests/auth.test.js` - User authentication flows
- `tests/appointment.test.js` - Appointment booking flows

## Troubleshooting

### "Connection operation buffering timed out"
- **Cause**: MongoDB is not running
- **Solution**: Start MongoDB service or use MongoDB Atlas

### "Worker process has failed to exit gracefully"
- **Solution**: Already fixed with `--runInBand` flag and proper cleanup

### Need Help?
Check MongoDB installation: `mongod --version`
