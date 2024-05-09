import './App.css';
import logo from './images/NoteCodeLogo.svg';
import CodeEditor from "./components/CodeEditor";

function App() {
    return (
        <div className='App'>
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Create & Share</h2>
            <h3>Your Code easily</h3>
            <div className='div-editor'>
                <CodeEditor/>
            </div>
        </div>
    );
}

export default App;
