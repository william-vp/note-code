import {useRef, useState, useEffect} from "react";
import Editor, {DiffEditor, useMonaco, loader, Theme} from '@monaco-editor/react';
import iconShare from '../images/Share.svg';
import iconLink from '../images/link.svg';
import axios from "../config/axios";
import {message} from "antd";

const oceanicTheme = import('monaco-themes/themes/Oceanic Next');

const options = {
    "acceptSuggestionOnCommitCharacter": true,
    "acceptSuggestionOnEnter": "on",
    "accessibilitySupport": "auto",
    "autoIndent": false,
    "automaticLayout": true,
    "codeLens": true,
    "colorDecorators": true,
    "contextmenu": true,
    "cursorBlinking": "blink",
    "cursorSmoothCaretAnimation": false,
    "cursorStyle": "line",
    "disableLayerHinting": false,
    "disableMonospaceOptimizations": false,
    "dragAndDrop": false,
    "fixedOverflowWidgets": false,
    "folding": true,
    "foldingStrategy": "auto",
    "fontLigatures": false,
    "formatOnPaste": false,
    "formatOnType": false,
    "hideCursorInOverviewRuler": false,
    "highlightActiveIndentGuide": true,
    "links": true,
    "mouseWheelZoom": false,
    "multiCursorMergeOverlapping": true,
    "multiCursorModifier": "alt",
    "overviewRulerBorder": true,
    "overviewRulerLanes": 2,
    "quickSuggestions": true,
    "quickSuggestionsDelay": 100,
    "readOnly": false,
    "renderControlCharacters": false,
    "renderFinalNewline": true,
    "renderIndentGuides": true,
    "renderLineHighlight": "all",
    "renderWhitespace": "none",
    "revealHorizontalRightPadding": 30,
    "roundedSelection": true,
    "rulers": [],
    "scrollBeyondLastColumn": 5,
    "scrollBeyondLastLine": true,
    "selectOnLineNumbers": true,
    "selectionClipboard": true,
    "selectionHighlight": true,
    "showFoldingControls": "mouseover",
    "smoothScrolling": false,
    "suggestOnTriggerCharacters": true,
    "wordBasedSuggestions": true,
    "wordSeparators": "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
    "wordWrap": "off",
    "wordWrapBreakAfterCharacters": "\t})]?|&,;",
    "wordWrapBreakBeforeCharacters": "{([+",
    "wordWrapBreakObtrusiveCharacters": ".",
    "wordWrapColumn": 80,
    "wordWrapMinified": true,
    "wrappingIndent": "none"
};

const defaultValue = `<html>
  <head>
    <title>HTML Sample</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style type="text/css">
      h1 {
        color: #CCA3A3;
      }
    </style>
    <script type="text/javascript">
      alert("I am a sample... visit devChallengs.io for more projects");
    </script>
  </head>
  <body>
    <h1>Heading No.1</h1>
    <input disabled type="button" value="Click me" />
  </body>
</html>`;

