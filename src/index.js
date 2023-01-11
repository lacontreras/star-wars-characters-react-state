import React, { useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import isFunction from 'lodash/isFunction';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import CharacterList from './CharacterList';
import CharacterView from './CharacterView';

import endpoint from './endpoint';

import './styles.scss';

//* this will be a reducer for managing characters. We're gonna separate the asynchronous part of our application from the synchronous state management pieces
const reducer = (state, action) => {
  if (action.type === 'FETCHING') {
    return {
      characters: [],
      loading: true,
      error: null,
    };
  }

  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      characters: action.payload.characters,
      loading: false,
      error: null,
    };
  }

  if (action.type === 'ERROR') {
    return {
      characters: [],
      loading: false,
      error: action.payload.error,
    };
  }

  return state;
};

const fetchCharacters = (dispatch) => {
  dispatch({ type: 'LOADING' });
  fetch(endpoint + '/characters')
    .then((response) => response.json())
    .then((response) =>
      dispatch({
        type: 'RESPONSE_COMPLETE',
        payload: { characters: response.characters },
      }),
    )
    .catch((error) => dispatch({ type: 'ERROR', payload: { error } }));
};

const initialState = {
  error: null,
  loading: false,
  characters: [],
};
//* we want to create something over the dispatch function that says: if this is a normal action (just like we had before), pass dispatch to do the thing. If this is a function, call the function, give it a copy of dispatch and say: you take care of dispatch and whenever you're done doing whatever you're doing, you can go ahead and dispatch actions yourself.

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = (action) => {
    console.log(action);

    if (isFunction(action)) {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };
  return [state, enhancedDispatch];
};

const Application = () => {
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters } = state;

  useEffect(() => {
    dispatch((dispatch) => {});
  }, []);

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <button
            onClick={() => {
              dispatch(fetchCharacters);
            }}
          >
            Fetch Characters
          </button>
          <CharacterList characters={characters} />
        </section>
        <section className="CharacterView">
          <Routes>
            <Route path="characters/:id" element={<CharacterView />} />
          </Routes>
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
