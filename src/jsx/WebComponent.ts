import { Entity } from "@bryntum/chronograph/src/replica2/Entity.js"
import { ClassUnion, Mixin } from "@bryntum/chronograph/src/class/Mixin.js"


export class WebComponent extends Mixin(
    [ Entity, HTMLElement ],
    (base : ClassUnion<typeof HTMLElement, typeof Entity>) =>

    class WebComponent extends base {
    }
) {}


export const tag = (tagName : string) : ClassDecorator => {
    // @ts-ignore : https://github.com/Microsoft/TypeScript/issues/29828
    return <T extends typeof WebComponent>(target : T) : T => {
        customElements.define(tagName, target)

        return target
    }
}
