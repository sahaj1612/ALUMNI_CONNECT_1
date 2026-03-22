<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SDMCET AlumniConnect | Dharwad</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Poppins',sans-serif;
}

body{
    background: linear-gradient(135deg,#eef2ff,#f8fafc);
    min-height:100vh;
}

/* NAVBAR */

.navbar{
    background: rgba(31,42,68,0.85);
    backdrop-filter: blur(10px);
    color:white;
    padding:12px 40px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    position:sticky;
    top:0;
    z-index:1000;
}

.nav-left{
    display:flex;
    align-items:center;
    gap:15px;
}

.nav-left img{
    height:55px;
    background:white;
    padding:6px;
    border-radius:8px;
}

.navbar ul{
    list-style:none;
    display:flex;
    gap:25px;
}

.navbar ul li{
    cursor:pointer;
    position:relative;
}

.navbar ul li::after{
    content:"";
    width:0%;
    height:2px;
    background:#ff9f1a;
    position:absolute;
    left:0;
    bottom:-5px;
    transition:0.3s;
}

.navbar ul li:hover::after{
    width:100%;
}

.login-btn{
    background:#ff9f1a;
    padding:7px 14px;
    border-radius:6px;
    color:black;
    font-weight:600;
}

/* HERO */

.hero{
    height:100vh;
    position:relative;
    overflow:hidden;
}

.hero::after{
    content:"";
    position:absolute;
    inset:0;
    background:rgba(0,0,0,0.6);
    z-index:1;
}

.slide{
    position:absolute;
    inset:0;
    background-size:cover;
    background-position:center;
    opacity:0;
    animation:slideShow 18s infinite;
}

.slide1{background-image:url("https://images.unsplash.com/photo-1607746882042-944635dfe10e");}
.slide2{background-image:url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655");animation-delay:6s;}
.slide3{background-image:url("https://images.unsplash.com/photo-1556761175-129418cb2dfe");animation-delay:12s;}

@keyframes slideShow{
    0%{opacity:0;}
    10%{opacity:1;}
    30%{opacity:1;}
    40%{opacity:0;}
    100%{opacity:0;}
}

.hero-content{
    position:relative;
    z-index:2;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    color:white;
    text-align:center;
    padding:20px;
}

.hero-content h1{
    font-size:48px;
    background: linear-gradient(90deg,#ffffff,#ffcc70);
    
    /* Standard property */
    background-clip: text;

    /* Chrome / Safari support */
    -webkit-background-clip: text;

    /* Makes text transparent to show gradient */
    color: transparent;
}

.hero-content h3{
    margin:10px 0 15px;
    color:#ffdf9e;
}

.hero-content p{
    max-width:760px;
    line-height:1.6;
}

.hero-login-btn{
    margin-top:25px;
    padding:14px 42px;
    font-size:20px;
    font-weight:600;
    border:none;
    border-radius:40px;
    cursor:pointer;
    background:white;
    color:#1f2a44;
    box-shadow:0 10px 25px rgba(0,0,0,0.35);
    transition:0.3s;
}

.hero-login-btn:hover{
    transform:translateY(-3px) scale(1.05);
    background:#ff9f1a;
    color:white;
}

/* MODAL */

.modal{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.45);
    backdrop-filter:blur(8px);
    display:none;
    align-items:center;
    justify-content:center;
    z-index:2000;
}

.modal-box{
    width:360px;
    background:rgba(255,255,255,0.9);
    backdrop-filter:blur(20px);
    border-radius:18px;
    padding:30px;
    position:relative;
    animation:popup .35s ease;
}

@keyframes popup{
    from{transform:scale(.8);opacity:0;}
    to{transform:scale(1);opacity:1;}
}

.close{
    position:absolute;
    top:10px;
    right:15px;
    font-size:24px;
    cursor:pointer;
}

.select-btn{
    width:100%;
    padding:14px;
    margin-top:15px;
    border:none;
    border-radius:12px;
    font-weight:600;
    cursor:pointer;
    background:linear-gradient(135deg,#4f46e5,#6366f1);
    color:white;
}

.select-btn:hover{
    transform:translateY(-2px);
    box-shadow:0 10px 20px rgba(79,70,229,.35);
}

.login-form{
    display:none;
}

.login-form input{
    width:100%;
    padding:12px;
    margin:10px 0;
    border:1px solid #ddd;
    border-radius:8px;
}

.submit-btn{
    width:100%;
    padding:12px;
    border:none;
    border-radius:10px;
    background:#1f2a44;
    color:white;
    font-weight:600;
    margin-top:10px;
    cursor:pointer;
}

.back{
    margin-top:12px;
    color:#4f46e5;
    cursor:pointer;
    text-align:center;
}

/* FOOTER */

footer{
    background:#1f2a44;
    color:white;
    text-align:center;
    padding:15px;
    font-size:14px;
}

</style>
</head>

<body>

<div class="navbar">
    <div class="nav-left">
        <img src="https://cache.careers360.mobi/media/colleges/social-media/logo/SDM_College_of_Engineering_and_Technology_Logo_.png">
        <h2>SDMCET AlumniConnect</h2>
    </div>

    <ul>
        <li>About SDMCET</li>
        <li>Alumni</li>
        <li>Events</li>
        <li>Support</li>
    </ul>
</div>

<div class="hero">

<div class="slide slide1"></div>
<div class="slide slide2"></div>
<div class="slide slide3"></div>

<div class="hero-content">

<h1>SDMCET AlumniConnect</h1>

<h3>Shaping Engineers with Knowledge, Values, and Innovation</h3>

<p>
A dedicated alumni engagement platform for
<strong>S.D.M. College of Engineering & Technology, Dharwad</strong>,
encouraging meaningful conversations between students and alumni
to support learning, collaboration, and industry readiness.
</p>

<button class="hero-login-btn" onclick="openModal()">Login</button>

</div>
</div>

<div id="loginModal" class="modal">

<div class="modal-box">

<span class="close" onclick="closeModal()">&times;</span>

<div id="loginChoice">

<h2>Welcome to AlumniConnect</h2>
<p>Select how you want to login</p>

<button class="select-btn" onclick="showStudent()">🎓 Student Login</button>
<button class="select-btn" onclick="showAlumni()">👨‍💼 Alumni Login</button>

</div>

<div id="studentLogin" class="login-form">

<h3>Student Login</h3>

<input type="text" id="susn" placeholder="USN">
<input type="email" id="semail" placeholder="College Email">
<input type="password" id="spassword" placeholder="Password">

<button class="submit-btn" onclick="studentLogin()">Login</button>

<p class="back" onclick="backChoice()">← Back</p>

</div>

<div id="alumniLogin" class="login-form">

<h3>Alumni Login</h3>

<input type="email" id="aemail">
<input type="password" id="apassword">

<button class="submit-btn">Login</button>

<p class="back" onclick="backChoice()">← Back</p>

</div>

</div>
</div>

<footer>
© 2026 S.D.M. College of Engineering & Technology, Dharwad
</footer>

<script>

function studentLogin(){

fetch("api/student/login.php",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
usn:document.getElementById("susn").value,
email:document.getElementById("semail").value,
password:document.getElementById("spassword").value
})
})
.then(res=>res.json())
.then(data=>{
alert(data.message);
});

}

function openModal(){
document.getElementById("loginModal").style.display="flex";
}

function closeModal(){
document.getElementById("loginModal").style.display="none";
backChoice();
}

function showStudent(){
document.getElementById("loginChoice").style.display="none";
document.getElementById("studentLogin").style.display="block";
}

function showAlumni(){
document.getElementById("loginChoice").style.display="none";
document.getElementById("alumniLogin").style.display="block";
}

function backChoice(){
document.getElementById("loginChoice").style.display="block";
document.getElementById("studentLogin").style.display="none";
document.getElementById("alumniLogin").style.display="none";
}

</script>

</body>
</html>