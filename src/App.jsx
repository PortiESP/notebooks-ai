import "./App.css"
import NotebookEditor from "./components/notebook_editor/notebook_editor"

function App() {

  return (
    <div className="app-wrapper">
      <div className="app-notebook">
        <NotebookEditor />
      </div>
    </div>
  )
}

export default App
