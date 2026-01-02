const inputslider = document.querySelector("[data-lenghtslider]");
//const displaycontainer = document.querySelector(".displaycontainer");
const passworddisplay = document.querySelector("[data-passwordDisplay]");
const copymsg = document.querySelector("[data-copymsg]");
const copybtn = document.querySelector("[data-copy]");
const lenghtdisplay = document.querySelector("[data-lenghtnumber]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const number = document.querySelector("#number");
const symbol = document.querySelector("#symbol");
//const strenght = document.querySelector(".strenght-container");
const generatebutton = document.querySelector(".generatebutton");
const indicator = document.querySelector("[data-indicator]");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");

const symbolstring = '~@#$%^&*()_-{[}]\\|:";<,>.?/';
 
let password = "";
let passwordlenght = 10;
let checkcount = 0;
handslider();
//set strenght circle color to grey 

//set password length;
function handslider() {
    inputslider.value = passwordlenght;
    lenghtdisplay.innerText = passwordlenght;
}

function setindicator(color) {
    indicator.style.backgroundColor = color;
}

function getrndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generaterandomnumber() {
    return getrndInteger(0, 9);
}

function generatelowercase() {
    return String.fromCharCode(getrndInteger(97, 123));
}

function generateuppercase() {
    return String.fromCharCode(getrndInteger(65, 91));
}

function generatesymbol() {
    const random = getrndInteger(0, symbolstring.length);
    return symbolstring.charAt(random);
}

function calculatestrenght() {
    let hasupper = false;
    let haslower = false;
    let hassymbol = false;
    let hasnumber = false;
    if (uppercase.checked) hasupper = true;
    if (lowercase.checked) haslower = true;
    if (number.checked) hasnumber = true;
    if (symbol.checked) hassymbol = true;

    if (hasupper && haslower && (hassymbol || hasnumber) && passwordlenght >= 8) {
        setindicator('#0f0');
    } else if ((hasupper || haslower) && (hasnumber || hassymbol) && passwordlenght >= 6) {
        setindicator('#ff0');
    } else {
        setindicator('#f00');
    }
}

async function copycontent() {
    try {
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText = "copied";
    }
    catch (e) {
        copymsg.innerText = "failed";
    }

    // to make copy wala span visible
    copymsg.classList.add("active");

    setTimeout(() => {
        copymsg.classList.remove("active");
    }, 2000);
}

function shufflepassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((e) => (str += e));
    return str;
}

function handlecheckboxchanges() {
    checkcount = 0;
    allcheckbox.forEach((checkbox) => {
        if (checkbox.checked)
            checkcount++;
    })

    //special condition
    if (passwordlenght <= checkcount) {
        passwordlenght = checkcount;
        handslider();
    }
}

allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handlecheckboxchanges)
})

inputslider.addEventListener('input', (e) => {
    passwordlenght = e.target.value;
    handslider();
})

copybtn.addEventListener('click', () => {
    if (passworddisplay.value) {
        copycontent();
    }
})

generatebutton.addEventListener('click', () => {
    if (checkcount <= 0) return;
    if (passwordlenght < checkcount) {
        passwordlenght = checkcount;
        handslider();
    }
    password = "";

    let funcArr = [];

    if (uppercase.checked) {
        funcArr.push(generateuppercase);
    }
    if (lowercase.checked) {
        funcArr.push(generatelowercase);
    }
    if (number.checked) {
        funcArr.push(generaterandomnumber);
    }
    if (symbol.checked) {
        funcArr.push(generatesymbol);
    }

    // compulsory
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining
    for (let i = 0; i < passwordlenght - funcArr.length; i++) {
        let randindex = getrndInteger(0, funcArr.length);
        password += funcArr[randindex]();
    }

    password = shufflepassword(Array.from(password));

    passworddisplay.value = password;

    calculatestrenght();
})
