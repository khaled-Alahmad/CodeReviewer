# MySQL Database Setup Instructions

Your application has been successfully configured to use MySQL instead of PostgreSQL!

## 1. Environment Variables Setup

Create a `.env` file in the root directory with the following content:

```env
# MySQL Database Configuration
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=tset
DATABASE_USER=admin
DATABASE_PASSWORD=E1ulxkeAB4GyBrc502sl

# Full MySQL connection URL
DATABASE_URL=mysql://admin:E1ulxkeAB4GyBrc502sl@127.0.0.1:3306/tset

# Session secret (IMPORTANT: Change this to a random secret in production)
SESSION_SECRET=change-this-to-a-random-secret-in-production
```

## 2. Database Migration

Since your MySQL server port (3306) is not accessible externally, you'll need to run the SQL migration through phpMyAdmin:

### Using phpMyAdmin (Recommended):

1. Open your phpMyAdmin: https://82.198.225.45:8443/phpmyadmin/
2. Login and select the `tset` database
3. Click on the "SQL" tab at the top
4. Open the file `migrations/0000_luxuriant_radioactive_man.sql` from your project
5. Copy all the SQL content and paste it into the phpMyAdmin SQL editor
6. Click the "Go" button to execute the SQL
7. You should see "21 tables created" message

### Alternative - Direct Push (if port 3306 is opened):

If your server administrator opens port 3306 for external connections:

```bash
npm run db:push
```

This will create all the necessary tables in your MySQL database automatically.

## 3. Create Admin User (Optional)

If you need to create an initial admin user, you can run:

```bash
npm run dev
# Then in another terminal:
node server/seed-admin.ts
```

Or you can create the admin user manually through the application.

## 4. Start the Application

Start the development server:

```bash
npm run dev
```

Or for production:

```bash
npm run build
npm start
```

## Changes Made

The following changes were made to migrate from PostgreSQL to MySQL:

1. ✅ Installed `mysql2` driver package
2. ✅ Installed `express-mysql-session` for session storage
3. ✅ Updated `server/db.ts` to use MySQL connection
4. ✅ Updated `drizzle.config.ts` to use MySQL dialect
5. ✅ Updated `shared/schema.ts` - converted all tables from PostgreSQL to MySQL syntax:
   - Changed `pgTable` to `mysqlTable`
   - Changed `pgEnum` to `mysqlEnum`
   - Changed `integer` to `int`
   - Updated UUID generation from `gen_random_uuid()` to `crypto.randomUUID()`
   - Updated all varchar fields with proper length specifications
6. ✅ Updated `server/auth.ts` to use MySQL session store
7. ✅ Removed PostgreSQL-specific packages

## Troubleshooting

### Connection Issues

If you have trouble connecting to the database, verify:

1. MySQL server is running
2. Database `tset` exists
3. User `admin` has proper permissions
4. Host/Port are correct (127.0.0.1:3306)

You can test the connection using:

```bash
mysql -h 127.0.0.1 -P 3306 -u admin -p
# Enter password: E1ulxkeAB4GyBrc502sl
```

### Migration Errors

If the migration fails:

1. Check that the database exists and is accessible
2. Ensure the user has CREATE TABLE permissions
3. Check the drizzle-kit logs for specific errors

### Session Store Issues

The MySQL session store will automatically create a `sessions` table. If you encounter session-related errors, check that this table was created properly.

## Database Access

Your MySQL database is accessible at:
- **Host**: 127.0.0.1
- **Port**: 3306
- **Database**: tset
- **User**: admin
- **Password**: E1ulxkeAB4GyBrc502sl
- **PHPMyAdmin**: https://82.198.225.45:8443/phpmyadmin/

## Next Steps

1. Create the `.env` file with the configuration above
2. Run `npm run db:push` to create the database tables
3. Start your application with `npm run dev`
4. Access the application and create your first admin user

## Support

If you encounter any issues, check:
- MySQL error logs
- Application logs (console output)
- Network connectivity to MySQL server

