const ThemeToggle = document.getElementById('theme-toggle');
const ThemeLocalStorage = localStorage.getItem('theme');
const ContentDiv = document.getElementById('content-div');
const Nav = document.getElementById('nav');

let darkTheme = false;

window.addEventListener('load', () => {
    const noTransitionElements = document.querySelectorAll('.no-transition');

    noTransitionElements.forEach((element) => {
        element.classList.remove('no-transition');
    });
})

if (ThemeLocalStorage === 'dark') {
    document.body.classList.add('dark');
    darkTheme = true;
    ThemeToggle.checked = darkTheme;
}

else if(ThemeLocalStorage !== "light" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
    darkTheme = true;
    ThemeToggle.checked = darkTheme;
}

ThemeToggle.addEventListener('change', () => {
    if(darkTheme) {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        darkTheme = false;
        return;
    }

    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    darkTheme = true;
});

window.addEventListener('hashchange', () => {
    //remove the # from the hash
    const hash = window.location.hash.substring(1);
    const hashButton = document.getElementById("button-" + hash);

    document.querySelectorAll('.hash-button').forEach((button) => {
        button.classList.remove('active');
    });

    hashButton.classList.add('active');
    changeContent(hash);
});

if(window.location.hash) {
    const hash = window.location.hash.substring(1);
    const hashButton = document.getElementById("button-" + hash);
    hashButton.classList.add('active');
    changeContent(hash);
} else {
    const hashButton = document.getElementById("button-home");
    hashButton.classList.add('active');
    changeContent('home');
}

async function changeContent(hash) {
    Nav.classList.add('non-clickable');

    const oldContent = ContentDiv.querySelector('div');
    const response = await fetch('/pages/' + hash + '.html');
    const content = await response.text();

    if(oldContent === null) {
        ContentDiv.innerHTML = content;
        Nav.classList.remove('non-clickable');
        return;
    }

    // make a element from the html string
    const newContent = document.createElement('div');
    newContent.innerHTML = content;
    
    oldContent.classList.add('old')
    newContent.classList.add('new');
    ContentDiv.appendChild(newContent);

    setTimeout(() => {
        oldContent.remove();
        newContent.classList.remove('new');
        Nav.classList.remove('non-clickable');
    }, 500);
}