function addClearButton(){
    var button = document.getElementById('clear-button');
    if(button) return;
    button = document.createElement('button');
    button.id='clear-button';
    button.textContent='borrar';
    button.onclick=()=>{
        main_layout.textContent='borrando...'
        setTimeout(()=>{
            main_layout.innerHTML='';
        },2000);
    }
    main_layout.parentNode.appendChild(button)
}

window.addEventListener('load', addClearButton);

if(main_layout) addClearButton();