const CodeEditor = () => {
    const [theme, setTheme] = useState(sessionStorage.theme ?? 'light');
    const [lang, setLang] = useState(sessionStorage.lang ?? 'html');
    const [value, setValue] = useState(defaultValue);
    const [note, setNote] = useState(null);

    const [messageApi, contextHolder] = message.useMessage();
    const pathname= window.location?.pathname ? window.location.pathname?.replaceAll("/", "") : null;
    const [noteId, setNoteId] = useState(pathname ??  null);

    useEffect(() => {
        if (noteId && value === defaultValue) getNote(noteId);
        else setEditorInfo(null)
    }, [])
    
    const handleChangeTheme = e => {
        const theme = e.target?.value?.toLowerCase();
        sessionStorage.setItem('theme', theme);
        setTheme(theme);
    }

    const handleChangeLang = e => {
        const lang = e.target?.value?.toLowerCase();
        sessionStorage.setItem('lang', lang);
        setLang(lang);
    }

    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    const handleEditorChange = (value, event) => {
        setValue(value)
    }

    function shareCode() {
        const code = editorRef.current.getValue();
        saveBoard(noteId, code);
    }
    
    function copyLink() {
        navigator.clipboard.writeText(`${window.location.origin}/${noteId}`);
        message.info('¡Enlace copiado!', 2)
    }

    const getNote = async noteId => {
        try {
            const response = await axios.get(`/api/notes/${noteId}`);
            if (response.data.res) {
                const note = response.data?.note;
                setEditorInfo(note)
            }else{
                setNoteId(null)
                message.error('Esta Note no se encontró', 2.5)
            }
        } catch (e) {
            message.error('Ocurrió un error consultando esta Note', 2.5)
        }
    }

    const saveBoard = async (noteId = null, code) => {
        const data = {
            code, language: lang, theme, noteId
        }
        
        messageApi
            .open({
                type: 'loading',
                content: 'Guardando...',
                duration: 2.5,
            });
        
        try {
            const url = noteId !== '' && noteId ? `/api/notes/${noteId}` : `/api/notes`;
            const response = await axios.post(url, data);
            if (response.data.details) {
                const note= response.data.note;
                setNoteId(note.key)
                setEditorInfo(note);

                message.success('Note guardado correctamente', 2.5)
            }else{
                message.success('Ocurrió un error', 2.5)
            }
            
        } catch (e) {
            message.error('Ocurrió un error', 2.5)
        }
    }
    
    const setEditorInfo = (note= null) => {
        if (note){
            setValue(note?.code)
            setNote(note)
            setTheme(note.theme)
            setLang(note.language)
        }else{
            setValue(defaultValue)
            setNote(null)
            setTheme('light')
            setLang("html")
        }
    }
     
    const disabledShared= () => {
        let disabled= false;
        if (note) {
            disabled = note?.code.trim() === value.trim() && note.theme === theme && note.language === lang;
        }
        return disabled;
    }

    return <div className={`container-editor background-${theme}`}>
        {contextHolder}
        <Editor
            onChange={handleEditorChange}
            theme={theme === 'dark' ? 'vs-dark' : theme}
            options={options}
            onMount={handleEditorDidMount}
            height="80vh"
            language={lang}
            value={value}
            defaultLanguage={lang}/>

        <div className='container'>
            <div className='row-buttons'>
                <div className='row-select'>
                    <select className='select' value={theme} onChange={handleChangeTheme} name="theme" id="theme">
                        <option value='light'>Light</option>
                        <option value='dark'>Dark</option>
                    </select>

                    <select className='select' value={lang} onChange={handleChangeLang} name="language" id="language">
                        <option value="plaintext">plaintext</option>
                        <option value="abap">abap</option>
                        <option value="apex">apex</option>
                        <option value="azcli">azcli</option>
                        <option value="bat">bat</option>
                        <option value="bicep">bicep</option>
                        <option value="cameligo">cameligo</option>
                        <option value="clojure">clojure</option>
                        <option value="coffeescript">coffeescript</option>
                        <option value="c">c</option>
                        <option value="cpp">cpp</option>
                        <option value="csharp">csharp</option>
                        <option value="csp">csp</option>
                        <option value="css">css</option>
                        <option value="cypher">cypher</option>
                        <option value="dart">dart</option>
                        <option value="dockerfile">dockerfile</option>
                        <option value="ecl">ecl</option>
                        <option value="elixir">elixir</option>
                        <option value="flow9">flow9</option>
                        <option value="fsharp">fsharp</option>
                        <option value="go">go</option>
                        <option value="graphql">graphql</option>
                        <option value="handlebars">handlebars</option>
                        <option value="hcl">hcl</option>
                        <option value="html">html</option>
                        <option value="ini">ini</option>
                        <option value="java">java</option>
                        <option value="javascript">javascript</option>
                        <option value="json">json</option>
                        <option value="julia">julia</option>
                        <option value="kotlin">kotlin</option>
                        <option value="less">less</option>
                        <option value="lexon">lexon</option>
                        <option value="liquid">liquid</option>
                        <option value="lua">lua</option>
                        <option value="m3">m3</option>
                        <option value="markdown">markdown</option>
                        <option value="mdx">mdx</option>
                        <option value="mips">mips</option>
                        <option value="msdax">msdax</option>
                        <option value="mysql">mysql</option>
                        <option value="objective-c">objective-c</option>
                        <option value="pascal">pascal</option>
                        <option value="pascaligo">pascaligo</option>
                        <option value="perl">perl</option>
                        <option value="pgsql">pgsql</option>
                        <option value="php">php</option>
                        <option value="pla">pla</option>
                        <option value="postiats">postiats</option>
                        <option value="powerquery">powerquery</option>
                        <option value="powershell">powershell</option>
                        <option value="proto">proto</option>
                        <option value="pug">pug</option>
                        <option value="python">python</option>
                        <option value="qsharp">qsharp</option>
                        <option value="r">r</option>
                        <option value="razor">razor</option>
                        <option value="redis">redis</option>
                        <option value="redshift">redshift</option>
                        <option value="restructuredtext">restructuredtext</option>
                        <option value="ruby">ruby</option>
                        <option value="rust">rust</option>
                        <option value="sb">sb</option>
                        <option value="scala">scala</option>
                        <option value="scheme">scheme</option>
                        <option value="scss">scss</option>
                        <option value="shell">shell</option>
                        <option value="sol">sol</option>
                        <option value="aes">aes</option>
                        <option value="sparql">sparql</option>
                        <option value="sql">sql</option>
                        <option value="st">st</option>
                        <option value="swift">swift</option>
                        <option value="systemverilog">systemverilog</option>
                        <option value="verilog">verilog</option>
                        <option value="tcl">tcl</option>
                        <option value="twig">twig</option>
                        <option value="typescript">typescript</option>
                        <option value="vb">vb</option>
                        <option value="wgsl">wgsl</option>
                        <option value="xml">xml</option>
                        <option value="yaml">yaml</option>
                        <option value="ada">ada</option>
                        <option value="cobol">cobol</option>
                        <option value="d">d</option>
                        <option value="dart">dart</option>
                        <option value="elixir">elixir</option>
                        <option value="erlang">erlang</option>
                        <option value="fortran">fortran</option>
                        <option value="groovy">groovy</option>
                        <option value="haskell">haskell</option>
                        <option value="julia">julia</option>
                        <option value="ocaml">ocaml</option>
                        <option value="octave">octave</option>
                        <option value="racket">racket</option>
                        <option value="sbcl">sbcl</option>
                        <option value="scala">scala</option>
                    </select>
                </div>

                <div className='row-share'>
                    {noteId && <span className='link-block' onClick={copyLink}>
                        <img src={iconLink} alt="icon link" width={20}/>
                        <span className='span-link'>.../{noteId}</span>
                    </span>}

                    <button className='btn-share' onClick={shareCode} disabled={disabledShared()} >
                        <img src={iconShare} alt='icon share'/>
                        Share
                    </button>
                </div>
            </div>
        </div>

    </div>;
}

export default CodeEditor;