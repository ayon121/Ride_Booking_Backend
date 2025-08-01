<h1>Ride Booking Backend</h1> <br>
<p>A Node.js + Express + TypeScript backend service for ride booking with riders, drivers, and admins. Supports role-based access, JWT authentication, ride requests, ride booking, history tracking, and driver earnings.</p>
<hr>
<br>

<h2>Tech Stack</h2><br>
<ul>
  <li><strong>Node.js</strong>, <strong>Express.js</strong></li>
  <li><strong>TypeScript</strong></li>
  <li><strong>MongoDB</strong> with <strong>Mongoose</strong></li>
  <li><strong>JWT</strong> for auth (access + refresh)</li>
  <li><strong>Bcrypt</strong> for Passowrd Hashing</li>
  <li><strong>Passport.js</strong> (local + Google strategy)</li>
  <li><strong>Role-based access control</strong> (User, Driver, Admin)</li>
</ul>

<h2>Project Structure</h2>
<pre><code>
src/app
|   ├── Config
|   ├── ErrorHelpers
|   ├── GlobalInterfaces
|   ├── Modules/
|   │   ├── auth/
│   │   ├── user/
│   │   ├── driver/
│   │   ├── ride/
|   |──utils/
|   |──Middlewares/
├── app.ts
└── server.ts
</code></pre>
<hr>




<h2> Getting Started</h2>
<h3>1. Clone the Repo</h3>
<pre><code>
git clone https://github.com/ayon121/Ride_Booking_Backend.git
cd ride-booking-api
</code></pre>

<h3>2. Install Dependencies</h3>
<pre><code>npm install</code></pre>

<h3>3. Setup Env Variables </h3>
<pre><code>
PORT=5000
DB_URL= db url
NODE_ENV=development
# jwt
JWT_SECRET = weretrtrytyty12334535frgv
Jwt_ACCESS_EXPIRES = 1d
Jwt_REFRESH_SECRET = jwt
Jwt_REFRESH_EXPRIES = 30d

BCRYPT_SALT = 10 

SUPER_ADMIN_EMAIL = super@gmail.com
SUPER_ADMIN_PASS = ayon1234

EXPRESS_SESSION_SECRET = express-session


GOOGLE_CLIENT_ID = ididididid
GOOGLE_CLIENT_SECRET = secret344365587432
#google CallBack_Url
GOOGLE_CALLBACK_URL = http://localhost:5000/api/v1/auth/google/callback

FRONTEND_URL = http://localhost:5175
</code></pre>

<hr>
<hr>

<h2>Features</h2>
<h3>Authentication & Authorization</h3>
<ul>
  <li>JWT-based access & refresh token system</li>
  <li>Secure cookie storage for tokens</li>
  <li>Passport.js with local and Google OAuth strategies</li>
  <li>Role-based access control (User, Driver, Admin)</li>
  <li>Protected routes with middleware</li>
  <li>Password reset via email</li>
</ul>

<h3>User Features</h3>
<ul>
  <li>User Registration and Login (local or Google)</li>
  <li>Request a ride by providing pickup/drop locations and price</li>
  <li>Cannot request multiple active rides</li>
  <li>Ride history with details</li>
  <li>Profile access with personal data (excluding password)</li>
  <li>Reset Password and Update Profile (excluding Role)</li>
</ul>

<h3> Driver Features</h3>
<ul>
  <li>Driver Registration and Login</li>
  <li>Accept or reject ride requests</li>
  <li>Can only accept one ride at a time</li>
  <li>Update ride status: REQUESTED → ACCEPTED → PICKED_UP → COMPLETED</li>
  <li>Start time saved on PICKED_UP</li>
  <li>Earnings added on COMPLETED</li>
  <li>Driver ride history available</li>
  <li>Driver profile with total earnings</li>
  <li>Driver reviews</li>
</ul>

<h3>Ride Management</h3>
<ul>
  <li>Ride request creation by riders</li>
  <li>Ride assignment and acceptance flow</li>
  <li>Live ride status updates</li>
  <li>Only one ride can be active per rider and driver</li>
  <li>Driver earnings increase after ride is completed</li>
</ul>


<h3>Admin Features</h3>
<ul>
  <li>View all users and drivers</li>
  <li>Fetch single user or driver by ID</li>
  <li>Update or delete any user or driver</li>
  <li>Block or Suspende any user or driver</li>
  <li>View all rides</li>
  <li>Manually update ride status or assign driver</li>
  <li>Admin analytics: total users, drivers, total rides, total earnings, completed rides</li>
</ul>

<h3> System Rules & Logic</h3>
<ul>
  <li>Rider can only have one active ride</li>
  <li>Driver can only have one active ride</li>
  <li>Ride status must follow logical progression</li>
  <li>Driver earnings calculated based on ride price</li>
  <li>Start time of ride is recorded only on PICKED_UP</li>
  <li>Driver review schema stored inside driver model</li>
