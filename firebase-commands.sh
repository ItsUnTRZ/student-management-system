# Firestore Index Management Commands

# 1. Deploy indexes
firebase deploy --only firestore:indexes

# 2. Check current indexes  
firebase firestore:indexes

# 3. Delete unused indexes
firebase firestore:indexes:delete

# 4. Generate indexes from queries (automatic)
# Run your app and let Firebase suggest indexes

# 5. Manual index creation URLs (from error messages)
# Copy URLs from console when failed-precondition errors occur