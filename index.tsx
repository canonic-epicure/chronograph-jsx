import { globalGraph } from "./node_modules/@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { Box } from "./node_modules/@bryntum/chronograph/src/chrono2/data/Box.js"
import { ChronoGraphJSX } from "./src/jsx/ChronoGraphJSX.js"

globalGraph.autoCommit = true

await new Promise(resolve => window.addEventListener('load', resolve))


// @ts-ignore
const fragmentCondition = window.fragmentCondition = new Box(true)

const fragment = <>
    <div>Fragment content</div>
    { () => fragmentCondition.read() ? <div>Fragment condition true</div> : <div>Fragment condition false</div> }
</>

// @ts-ignore
const classBox = window.classBox = new Box('cls')
// @ts-ignore
const condition = window.condition = new Box(true)
// @ts-ignore
const numbers = window.numbers = new Array(10).fill(null).map((el, index) => new Box(index))

const el = <div class={ () => 'prefix_' + classBox.read() }>
    Div content
    { fragment }
    { () => condition.read() ? <div>Condition true</div> : <div>Condition false</div> }

    { () => numbers.map(number => <div>{ number }</div>) }
</div>


document.body.appendChild(el)
