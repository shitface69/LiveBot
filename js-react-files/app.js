// If you're seeing this, I began converting to React on June 22, 2020. I bet the year is 2054 before this is released... omg kill me

// Stuff I need
const React = require('react');
const ReactDom = require('react-dom');
// Components
const {rcMenu} = require('./js-react-files/rcMenu.js')

window.onload = load;
let e = React.createElement;

function load() {
    console.log('loaded');
    let element = e('div', null, [
        e(rcMenu, null, null),
        e('div', {id:'main', key:'main'}, [

        ])
    ]);
    ReactDom.render(element, document.getElementById('root'));
}