</ul>

<h3> Ride Flow</h3>
<ul>
  <li>User requests a ride</li>
  <li>Driver accepts if not suspended</li>
  <li>Ride status updates (REQUESTED → ACCEPTED → PICKED_UP → COMPLETED)</li>
  <li>Upon PICKED_UP, startedAt is recorded</li>
  <li>Start time of ride is recorded only on PICKED_UP</li>
  <li>Upon COMPLETED, driver earnings are increased</li>
</ul>


<hr>
<hr>

<h2>API Endpoints</h2>

<h2>Only User APIs (Rider)</h2>

<h3>1. Rider Register API</h3>
<p><strong>Endpoint:</strong> <code>POST http://localhost:5000/api/v1/user/register</code></p>
<p><strong>Description:</strong> Registers a new rider.</p>
<p><strong>Request Body:</strong></p>
<pre>
{
  "name": "ayon rider",
  "email": "ayon1@gmail.com",
  "password": "A@12345678"
}
</pre>

<hr>

<h3>2. Rider Update Profile API</h3>
<p><strong>Endpoint:</strong> <code>PATCH http://localhost:5000/api/v1/user/update</code></p>
<p><strong>Description:</strong> Updates rider's profile (name, etc.).</p>
<p><strong>Request Body:</strong></p>
<pre>
{
  "name": "ayon rider 12"
}
</pre>

<hr>

<h3>3. Rider Login API</h3>
<p><strong>Endpoint:</strong> <code>POST http://localhost:5000/api/v1/auth/user/login</code></p>
<p><strong>Description:</strong> Logs in a rider and sets authentication cookies.</p>
<p><strong>Request Body:</strong></p>
<pre>
{
  "email": "ayon1@gmail.com",
  "password": "A@12345678"
}
</pre>

<hr>

<h3>4. Rider Reset Password API</h3>
<p><strong>Endpoint:</strong> <code>PATCH http://localhost:5000/api/v1/auth/user/reset-password</code></p>
<p><strong>Description:</strong> Allows a rider to reset their password.</p>
<p><strong>Request Body:</strong></p>
<pre>
{
  "newPassword": "A@1234567",
  "oldPassword": "A@12345678"
}
</pre>

<hr>

<h3>5. Request Ride API</h3>
<p><strong>Endpoint:</strong> <code>POST http://localhost:5000/api/v1/rides/request</code></p>
<p><strong>Description:</strong> Allows a rider to request a new ride.</p>
<p><strong>Request Body:</strong></p>
<pre>
{
  "pickupLocation": "12345 Chittagong",
  "dropLocation": "1234 Dhaka",
  "price": 3000
}
</pre>
<p><strong>Auth Required:</strong>  Yes</p>


<hr>
<hr>
<hr>

<h2>Only Driver APIs</h2>

<h3>1. Driver Register API</h3>
<p><strong>POST</strong> <code>http://localhost:5000/api/v1/driver/register</code></p>
<pre>
Body:
{
  "name": "John Driver",
  "email": "johndriver@gmail.com",
  "password": "A@1234567",
  "licenseNumber": "DL-123456",
  "vehicleType": "Car",
  "vehicleModel": "Toyota Prius",
  "vehiclePlate": "DHA-1234",
  "driverlocation": "Dhaka"
}
</pre>

<h3>2. Driver Login API</h3>
<p><strong>POST</strong> <code>http://localhost:5000/api/v1/auth/driver/login</code></p>
<pre>
Body:
{
  "email": "johndriver@gmail.com",
  "password": "A@1234567"
}
</pre>

<h3>3. Driver Update Profile API</h3>
<p><strong>PATCH</strong> <code>http://localhost:5000/api/v1/driver/updateprofile</code></p>
<pre>
Body:
{
  "name": "John Driver 12",
  "driverlocation": "12 Dhaka"
}
</pre>

<h3>4. Driver Reset Password API</h3>
<p><strong>PATCH</strong> <code>http://localhost:5000/api/v1/auth/driver/reset-password</code></p>
<pre>
Body:
{
  "newPassword": "A@1234567",
  "oldPassword": "A@12345678"
}
</pre>

<h3>5. See All Requested Rides (Driver)</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/rides/request</code></p>
<pre>
No body required.
</pre>

<h3>6. Driver Update Online Status</h3>
<p><strong>PATCH</strong> <code>http://localhost:5000/api/v1/driver/updateprofile</code></p>
<pre>
Body:
{
  "isOnline": false
}
</pre>

<hr>
<hr>
<hr>


<h2>Shared APIs (Rider, Driver, Admin)</h2>

<h3>1. Get Profile</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/auth/me</code></p>
<p>Fetches the profile of the currently logged-in user (rider, driver, or admin). Password is excluded.</p>
<p><strong>Auth Required:</strong>  Yes</p>

<hr>

