import { _decorator, Collider2D, Component, Contact2DType, Label, Node, PhysicsSystem2D, RigidBody2D, tween, Vec2 } from 'cc';
import { GroupType } from './Const';
import { Line } from './Line';
import { Polygon } from './Polygon';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    @property(Node) line: Node;
    @property(Node) polygons: Node;
    @property(Node) score: Node;

    @property(Node) balls: Node;

    private _isBallRunning: boolean = false; // 是否在运动
    private _score: number = 0;

    protected onEnable(): void {
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    protected onDisable(): void {
        PhysicsSystem2D.instance.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        PhysicsSystem2D.instance.off(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    start() {
        this._score = 0;
        this.updateScoreText();

        this.line.getComponent(Line).onRadianSelected((rad: number) => {
            if (!this._isBallRunning) {
                this._isBallRunning = true;

                for (let i = 0; i < this.balls.children.length; i++) {
                    this.scheduleOnce(() => {
                        this.balls.children[i].getComponent(RigidBody2D).gravityScale = 2;
                        let speed = 10;
                        let x = Math.cos(rad) * speed;
                        let y = Math.sin(rad) * speed;
                        this.balls.children[i].getComponent(RigidBody2D).linearVelocity = new Vec2(x, y);
                    }, 0.2 * i);
                }

            }
        });
    }

    update(deltaTime: number) {
        if (this._isBallRunning) {
            let finished = true;
            this.balls.children.forEach(ball => {
                if (ball.position.y > -500) {
                    finished = false;
                }
            });

            if (finished) {
                this._isBallRunning = false;
                this.onThisRoundEnd();
            }
        }
    }

    private updateScoreText() {
        this.score.getComponent(Label).string = `${this._score}`;
    }

    private onThisRoundEnd() {
        for (let i = 0; i < this.balls.children.length; i++) {
            let ball = this.balls.children[i];
            ball.getComponent(RigidBody2D).linearVelocity = Vec2.ZERO;
            ball.getComponent(RigidBody2D).gravityScale = 0;
        }

        let acts: Promise<void>[] = [];

        this.polygons.children.forEach(child => {
            let pos = child.position.clone();
            pos.y += 30;
            acts[acts.length] = new Promise<void>((resolve) => {
                tween(child)
                    .to(0.5, { position: pos }, { easing: 'expoOut' })
                    .call(() => {
                        resolve();
                    })
                    .start();
            });
        });

        Promise.all(acts).then(() => {
            for (let i = 0; i < this.balls.children.length; i++) {
                let ball = this.balls.children[i];
                ball.setPosition(0, 290, ball.position.z)
            }
        });
    }

    private onBeginContact(oneCollider: Collider2D, otherCollider: Collider2D) {
        if (oneCollider.group === GroupType.BALL && otherCollider.group === GroupType.POLYGON) {
            otherCollider.node.getComponent(Polygon).life--;
            this._score++;
            this.updateScoreText();
        }
    }

    private onEndContact(oneCollider: Collider2D, otherCollider: Collider2D) {

    }
}
