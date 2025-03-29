const cursor=document.querySelector('.cursor')
const goes=document.getElementById("goes")

const bigDesk = window.matchMedia('(min-width: 1440px)');

const bigDeskFun = (div, e, d) => {
  const handleMouseMove = (x) => {
    const cursorSize = cursor.offsetWidth/2;
    
    cursor.innerHTML = e[2];
    let mouseX = x.clientX;
    let mouseY = x.clientY;
    let windowWidth = window.innerWidth;
    mouseX=bigDesk.matches?mouseX-((windowWidth-1440)/2):mouseX
    windowWidth=bigDesk.matches?windowWidth-((windowWidth-1440)/2):windowWidth
    let posX =  Math.min(Math.max(mouseX, cursorSize), windowWidth - cursorSize);
    gsap.to(cursor, {
      display: 'block',
      x: posX-cursorSize,
      y: mouseY,
      duration: 0.1,
      ease: "power1.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cursor, {
      display: 'none',
      duration: 0.1,
      ease: 'power1.out',
    });
  };

  const handleClick = () => {
    gsap.to(cursor, {
      display: 'none',
      duration: 0.1,
      ease: 'power1.out',
    });
  };

  if (d) {
    div.addEventListener('mousemove',handleMouseMove);
    div.addEventListener('mouseleave', handleMouseLeave);
    div.addEventListener('click', handleClick);
  } else {
    div.addEventListener('mousemove', handleMouseMove);
    div.addEventListener('mouseleave', handleMouseLeave);
    div.addEventListener('click', handleClick);
  }
};


function fade() {
  gsap.to(document.body, {
    opacity: 0,
    background: '#1d1d1d',
    duration: 0.5,
    onComplete: () => {
      window.location = '../';
    },
  });
}

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

function getCookie(name) {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
      let [key, value] = cookie.split("=");
      if (key === name) return value;
  }
  return null; // Cookie not found
}

function setPhaserCookie(value) {
  let date = new Date();
  date.setTime(date.getTime() + (90 * 60 * 1000)); // 90 minutes from now
  let expires = "expires=" + date.toUTCString();
  document.cookie = "phaser=" + value + "; " + expires + "; path=/";
}

const checkCookie=()=>{
  if (getCookie("phaser")==='3') {
    document.querySelector('.white').style.width='0'
  } 
  else {
    gsap.to('.white',{
      width:0,
      duration:1.5,
    })
  }
  setPhaserCookie('3')
}

window.onload=()=>{
  GetData().then(d => {
    if (d) {
      const fragment = document.createDocumentFragment(); // Create a fragment to append all new sections
  
      for (let i = 0; i < Object.keys(d).length; i++) {
        const newP = document.createElement("section");
        newP.setAttribute("class", `${Object.keys(d)[i]}`);
        // const h2=document.createElement("h2")
        // h2.innerHTML=Object.keys(d)[i]
        // h2.style.gridArea="2 / 1 / 3 / 5"
        // newP.appendChild(h2)
        d[`${Object.keys(d)[i]}`].forEach((e) => {
          const div = document.createElement("div");
          div.setAttribute('onclick',`up();fuckit('${e[0]}','${e[4]}','${e[2]}')`)
          const img = document.createElement("img");
          bigDeskFun(div,e,bigDesk.matches)
          window.onresize=()=>{
            console.log("re");
            bigDeskFun(div,e,bigDesk.matches)
          }
          
  
          div.setAttribute("data-text", e[2]);
          div.style.setProperty("--color", e[1]);
          div.style.gridArea = e[3];
          img.src = `/img/cover/${e[0]}.png`;
  
          div.appendChild(img);
          newP.appendChild(div);
        });
  
        fragment.appendChild(newP); // Append the newly created section to the fragment
      }
  
      // Append the fragment to the document body at once
      document.body.appendChild(fragment);
    }
    checkCookie()
  });
}
// Fetch the data from JSON
const GetData = async () => {
  try {
    const response = await fetch("/misc/path.json");
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};



function black(s,path) {
  document.querySelectorAll("header a").forEach((e)=>{e.classList.remove("op")});
  s.classList.add('op')
  gsap.to(".white", {
    width: "100vw",
    duration: 1.5,
    onComplete: () => (window.location = `/${path}`),
  });
}