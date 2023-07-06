//Header variables
let ThemeSelectBtn = document.querySelector('.selected-theme');
let OptionthemeEle = document.querySelector('.options-theme');
let HeaderEle = document.querySelector('.header');
let BodyEle = document.querySelector('.body');
let logoEle = document.querySelector('.logo');
let SelectedThemeEle;

// Add list variables
let wishListInputEle = document.querySelector('input');
let addButtonEle = document.querySelector('.add-button');

let wish="";
let localData = JSON.parse(localStorage.getItem("wishes"));
let wishList = localData || [];

//Show-List variables
let showListELe = document.querySelector('.show-list');
let count=0 , completed=0;

//score-card 
let scoreEle = document.querySelector('.score-card');

//Header funtions
ThemeSelectBtn.addEventListener('click', (event)=>{
    SelectedThemeEle=event.target;
    if(SelectedThemeEle.parentNode.style.display!=='none' && SelectedThemeEle.tagName==='IMG'){
        // console.log(event.target);
        // console.log(event.target.parentNode.parentNode.innerHTML);
        SelectedThemeEle.parentNode.style.display='none';
        OptionthemeEle.classList.add('show');
    }
})

OptionthemeEle.addEventListener('click' , (event)=>{
    let newSelectedEle;
    if(event.target.tagName==='IMG'){
        newSelectedEle=event.target.parentNode.parentNode.innerHTML;
        SelectedThemeEle.parentNode.parentNode.innerHTML=newSelectedEle;
        newSelectedEle='';
        OptionthemeEle.classList.remove('show');
        SelectedThemeEle.parentNode.style.display='inline-block';
        console.log(event.target.parentNode.name);
        if(event.target.parentNode.name==='blue'){
            console.log(HeaderEle);
            HeaderEle.style.backgroundColor = '#4a55a2';
            BodyEle.style.backgroundColor = '#6973ba';
            HeaderEle.style.borderBottom = '3px solid white';
            HeaderEle.style.color = 'white';
            logoEle.innerHTML = `<img src="logo/logo-blue.png" alt="Logo">`
        }
        if(event.target.parentNode.name==='dark'){
            console.log(HeaderEle);
            HeaderEle.style.backgroundColor = '#607d8b';
            BodyEle.style.backgroundColor = '#7d98a5';
            HeaderEle.style.borderBottom = '3px solid black';
            HeaderEle.style.color = 'black';
            logoEle.innerHTML = `<img src="logo/logo-dark.png" alt="Logo">`
        }
        if(event.target.parentNode.name==='light'){
            console.log(HeaderEle);
            HeaderEle.style.backgroundColor = '#fff';
            BodyEle.style.backgroundColor = '#fff';
            HeaderEle.style.borderBottom = '3px solid black';
            HeaderEle.style.color = 'black';
            logoEle.innerHTML = `<img src="logo/logo-white.jpg" alt="Logo">`
        }
    }
    else{
        OptionthemeEle.classList.remove('show');
        SelectedThemeEle.parentNode.style.display='inline-block';
    };
})

// Button rotation

function rotateButton(button) {
    // console.log(button);
    let currentRotation = button.dataset.rotation || 0;
    let newRotation = (parseInt(currentRotation) + 90);
    button.style.transform = `rotate(${newRotation}deg)`;
    button.dataset.rotation = newRotation;
}

//WIshlist

//Id generator
function generateUniqueId() {
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    return uniqueId;
}

// Cliking on Add Button
addButtonEle.addEventListener('click',(event)=>{
    event.preventDefault();
    wish = wishListInputEle.value;
    console.log(wish);
    if(wish && wish.length>0){
        wishList = [...wishList,{name: wish,id : generateUniqueId(),isCompleted: false}]
        console.log(wishList);
    }
    loadWishlist(wishList);
    localStorage.setItem("wishes",JSON.stringify(wishList));
    wishListInputEle.value='';
})

showListELe.addEventListener('click' , (event)=>{
    
    // console.log(event.target.tagName);
    if(event.target.tagName==='INPUT' && event.target.type==='checkbox'){
        let checkedkey = event.target.getAttribute('key');
        wishList = wishList.map((eachwish)=>{
            if(checkedkey === eachwish.id){
                return{
                    ...eachwish,
                    isCompleted : !eachwish.isCompleted
                }
            }  
            return eachwish;
        })
    }

    if(event.target.tagName==='IMG'){
        let keytodel = event.target.getAttribute('data-key');
        
        wishList = wishList.filter((eachwish)=> eachwish.id != keytodel);
    }
    localStorage.setItem('wishes', JSON.stringify(wishList));
    showListELe.innerHTML=''
    loadWishlist(wishList);
})

