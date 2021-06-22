import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { Box } from "@bryntum/chronograph/src/chrono2/data/Box.js"
import { ClassUnion, Mixin } from "@bryntum/chronograph/src/class/Mixin.js"
import { field } from "@bryntum/chronograph/src/replica2/Entity.js"
import { ChronoGraphJSX, ElementSource, NodesListReactivity } from "./src/jsx/ChronoGraphJSX.js"
import { tag, WebComponent } from "./src/jsx/WebComponent.js"

globalGraph.autoCommit = true

await new Promise(resolve => window.addEventListener('load', resolve))


// @ts-ignore
const fragmentCondition = window.fragmentCondition = Box.new(true)

const fragment = <>
    <div>Fragment content</div>
    { () => fragmentCondition.read() ? <div>Fragment condition true</div> : <div>Fragment condition false</div> }
</>

// @ts-ignore
const classBox = window.classBox = Box.new('cls')
// @ts-ignore
const condition = window.condition = Box.new(true)
// @ts-ignore
const numbers = window.numbers = new Array(10).fill(null).map((el, index) => Box.new(index))

// const el = <div class={ () => 'prefix_' + classBox.read() }>
//     Div content
//     { fragment }
//     { () => condition.read() ? <div>Condition true</div> : <div>Condition false</div> }
//
//     { () => numbers.map(number => <div>{ number }</div>) }
// </div>


@tag('c-counter')
export class Counter extends Mixin(
    [ WebComponent, HTMLElement ],
    (base : ClassUnion<typeof WebComponent, typeof HTMLElement>) => {

        class Counter extends base {

            constructor () {
                super()

                // @ts-ignore
                this.enterGraph(globalGraph)

                const children      = NodesListReactivity.from(this.render())

                const shadowRoot    = this.attachShadow({ mode : 'open' })

                shadowRoot.append(...children.read())

                setInterval(() => this.counter++, 1000)
            }

            @field()
            counter     : number            = 0

            render () : ElementSource {
                return <div class={ () => 'prefix_' + classBox.read() }>
                    Div content
                    <p>{ this.$.counter }</p>
                    { fragment }
                    { () => condition.read() ? <div>Condition true</div> : <div>Condition false</div> }

                    { () => numbers.map(number => <div>{ number }</div>) }
                </div>
            }
        }

        return Counter
    }
) {}


document.body.appendChild(<c-counter></c-counter>)
