gsap.registerPlugin(ScrollTrigger)
window.scrollTo({top: 0, behavior: 'smooth' })
document.body.style.overflowY='auto'
function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
      let [key, value] = cookie.split("=");
      if (key === name) return value;
  }
  return null; // Cookie not found
}
function fade() {
  gsap.to(document.body,{
    opacity:0,
    background:'#1d1d1d',
    duration:.5,
    onComplete:()=>{
      window.location='/'
    },
  })
}
function setPhaserCookie(value) {
  let date = new Date();
  date.setTime(date.getTime() + (90 * 60 * 1000)); // 90 minutes from now
  let expires = "expires=" + date.toUTCString();
  document.cookie = "phaser=" + value + "; " + expires + "; path=/";
}
const checkCookie=()=>{
  if (getCookie("phaser")==='1') {
    document.querySelector('.white').style.width='0'
  } 
  else {
    gsap.to('.white',{
      width:0,
      duration:1.5,
      onComplete:()=>{document.body.style.overflowY='auto'}
    })
  }
  setPhaserCookie('1')
}
window.onload = () => {
  checkCookie()
}

gsap.to(
  document.body,{
    scrollTrigger:{
      trigger:'.goal',
      endTrigger:'.archive',
      start:'bottom center',
      end:'top 60%',
      scrub: 1,
    },
    color:'#1D1D1D',
    background:'#E2E2E2'
  }
)

function black(s,path) {
  document.querySelectorAll("header a").forEach((e)=>{e.classList.remove("op")});
  s.classList.add('op')
  gsap.to(document.body,{
    background:'#1d1d1d',
    duration:.5,
  })
  gsap.to(".white", {
    onStart:()=>{
      document.querySelector(".white").style.right="auto"
      document.querySelector(".white").style.left="0"
    },
    width: "100vw",
    duration: 1.5,
    onComplete: () => (window.location = `/${path}`),
  });
}