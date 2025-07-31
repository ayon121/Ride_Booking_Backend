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


FRONTEND_URL = http://localhost:5175
</code></pre>
<hr>