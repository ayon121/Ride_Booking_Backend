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

