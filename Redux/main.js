// import {createStore} from 'https://cdn.skypack.dev/redux';

//my redux
function createStore(reducer) {
    let state = reducer(undefined, {});
    const subcribers = [];
    return {
        getState() {
            return state;
        },
        dispatch(action) {
            state = reducer(state, action);

            subcribers.forEach((subcriber) => subcriber())
        },
        subscribe(subscriber) {
            subcribers.push(subscriber);
        }
    }
}

const initState = 0;

//Reducer function
function reducer(state = initState, action) {
    switch (action.type) {
      case 'DEPOSIT':
        return state + action.payload;
      case 'WITHDRAW':
        return state - action.payload;
      default:
        return state
    }
}

//Store
let store = window.store = createStore(reducer)

//deposit function
function deposit(payload) {
    return {
        type: 'DEPOSIT',
        payload
    }
}

//withdraw function
function withdraw(payload) {
    return {
        type: 'WITHDRAW',
        payload
    }
}


//DOM event
const depositBtn = document.querySelector('#deposit');
//handle even
depositBtn.onclick = function() {
    store.dispatch(deposit(10))
}

//DOM event
const withdrawBtn = document.querySelector('#withdraw');
//handle even
withdrawBtn.onclick = function() {
    store.dispatch(withdraw(10))
}

//subcribe event
store.subscribe(() => {
    render();
})

function render() {
    const output = document.querySelector('#output');
    output.innerText = store.getState();
}

render();
