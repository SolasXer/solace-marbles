import { _decorator, Component, EventTouch, Node, toDegree, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Line')
export class Line extends Component {
    @property(Node) image: Node;

    private _touchedPos = new Vec3();
    private _transform: UITransform;
    private _tmp2 = new Vec2();
    private _tmp3 = new Vec3();
    private _onRadianSelected: (radian: number) => void;
    private _target: any;
    private _rad: number = 0;

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this._transform = this.node.getComponent(UITransform);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    onTouchStart() {

    }

    onTouchMove(event: EventTouch) {
        event.getUILocation(this._tmp2);
        this._tmp3.set(this._tmp2.x, this._tmp2.y, 0);
        this._transform.convertToNodeSpaceAR(this._tmp3, this._touchedPos);

        this._rad = Math.atan2(this._touchedPos.y - 0, this._touchedPos.x - 0);
        this.image.angle = toDegree(this._rad);
    }

    onTouchEnd() {
        this._onRadianSelected?.apply(this._target, [this._rad]);
    }

    onTouchCancel() {

    }

    onRadianSelected(onRadianSelected: (radian: number) => void, target?: any) {
        this._onRadianSelected = onRadianSelected;
        this._target = target;
    }
}
