const mousemove = document.querySelector(".mousemove");
//console.log(mousemove);
mousemove.style.visibility = "green";

window.addEventListener("mousemove", (e) => {
    //console.log("click !!!!");
    //console.log(e.target);
    mousemove.style.left = e.pageX + "px";
    mousemove.style.top = e.pageY + "px";
});




