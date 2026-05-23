import { Container, Sprite, Graphics } from 'pixi.js'

export interface SceneLayers {
    world: Container
    bgLayer: Container
    arenaLayer: Container
    enemyLayer: Container
    heroLayer: Container
    fxLayer: Container
    uiLayer: Container
    overlayLayer: Container
    ctaLayer: Container
}

export interface HeroParts {
    root: Container;
    cape: Sprite;
    leftArm: Sprite;
    body: Sprite;
    sword1: Sprite;
    sword2: Sprite,
    rightArm: Sprite;
    head1: Sprite;
    head2: Sprite;
    rightShoulder: Sprite
    leftShoulder: Sprite
}

export interface Particle {
    graphic: Graphics
    vx: number
    vy: number
    life: number
    age: number
    rotation: number
    rotationSpeed: number
}
