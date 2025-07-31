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




