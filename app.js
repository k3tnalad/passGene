// GENERATOR SELECTORS
const lengthRange = document.querySelector('#length');
const lengthLabel = document.querySelector('[for="length"]');
const numbers = document.querySelector('#numbers');
const symbols = document.querySelector('#symbols');
const passwordTitle = document.querySelector('h4');
const generateButton = document.querySelector('.gen-pass');
const usePassButton = document.querySelector('.use-pass');

// FORM SELECTORS
const form = document.querySelector('.form');
const formPass = form.querySelector('[name="pass"]');
const formWebsite = form.querySelector('[name="url"]');
const formLogin = form.querySelector('[name="login"]');
const saveButton = form.querySelector('.saveButton');


// VAULT SELECTORS 
const vault = document.querySelector('.vault');
const oneEntryElem = vault.querySelector('.entry');
const entriesElems = vault.querySelectorAll('.entry');

// INFOBLOCK SELECTORS
const infoBlock = document.querySelector('.infoBlock');
const infoDiv = infoBlock.querySelector('.info');
const infoButtons = infoBlock.querySelectorAll('.infoButtons')



// data
const chars = ['a','b','c','d','e','f','g','h','i','j',
            'k','l','m','n','o','p','q','r','s','t',
            'u','v','w','x','y','z', "A", "B", "C", 
            "D", "E", "F", "G", "H", "I", "J", "K", 
            "L", "M", "N", "O", "P", "Q", "R", "S", 
            "T", "U", "V", "W", "X", "Y", "Z"];

const entries = [];            

function generate(length) {
    let password = '';
    // generating a password based on letters only
    for (let i = 0; i < length; i++) {
        let randomChar = chars[Math.floor(Math.random() * 52)];
        password += randomChar;
    }
    return password;
}

function numbersIn(string) {
    let length = string.length;
    let passWithNums = string.split('');
    if (length < 15) {
        for (let i = 0; i < 4; i++) {
            let random = Math.floor(Math.random() * length);
            passWithNums[random] = String(Math.floor(Math.random() * 10));
        }
        return passWithNums.join('');    
    } else if (length > 15 && length < 25) {
        for (let i = 0; i < 7; i++) {
            let random = Math.floor(Math.random() * length);
            passWithNums[random] = String(Math.floor(Math.random() * 10));
        }
        return passWithNums.join('');
    } else {
        for (let i = 0; i < 13; i++) {
            let random = Math.floor(Math.random() * length);
            passWithNums[random] = String(Math.floor(Math.random() * 10));
        }
        return passWithNums.join('');
    }
}      

// function that inserts symbols
function symbolsIn(string) {
    let arr = string.split('');
    const symbolsArr = '!@#$%^&*'.split('');
    if (arr.length < 10) {
        for (let i = 0; i < 3; i++) {
            let random = Math.floor(Math.random() * arr.length);
            arr[random] = symbolsArr[Math.floor(Math.random() * 7)];
        }
    } else if (arr.length > 10 && arr.length < 20) {
        for (let i = 0; i < 5; i++) {
            let random = Math.floor(Math.random() * arr.length);
            arr[random] = symbolsArr[Math.floor(Math.random() * 7)];
        }
    } else if (arr.length > 20 && arr.length <= 30) {
        for (let i = 0; i < 7; i++) {
            let random = Math.floor(Math.random() * arr.length);
            arr[random] = symbolsArr[Math.floor(Math.random() * 7)];
        }
    }
    return arr.join('');
}


// function that displays highlighted password after generating it based on the checked inputs
function displayPassword(e) {
    e.preventDefault();
    let password = '';
    // if bothChecked
    if (numbers.checked && symbols.checked) {
        password = symbolsIn(numbersIn(generate(lengthRange.value)));
      // only with numbers  
    } else if (numbers.checked) {
        password = numbersIn(generate(lengthRange.value));
        // only with symbols
    } else if (symbols.checked) {
        password = symbolsIn(generate(lengthRange.value));
        // plain one
    } else {
        password = generate(lengthRange.value);
    }
    passwordTitle.innerHTML = highlightSymbols(password);
}

// highlighting function
function highlightSymbols(string) {
    return string
        .split('')
        .map(item => {
            if('!@#$%^&*'.includes(item)) {
                return `<span class="symb">${item}<span>`;
            } else if ('0123456789'.includes(item)){
                return `<span class="numb">${item}</span>`
            }  else {
                return `<span class="lett">${item}</span>`
            }
        })
        .join('');
}


function handleSave() {
    if (!formLogin.value || !formPass.value || !formWebsite.value) return;
    const newEntry = {
        website: formWebsite.value,
        login: formLogin.value,
        password: [formPass.value, decrypify(formPass.value)],
        index: Math.floor(Math.random() * 10000),
    }
    updateEntries(newEntry)
    formWebsite.value = '';
    formLogin.value = ''; 
    formPass.value = '';
}

function decrypify(string) {
    return string.split('')
                .map(i => i = '*')
                .join('');
}

function updateEntries(entry) {
    entries.push(entry);
    // creating a div
    let entryDiv = document.createElement('div');
    entryDiv.setAttribute('id', `${entries[entries.length - 1].index}`);

    let entryName = entries[entries.length - 1].website;
    let entryNameEl = document.createElement('span');
    entryNameEl.innerText = `${entryName}`;
    entryDiv.appendChild(entryNameEl);
    vault.appendChild(entryDiv);
}

// trying to listen for a click on elements that are not yet created.
function fillInfoBlock(e) {
    if(vault.childElementCount !== 0) {
        const clickedEl = e.target;
        let clickedEntry = entries.find(item => parseInt(item.index) === parseInt(clickedEl.id));
        let html = `
        <div>
            <label id="site">Website: ${clickedEntry.website}</label>
        </div>
        <div>
            <label id="log">Username: ${clickedEntry.login}</label>
        </div>
        <div>
            <label id="pass">Password: ${clickedEntry.password[1]}</label>
        </div>
        `;
        defChild.remove();
        infoBlock.innerHTML = html;
    }
}



// EVENT LISTENERS  
generateButton.addEventListener('click', displayPassword);
lengthRange.addEventListener('mouseup', displayPassword);
lengthRange.addEventListener('change', e => lengthLabel.innerHTML = `Length: <span class="lengthNum">${lengthRange.value}</span>`)
lengthRange.addEventListener('mousemove', e => lengthLabel.innerHTML = `Length: <span class="lengthNum">${lengthRange.value}</span>`)
usePassButton.addEventListener('click', e => {
    e.preventDefault();
    formPass.value = passwordTitle.innerText;
});
saveButton.addEventListener('click', handleSave);
vault.addEventListener('click', fillInfoBlock);
