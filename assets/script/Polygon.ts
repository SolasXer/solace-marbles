import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Polygon')
export class Polygon extends Component {
    private _text: Label;
    private _life: number = 0;

    public get life(): number {
        return this._life;
    }

    public set life(value: number) {
        this._life = value;
        this._text.string = `${this._life}`;
    }

    protected onLoad(): void {
        this._text = this.node.getChildByName('Text').getComponent(Label);
    }

    protected onEnable(): void {
        this.life = 10;
    }

    protected onDisable(): void {

    }

    start() {

    }

    update(deltaTime: number) {

    }
}