<h3>2. Logout</h3>
<p><strong>POST</strong> <code>http://localhost:5000/api/v1/auth/logout</code></p>
<p>Logs out the current user by clearing authentication cookies.</p>
<p><strong>Auth Required:</strong>  Yes</p>

<hr>

<h3>3. Refresh Token</h3>
<p><strong>POST</strong> <code>http://localhost:5000/api/v1/auth/refresh-token</code></p>
<p>Generates a new access token using a valid refresh token stored in cookies.</p>
<p><strong>Auth Required:</strong> Yes (refresh token in cookies)</p>

<hr>

<h3>4. Ride Status Change</h3>
<p><strong>PATCH</strong> <code>http://localhost:5000/api/v1/rides/status/:rideId</code></p>
<p>Updates the ride status.</p>
<ul>
  <li>Rider can set status: <code>REQUESTED</code>, <code>CANCELLED</code></li>
  <li>Driver can set status: <code>ACCEPTED</code>, <code>PICKEDUP</code>, <code>INTRANSIT</code>, <code>COMPLETED</code></li>
</ul>
<p><strong>Request Body:</strong></p>
<pre>
{
  "status": "COMPLETED"
}
</pre>
<p><strong>Auth Required:</strong>  Yes</p>
<p><em>Replace <code>:rideId</code> with actual ride ID.</em></p>

<hr>

<h3>5. Ride History</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/rides/history</code></p>
<p>Retrieves ride history for the logged-in rider or driver.</p>
<p><strong>Auth Required:</strong>  Yes</p>

<hr>

<h3>6. Get Current Ride</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/rides/me</code></p>
<p>Retrieves current active ride details for the logged-in rider or driver.</p>
<p><strong>Auth Required:</strong>  Yes</p>


<hr>
<hr>
<hr>

<h2>Admin or Super_Admin APIs</h2>

<h3>1. Admin Login</h3>
<p><strong>POST</strong> <code>http://localhost:5000/api/v1/auth/user/login</code></p>
<p>Authenticates an admin user and returns tokens.</p>
<pre>
{
  "email": "super@gmail.com",
  "password": "ayon1234"
}
</pre>

<hr>

<h3>2. Admin Dashboard Analytics</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/user/dashboard/admin</code></p>
<p>Retrieves analytics data for the admin dashboard.</p>
<pre>
{
  "statusCode": 200,
  "success": true,
  "message": "Admin Analytics fetched successfully",
  "data": {
    "totalUsers": 2,
    "totalDrivers": 1,
    "totalRides": 1,
    "totalEarnings": 0,
    "activeRides": 1
  }
}
</pre>

<hr>

<h3>3. Get All Drivers</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/driver/alldrivers</code></p>
<p>Retrieves a list of all drivers in the system.</p>

<hr>

<h3>4. Get All Riders</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/user/all-users</code></p>
<p>Retrieves a list of all riders/users in the system.</p>

<hr>

<h3>5. Get All Rides</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/rides/all</code></p>
<p>Retrieves all rides in the system.</p>

<hr>

<h3>6. Update Driver Profile</h3>
<p><strong>PATCH</strong> <code>http://localhost:5000/api/v1/driver/updatedriver</code></p>
<p>Allows admin to update any driver’s profile information including name, email, password, and role.</p>
<pre>
{
  "name": "ayon rider",
  "email": "ayon12@gmail.com",
  "role": "ADMIN"
}
</pre>

<hr>

<h3>7. Update Rider Profile</h3>
<p><strong>PATCH</strong> <code>http://localhost:5000/api/v1/user/update-users</code></p>
<p>Allows admin to update any rider’s profile including name, email, and role.</p>
<pre>
{
  "name": "ayon rider",
  "email": "ayon12@gmail.com",
  "role": "ADMIN"
}
</pre>

<hr>

<h3>8. Update Ride</h3>
<p><strong>PATCH</strong> <code>http://localhost:5000/api/v1/rides/updateride/:rideId</code></p>
<p>Allows admin to update any ride details such as <code>ridestatus</code> and <code>price</code>.</p>
<pre>
{
  "ridestatus": "COMPLETED",
  "price": 550
}
</pre>
<p><em>Replace <code>:rideId</code> with the actual ride ID.</em></p>

<hr>

<h3>9. Get Single Ride</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/rides/singleride/:rideId</code></p>
<p>Retrieves details of a specific ride by ID.</p>
<p><em>Replace <code>:rideId</code> with the actual ride ID.</em></p>

<hr>

<h3>10. Get Single User</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/user/:userId</code></p>
<p>Retrieves details of a specific user (rider) by ID.</p>
<p><em>Replace <code>:userId</code> with the actual user ID.</em></p>

<hr>

<h3>11. Get Single Driver</h3>
<p><strong>GET</strong> <code>http://localhost:5000/api/v1/driver/:driverId</code></p>
<p>Retrieves details of a specific driver by ID.</p>
<p><em>Replace <code>:driverId</code> with the actual driver ID.</em></p>
