import { CalculationFunction, CalculationModeSync } from "../../node_modules/@bryntum/chronograph/src/chrono2/CalculationMode.js"
import { globalGraph } from "../../node_modules/@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { CalculableBox, CalculableBoxUnbound } from "../../node_modules/@bryntum/chronograph/src/chrono2/data/CalculableBox.js"
import { Box, BoxUnbound } from "../../node_modules/@bryntum/chronograph/src/chrono2/data/Box.js"
import { Base } from "../class/Base.js"
import { isArray, isFunction, isNumber, isString, isSyncFunction } from "../util/Typeguards.js"


//---------------------------------------------------------------------------------------------------------------------
export class ElementReactivity extends CalculableBoxUnbound {
    lazy        : boolean       = false

    element     : Element       = undefined


    setAttribute (name : string, value : string) {
        if (value == null)
            this.element.removeAttribute(name)
        else
            this.element.setAttribute(name, value)
    }


    resolveAttributeSource (src : AttributeSource) : string {
        let source : AttributeSource        = src

        while (!isString(source)) {
            if (source instanceof BoxUnbound) {
                source  = source.read()
            } else if (isSyncFunction(source)) {
                source  = source()
            }
        }

        return source
    }


    applyAttributes (attributes : Record<string, AttributeSource>) : CalculableBoxUnbound[] {
        const boxes : CalculableBoxUnbound[]        = []

        Object.entries(attributes).forEach(([ name, source ] : [ string, AttributeSource ]) => {
            if (isString(source)) {
                this.setAttribute(name, source)
            }
            else {
                const box = new CalculableBoxUnbound({
                    persistent  : true,
                    lazy        : false,
                    calculation : () => {
                        this.setAttribute(name, this.resolveAttributeSource(source))
                    }
                })
                globalGraph.addAtom(box)

                boxes.push(box)
            }
        })

        return boxes
    }

    static from<T extends typeof ElementReactivity> (this : T, element : Element, attributes : Record<string, AttributeSource>, ...children : ElementSource[]) : InstanceType<T> {
        const reactivity        = new this() as InstanceType<T>

        reactivity.element      = element

        const attributeEffects  = reactivity.applyAttributes(attributes || {})

        const childNodesList    = NodesListReactivity.from(children)

        globalGraph.addAtom(childNodesList)

        reactivity.calculation  = () => {
            attributeEffects.forEach(effect => effect.read())

            while (element.childNodes.length > 0) element.childNodes[ 0 ].remove()

            element.append(...childNodesList.read())
        }

        return reactivity
    }
}

export class NodesListReactivity extends CalculableBoxUnbound<Node[]> {
    lazy                : boolean                               = false

    normalizedSources   : (Node | CalculableBoxUnbound<ElementSource>)[]       = undefined


    get calculation () : CalculationFunction<Node[], CalculationModeSync> {
        return () => this.normalizedSources.flatMap(source => this.resolveElementSource(source))
    }

    resolveElementSource (source : ElementSource) : Node[] {
        if (source instanceof Node) {
            return [ source ]
        }
        else if (source == null || source === true || source === false) {
            return []
        }
        else if (isNumber(source)) {
            return [ document.createTextNode(String(source)) ]
        }
        else if (isString(source)) {
            return [ document.createTextNode(source) ]
        }
        else if (isArray(source)) {
            return source.flatMap(this.resolveElementSource, this)
        }
        else if (isSyncFunction(source)) {
            return this.resolveElementSource(source())
        }
        else {
            return this.resolveElementSource(source.read())
        }
    }


    normalizeElementSource (source : ElementSource) : (Node | CalculableBoxUnbound<ElementSource>)[] {
        if (source instanceof Node) {
            return [ source ]
        }
        else if (source == null || source === true || source === false) {
            return []
        }
        else if (isNumber(source)) {
            return [ document.createTextNode(String(source)) ]
        }
        else if (isString(source)) {
            return [ document.createTextNode(source) ]
        }
        else if (isArray(source)) {
            return source.flatMap(this.normalizeElementSource, this)
        }
        else if (isSyncFunction(source)) {
            const box = new CalculableBoxUnbound({
                persistent  : true,
                lazy        : false,
                calculation : () => this.resolveElementSource(source)
            })
            globalGraph.addAtom(box)

            return [ box ]
        }
        else {
            return [ source ]
        }
    }


    static from<T extends typeof NodesListReactivity> (this : T, source : ElementSource) : InstanceType<T> {
        const instance              = new this() as InstanceType<T>

        instance.normalizedSources  = instance.normalizeElementSource(source)

        return instance
    }
}


export type AttributeSource =
    | string
    | (() => string)
    | CalculableBoxUnbound<AttributeSource>

export type ElementSource =
    | Node
    | string
    | number
    | boolean
    | null
    | undefined
    | (() => ElementSource)
    | CalculableBoxUnbound<ElementSource>
    | ElementSource[]


interface Component<Props extends Record<string, unknown> = Record<string, unknown>> {
    render (props : Props) : Element
}


export type ComponentConstructor<Props extends Record<string, unknown> = Record<string, unknown>> = new () => Component<Props>


export namespace ChronoGraphJSX {

    export const FragmentSymbol  = Symbol('FragmentSymbol')

    export function createElement (
        tagName         : string | typeof FragmentSymbol | ComponentConstructor,
        attributes      : Record<string, AttributeSource>,
        ...children     : ElementSource[]
    )
        : Element | NodesListReactivity
    {
        if (isString(tagName)) {
            const element       = document.createElement(tagName)

            const reactivity    = ElementReactivity.from(element, attributes, ...children)

            globalGraph.addAtom(reactivity)

            // @ts-ignore
            element.reactivity  = reactivity

            // globalGraph.untracked(() => reactivity.read())
            reactivity.read()

            return element
        }
        else if (tagName === FragmentSymbol) {
            const childNodesList    = NodesListReactivity.from(children)

            globalGraph.addAtom(childNodesList)

            return childNodesList
        }
        else if (isSyncFunction(tagName)) {

        }
        //     return XmlElement.new({
        //         tagName     : tagName,
        //         attributes  : attributes,
        //         childNodes  : normalizeXmlStream(children)
        //     })
        // }
        // else {
        //     return tagName.new({
        //         attributes  : attributes,
        //         childNodes  : normalizeXmlStream(children)
        //     })
        // }

        return
    }
}


//---------------------------------------------------------------------------------------------------------------------
type DOMElement = Element

declare global {
    namespace JSX {
        type Element        = DOMElement

        // interface ElementClass {
        //     render (props : any) : Element
        // }

        interface ElementAttributesProperty {
            props
        }

        // https://github.com/microsoft/TypeScript/issues/38108
        // interface ElementChildrenAttribute {
        //     childNodes
        // }
    }
}
