const loader = document.getElementById("loader");
const loaderText = document.querySelector(".loader p");
const loaderBar = document.querySelector(".loader .loader-bar");
const root = document.getElementById("root");
// if ("serviceWorker" in navigator) {
//   // Register the Service Worker when the page loads
//   navigator.serviceWorker.register("/thecourse/service-worker.js")
//     .then((registration) => {
//       console.log("✅ Service Worker Registered with scope:", registration.scope);
//     })
//     .catch((err) => {
//       console.error("❌ Service Worker Registration Failed:", err);
//     });
// } else {
//   console.warn("❌ Service Worker not supported in this browser.");
// }




const fuckit=(name,dec,title)=>{
  goes.querySelector('.div h2').innerHTML=`${title}`
  goes.querySelector('a').href=`/misc/pdf/${name}.zip`
  goes.querySelector('a').download=`${title}.zip`
  goes.querySelector('.div p').innerHTML=dec
  goes.querySelector('img').src=`/img/pdcov/${name}.png`
}
const down=()=>{
  goes.style.height=0
}
const up=()=>{
  goes.style.height='100vh'
}

const timeline = () => {
  const tl = gsap.timeline();
  tl.to(document.body, { overflowY: "auto", pointerEvent:'none' })
    .to(loader, {
      onStart:()=>{
        loader.style.right= 0
        loader.style.left='auto'
      },
      width: 0, 
      duration: 0.5, 
      onComplete: () => (loader.style.display = "none")
    })
    .to("header", { opacity: 1, duration: 0.5}, "+=0.2")
    .to("header", {height: "auto",paddingTop: '50px', duration: 1 }, "+=0.7")
    .to(".biglog",{
      scale: 1,
      duration:1,
    },"-=1")
    .to("header .a", { opacity: 1, y: 0, duration: 1 }, "+=0.2")
    .to(["div.tim"], {
      pointerEvents: "all",
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
    }, "+=0.06").to(document.body,{pointerEvents: "all"},"+=0.1");
};

const GetData = async () => {
  const response = await fetch("/misc/path.json");
  const data = await response.json();
  return data.s2;
};

const resp = async () => {
  const payload = await GetData();
  const div=document.createElement('div')
  div.setAttribute("class","didi")
  div.innerHTML = payload.map(x => `<div onclick="up();fuckit('${x[0]}','${x[4]}','${x[2]}')" class="tim"><img src="./img/cover/${x[0]}.png"/></div>`).join("");
  root.appendChild(div)
  checkCookie(); // Now that elements are added, run animations
};

function black(s,path) {
  // document.querySelector()
  s.classList.add('op')
  gsap.to(".white", {
    width: "100vw",
    duration: 1.5,
    onComplete: () => (window.location = `./${path}`),
  });
}

function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}

function loaders(func) {
  let width = 0;
  const loadInterval = setInterval(() => {
    if (width > 100) {
      clearInterval(loadInterval);
      func();
    } else {
      loaderBar.style.width = width + "vw";
      loaderText.innerHTML = width + "%";
      width++;
    }
  }, 5);
}

function setPhaserCookie(value) {
  let date = new Date();
  date.setTime(date.getTime() + 90 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie = "phaser=" + value + "; " + expires + "; path=/";
}

const checkCookie = () => {
  if (getCookie("phaser")) {
    timeline();
  } else {
    console.log(document.cookie);
    loader.style.display = "block";
    loaders(timeline);
  }
  setPhaserCookie("0");
};

window.onload = () => {
  resp(); // Fetch and animate after elements exist
};
