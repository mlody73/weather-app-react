require('normalize.css/normalize.css');
require('styles/gridlex.min.css');
require('styles/App.css');


import React from 'react';
import HeaderAppContainer  from './HeaderAppContainer';



class AppComponent extends React.Component {


 render() {
    return (
    <div className="main">
    	<HeaderAppContainer />
    </div>
    );
  }
}

export default AppComponent;
