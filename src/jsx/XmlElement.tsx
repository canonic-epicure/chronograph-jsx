import { Base } from "../class/Base.js"
import { ClassUnion, Mixin } from "../class/Mixin.js"

//---------------------------------------------------------------------------------------------------------------------
// export type XmlNode = string | XmlElement


export class XmlElement extends Mixin(
    [ Base ],
    (base : ClassUnion<typeof Base>) =>

    class XmlElement extends base {
        props           : { class? : string }

        // parent          : XmlElement                = undefined
        //
        // childNodes      : XmlNode[]                 = []
        //
        // tagName         : string                    = ''
        //
        // $attributes     : this[ 'props' ]           = undefined
        //
        // get attributes () : this[ 'props' ] {
        //     if (this.$attributes !== undefined) return this.$attributes
        //
        //     return this.$attributes = {}
        // }
        //
        // set attributes (value : this[ 'props' ]) {
        //     this.$attributes = value === null
        //         ?
        //             undefined
        //         :
        //             Object.fromEntries(Object.entries(value).filter(entry => entry[ 1 ] !== undefined))
        // }
        //
        //
        // set class (value : string | string[]) {
        //     this.attributes.class   = isString(value) ? value : value.join(' ')
        // }
        //
        //
        // $depth           : number    = undefined
        //
        // get depth () : number {
        //     if (this.$depth !== undefined) return this.$depth
        //
        //     let depth                   = 0
        //     let node : XmlElement       = this
        //
        //     while (node.parent) { node = node.parent; depth++ }
        //
        //     return this.$depth = depth
        // }
        //
        //
        // initialize (props? : Partial<XmlElement>) {
        //     super.initialize(props)
        //
        //     this.adoptChildren(this.childNodes)
        // }
        //
        //
        // adoptChildren (children : XmlNode[]) {
        //     children.forEach(child => {
        //         if (child instanceof XmlElement) child.parent = this
        //     })
        // }
        //
        //
        // toString () : string {
        //     const childrenContent       = this.childNodes.map(child => child.toString())
        //     const attributesContent     = this.$attributes
        //         ?
        //             Object.entries(this.attributes)
        //                 .filter(entry => entry[ 1 ] !== undefined)
        //                 .map(( [ name, value ] ) => name + '="' + escapeXml(String(value)) + '"')
        //         :
        //             []
        //
        //     // to have predictable order of attributes in tests
        //     attributesContent.sort()
        //
        //     return `<${ this.tagName }${ attributesContent.length > 0 ? ' ' + attributesContent.join(' ') : '' }>${ childrenContent.join('') }</${ this.tagName }>`
        // }
        //
        //
        // appendChild (...children : XmlNode[]) : XmlNode[] {
        //     this.childNodes.push(...children.flat(Number.MAX_SAFE_INTEGER))
        //
        //     this.adoptChildren(children)
        //
        //     return children
        // }
        //
        //
        // getAttribute<T extends keyof this[ 'props' ]> (name : T) : this[ 'props' ][ T ] {
        //     return this.$attributes ? this.attributes[ name ] : undefined
        // }
        //
        //
        // setAttribute<T extends keyof this[ 'props' ]> (name : T, value : this[ 'props' ][ T ]) {
        //     if (value === undefined) {
        //         delete this.attributes[ name ]
        //     } else
        //         this.attributes[ name ] = value
        // }
        //
        //
        // * parentAxis () : Generator<XmlElement> {
        //     let el : XmlElement     = this
        //
        //     while (el.parent) {
        //         yield el.parent
        //
        //         el                  = el.parent
        //     }
        // }
        //
        //
        // hasClass (clsName : string) : boolean {
        //     return saneSplit(this.attributes.class ?? '', /\s+/).some(cls => cls === clsName)
        // }
    }
){}

//---------------------------------------------------------------------------------------------------------------------
const escapeTable = {
    '&'     : '&amp;',
    '<'     : '&lt;',
    '>'     : '&gt;',
    '"'     : '&quot;',
    "'"     : '&apos;'
}

export const escapeXml = (xmlStr : string) : string => xmlStr.replace(/[&<>"']/g, match => escapeTable[ match ])


//---------------------------------------------------------------------------------------------------------------------
// TODO should probably be the opposite - Element should extend Fragment
//  (fragment only has child nodes, element adds the "shell" - tag name and attributes)
export class XmlFragment extends Mixin(
    [ XmlElement ],
    (base : ClassUnion<typeof XmlElement>) =>

    class XmlFragment extends base {
    }
){}