function loadWishlist(wishList){
    
    showListELe.innerHTML='';
    completed=0;
    // Sort wishlist based on isCompleted property
    wishList.sort((a, b) => {
        if (a.isCompleted && !b.isCompleted) {
            return 1;
        } else if (!a.isCompleted && b.isCompleted) {
            return -1;
        }
        return 0;
    });


    for(let eachwish of wishList){
        let listEle = document.createElement('div');
        listEle.classList.add('list-item');

        let checkBoxEle = document.createElement('input');
        checkBoxEle.setAttribute('key',eachwish.id);
        checkBoxEle.setAttribute('type','checkbox');
        checkBoxEle.checked = eachwish.isCompleted;
        listEle.appendChild(checkBoxEle);

        let wishNameEle = document.createElement('div');
        wishNameEle.className="list-text";
        wishNameEle.textContent=eachwish.name;
        if(eachwish.isCompleted){
            completed++;
            wishNameEle.style.textDecoration = 'line-through';
            listEle.classList.add('completed');
        }
        else listEle.classList.remove('completed');
        listEle.appendChild(wishNameEle);

        const deleteBtnEle = document.createElement('button');
        deleteBtnEle.className="delete-button button";
        listEle.appendChild(deleteBtnEle);

        const deleteIconImg = document.createElement('img');
        deleteIconImg.setAttribute('data-key' ,eachwish.id);
        deleteIconImg.setAttribute('src', 'logo/delete.svg');
        deleteIconImg.setAttribute('alt', 'Delete');
        deleteBtnEle.appendChild(deleteIconImg);

        showListELe.appendChild(listEle);

        setTimeout(() => {
            listEle.classList.add('visible');
        },);
    }
    updateCount();
    updateScore();
}

const updateCount =()=>{
    if(wishList){
      count = wishList.length;
    }
    if(count === 0){
      const emptyMessage = document.createElement('p');
      emptyMessage.innerHTML = '<p>The Wish-Llist is empty!<p/>';
      emptyMessage.classList.add('empty-wishlist');
      showListELe.appendChild(emptyMessage);
    }
    console.log(count);
  }

//   Name asking
function togglePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = (popup.style.display === "block") ? "none" : "block";
}

function changeName() {
    const beautifulNameInput = document.getElementById("beautiful-name-input");
    const nameBox = document.querySelector(".name-box");
    const beautifulName = beautifulNameInput.value.trim();

    if (beautifulName !== "") {
        nameBox.textContent = `Welcome ${beautifulName}!`;
    }

    togglePopup();
}


const updateScore=()=>{
    scoreEle.innerHTML = `<div><p>Completed : ${completed}</p><p>Total Tasks : ${count}</p></div>`
}
//Digital
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const day = now.getDate();
    const month = now.getMonth() + 1; // Months are zero-based
    const year = now.getFullYear();
  
    const timeElement = document.getElementById("clock-time");
    const dateElement = document.getElementById("clock-date");
  
    timeElement.textContent = formatTime(hours, minutes, seconds);
    dateElement.textContent = formatDate(day, month, year);
}
  
function formatTime(hours, minutes, seconds){
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}
  
function formatDate(day, month, year) {
    return `${padZero(day)}/${padZero(month)}/${year}`;
}
  
function padZero(value) {
    return value.toString().padStart(2, "0");
}
  
// Update the clock every second
setInterval(updateClock, 1000);
  

// Anallog
function moveClockHands() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
  
    const secondHand = document.getElementById("second-hand");
    const minuteHand = document.getElementById("minute-hand");
    const hourHand = document.getElementById("hour-hand");
  
    const secondHandRotation = seconds * 6;
    const minuteHandRotation = minutes * 6 + seconds * 0.1;
    const hourHandRotation = hours * 30 + minutes * 0.5;
  
    secondHand.style.transform = `rotate(${secondHandRotation}deg)`;
    minuteHand.style.transform = `rotate(${minuteHandRotation}deg)`;
    hourHand.style.transform = `rotate(${hourHandRotation}deg)`;
}
  
  // Update the clock every second
  setInterval(moveClockHands, 1000);
  
updateCount();
loadWishlist(wishList);