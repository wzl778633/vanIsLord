<template>
<div>
  <header>
    <a class = "bt" id = "c1">FUCK</a>
    <a class = "bt" id = "c2">YOUR</a>
    <a class = "bt" id = "c3">MOM</a>
  </header>
  <div id="page"> </div>
  <footer>
    <div id="endWords">
      <p>Tip the world over on its side and everything loose will land in Los Angeles.</p>
      <h3>-Frank Lloyd Wright</h3>
    </div>

    <div id="designer">
      <h2>Designed By</h2>
      <p>Zining "Tom" Wang</p>
      <a href="mailto:ziningwa@usc.edu">ziningwa@usc.edu</a>
      <a href="tel:+13235478175">(+1) 323 547 8175</a>
    </div>
  </footer>
</div>

</template>

<script>
export default {
  name: "404Page",
  created() {
    let page = document.getElementById("page");
    page.innerHTML="";
    let d1 = document.createElement("div");

    let background = document.createElement("div");
    let letter = document.createElement("p");
    d1.className = "errorImg";
    background.id = "orange";

    letter.textContent = "Page Not Found";

    let d2 = document.createElement("div");
    d2.className = "errorMassage";
    let div = document.createElement("div");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    p1.textContent = "The page you were looking for could not be found."
    p2.textContent = "It might have been removed, renamed, or does not exist in the first place!"

    d1.append(background,letter);
    div.appendChild(p1);
    div.appendChild(p2);
    d2.appendChild(div);
    page.append(d1,d2)
  }
}
</script>

<style scoped>
@font-face {
  font-family: "Comfortaa";
  src:url("../assets/fonts/Comfortaa-VariableFont_wght.ttf") format('truetype');

}

*{
  margin:0;
  padding:0;
  border:0;

}
body{
  text-align: center;
  background-color: #222529;
  width: 1800px;
  font-family: "Comfortaa";
  color: white;

}

header{
  background-color: black;
  position: relative;
  width: 1800px;
  height: 100px;
  text-align: center;
  box-sizing: border-box;

}

a.bt{
  text-decoration: none;
  position: absolute;
  top: 40px;
  height: 20px;
  width: 100px;

  font-size: 25px;

  color: white;

  text-shadow: 1px 1px 0px #e57f3a;


}
header a#c1{
  left: 550px;

}
header a#c2{
  left: 850px;

}
header a#c3{
  right: 550px;

}
a.bt:hover{
  color: #e57f3a;
  text-shadow: 1px 1px 0px white;
}




footer{
  background-color: #12141b;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
#endWords{
  width: 500px;
  margin: 50px 70px;
}
#endWords p{
  margin-bottom: 40px;

}

#designer{
  width: 200px;
  margin: 50px 140px;
}
#designer>*{
  display: block;
  margin-bottom: 30px;

  color: white;

}

#designer>a{
  margin-bottom: 0px;
  text-decoration: none;
}

#designer>a:hover{
  text-decoration: underline;
}

.errorImg{
  height: 400px;
  background-color: #793e1c;
  position: relative;

}

.errorImg>p{
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%,-50%);
  font-size: 3em;
  color: black;
  font-weight: bold;

}

.errorMassage{
  height: 400px;
  position: relative;

}

.errorMassage>*{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  text-align: center;
}

.errorMassage>div p{
  font-size: 2em;
  white-space: nowrap;
}

#orange{
  width: 1800px;
  height: 400px;
  top:0;
  right: 0;
  left:0;
  bottom: 0;
  position: absolute;
  background-image: url("../assets/404-featured.jpg");
  background-size: cover;
  background-position: center;

  opacity: 0.35;

}
</style>