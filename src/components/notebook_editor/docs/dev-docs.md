
# Notebook Editor (Developer Documentation)

## Overview

The Notebook Editor is a web-based tool for creating and editing primary and secondary education exercises.

This document provides an overview of the Notebook Editor's architecture, its main components, and how to contribute to its development.

## Libraries

The Notebook Editor is a web application built with React. It uses mainly its own components and libraries, but also some third-party libraries.

- `jspdf` is used to generate PDF files.
- `react-dnd` is used for drag-and-drop functionality.
- `user-input` is used to track mouse events and dragging data.

*There are more libraries used in the project, but these are the most relevant ones.*


## Architecture

- `NotebooksEditor` is the main component of the application. It is responsible for rendering the editor and managing the state of the notebook.
- `Sheet` is a component that represents a sheet in the notebook. It contains a list of `SheetItem` components.
- `Section` is a component that represents a section/exercise in the notebook. (*A section can be of one of the following types*)
  - `SectionTypeDefault` is a component that represents a default section. A welcome message is displayed when the section is empty.
  - `Gap` is a component that represents a gap between sections. This is an empty section that can be used to separate other sections.
  - `SectionTypeDebug` is a component that represents a debug section. This section can be used to display debug information.
  - `SectionTypeBlank` is a component that represents a blank section. A section that can be populated with any content.
    - `ElementText` is a component that represents a text element in a blank section.
- `EditManager` is a component that manages the editing of the notebook. It is responsible for handling the events that display an edit menu when some editable content is clicked.
  - `EditText` is a component that represents a text element that can be edited.

## Development

### Global State

The global state of the application is managed with the `useContext` and `useReducer` hooks. To access the global state, use the `useContext(NotebookContext)` hook.

```javascript
// Import the context within a component
const { state, dispatch } = useContext(NotebookContext);

// Access the global state
const { notebook } = state;
```

#### Update the Global State

To update the global state, use the `dispatch` function with an action. You must provide an action type and a payload.

```javascript
// Dispatch an action
dispatch({ type: 'ACTION_CODE_HERE', payload: notebook });
```

#### Define a New Action

An action is a function that updates the global state based on the action type and payload. The action must be defined in the `reducer` file at `/utils/reducer.js`.

```javascript
// /utils/reducer.js

case 'ACTION_CODE_HERE':
    // Update the global state based on the payload
    return doSomething(state, action.payload);
```

To add a new action, you must follow these steps:

1. Define a new `case` in the `reducer` function.
2. Implement the logic. The `reducer` function must return the new state.
   1. Add some checks to validate the payload. (e.g., check if the section exists)
   2. Call a function to update the state. (*this is done to keep the reducer function clean and easy to read*)

In the auxiliary functions where the state is updated, you must follow these steps:
1. Clone the state using `deepClone`. (*if necessary*)
2. Edit the state copy.
3. Return the modified copy of the state.


#### Debug information

In the `NotebooksEditor` component, inside a `useEffect` hook, there are stored in the `window` object some debug information about the notebook. This information can be accessed in the browser console.

- `window.debug` contains the notebook's debug state.
- `window.state` contains the notebook's global state.
- `window.dispatch` contains the notebook's dispatch function.


#### Local State

The local state of the application is managed with the `useState` hook. The local state is just a reflection of the global state. We should use the `useEffect` hook to update the local state when the global state changes.
Then the local state can be used to render the component. Then another `useEffect` hook can be used to update the global state when the local state changes.

```javascript
// Define a local state
const [localState, setLocalState] = useState(state);

// Update the local state when the global state changes
useEffect(() => {
    setLocalState(state);
}, [state]);

// Update the global state when the local state changes
useEffect(() => {
    dispatch({ type: 'ACTION_CODE_HERE', payload: localState });
}, [localState]);
```

### Object's Structure

#### Sections

The sections object is an object of **section** objects. Where the key is the section's id and the value is the section object.

```javascript
sections: {
    "example-section-1": {},
    "example-section-2": {},
    // ...
}
```

#### Section Object

A section object has the following structure:

```javascript
{
    // Common properties for all section types (default, debug, blank, gap)
    id: "example-section-1",
    type: "default",
    height: 100,  // Height in millimeters

    // Type-specific properties
    // Blank section
    elements: { "eid-1": {}, "eid-2": {}, ... },
    title: "Example Title",  // Optional
}
```

#### Element Object

An element object has the following structure:

```javascript
{
    // Common properties for all element types (text, image, ...)
    id: "example-element-1",
    type: "text",
    width: 100,  // Width in millimeters
    height: 10,  // Height in millimeters
    x: 10,  // X position in millimeters
    y: 10,  // Y position in millimeters

    // Type-specific properties
    // Text element
    text: "Example Text",
}
```

### Elements

Elements are the building blocks of the sections/exercises. They can be of different types, such as text, image, math formula, calligraphy text, etc.

#### Create a new element

To create a new element, you must follow these steps:

1. Create a new folder in `/components/section/section_element/{element_name}/{element_name}.jsx`.
   1. Create a new component that represents the element.
   2. Create the styles for the element in the same folder.
      1. The element width and height must be `100%`
2. Add to this document a description of the new element including its properties.
3. Add the new element to the parser in `/components/section/section_types/blank/parseElementDataToJSX.jsx`. Add a new line like `type === "element_name" && ElementComponent`.
4. Add the new element to the parser in `/utils/parse_eData_to_class.js` add the class to the switch statement.
5. Now the new element can be used in the `SectionTypeBlank` component. You can add the new element to the `elements` array in the section object.


#### Edit an element

To make an element editable, you must use the attribute `data-editable` with one of the valid edit modes (`text`, `image`, `math`, `calligraphy`, ...). You must also provide in another attribute `data-editable-path` the path to the element in the global state (e.g., `sections["sectionId"].elements["elementId"]`, pretending to access `state.sections["sectionId"].elements["elementId"]` ).

```javascript
// Example of an editable text element
<div
    data-editable="text"
    data-editable-path={`sections["${sectionId}"].elements["${elementId}"].text`}
/>
```

##### Create an edit mode

To create a new edit mode, you must follow these steps:

1. Create a new folder in `/components/edit_elements/{edit_mode_name}/{edit_mode_name}.jsx`.
   1. Create a new component that represents the edit mode.
   2. Create the styles for the edit mode in the same folder.
2. Add to this document a description of the new edit mode including its properties.
3. Add the new edit mode in the `EditManager` component. You must add a new line like `else if (dataEditable === "edit_mode_name") setShowEditForm(<EditMyNewEditMode {...newProps}/>)`.


