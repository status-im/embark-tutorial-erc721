import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

    render(){
        return <div>
            Hola Mundo
            </div>;
    }
}

ReactDOM.render(<App></App>, document.getElementById('app'));
