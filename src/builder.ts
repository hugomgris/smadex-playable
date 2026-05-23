import { Application, Container, Sprite } from 'pixi.js'
import type { SceneLayers, HeroParts } from './types'
import { applyVignette } from './vfx'
import {
	VIEWPORT_W, VIEWPORT_H,
	hbKeys, trackerKeys, heroKeys,
} from './constants'


export function buildScene(app: Application): SceneLayers {
	const world = new Container()			// shakes & other window-wide effects
	const bgLayer = new Container()
	const arenaLayer = new Container()
	const enemyLayer = new Container()
	const heroLayer = new Container()		
	const fxLayer = new Container()			// hit effects
	const uiLayer = new Container()			// health bar, tracker
	const overlayLayer	= new Container() 	// tutorial hand, pickup icons, end card
	const ctaLayer = new Container()

	world.addChild(bgLayer, arenaLayer, enemyLayer, heroLayer, fxLayer, uiLayer, overlayLayer)
	app.stage.addChild(world, ctaLayer)
	app.stage.eventMode = 'static'

	return { world, bgLayer, arenaLayer, enemyLayer, heroLayer, fxLayer, uiLayer, overlayLayer, ctaLayer }
}

export function buildBackground(layers: SceneLayers): void {
	const bg = Sprite.from('arena_bg')

	bg.anchor.set(0.5, 0.5)
	bg.position.set(VIEWPORT_W / 2, VIEWPORT_H / 2)

	const scale = Math.max(VIEWPORT_W / bg.texture.width, VIEWPORT_H / bg.texture.height)
	bg.scale.set(scale)

	layers.bgLayer.addChild(bg)

	applyVignette(layers.bgLayer)
}

export function buildUI(layers: SceneLayers, trackerIcons: Sprite[], healthBars: Sprite[]): void {
	// UI - logo
	const logo = Sprite.from('logo_white')
	logo.anchor.set(0, 0)
	logo.position.set(10, 10)
	logo.scale.set(0.45)
	layers.uiLayer.addChild(logo)

	// UI - enemy trackers
	const trackerX = VIEWPORT_W - 14 - 120
	const trackerY = 20

	for (let i = 0; i < trackerKeys.length; ++i) {
		const ico = Sprite.from(trackerKeys[i])
		ico.anchor.set(1, 0)
		ico.scale.set(0.28)
		ico.position.set(trackerX + i * 60, trackerY)
		ico.alpha = i === 0 ? 1.0 : 0.35
		layers.uiLayer.addChild(ico)
		trackerIcons.push(ico)
	}

	// UI - healthbars
	const hbx = VIEWPORT_W / 2
	const hby = VIEWPORT_H / 6 - 10

	for (let i = 0; i < hbKeys.length; i++) {
		const bar = Sprite.from(hbKeys[i])
		bar.anchor.set(0.5, 0.5)
		bar.scale.set(0.8)
		bar.position.set(hbx, hby)
		bar.alpha = 0
		layers.uiLayer.addChild(bar)
		healthBars.push(bar)
	}
}

export function buildHero(layers: SceneLayers): HeroParts {
	const root = new Container()

	const cape = Sprite.from(heroKeys[0])
	cape.anchor.set(0.5, 0.5)
	cape.scale.set(1.0)
	cape.position.set(50, VIEWPORT_H + 50)
	cape.alpha = 1.0

	const leftArm = Sprite.from(heroKeys[1])
	leftArm.anchor.set(0.5, 0.5)
	leftArm.scale.set(1.0)
	leftArm.position.set(220, VIEWPORT_H - 100)
	leftArm.rotation = -Math.PI / 6;
	leftArm.alpha = 1.0

	const body = Sprite.from(heroKeys[2])
	body.anchor.set(0.5, 0.5)
	body.scale.set(1.0)
	body.position.set(110, VIEWPORT_H - 120)
	body.alpha = 1.0

	const sword1 = Sprite.from(heroKeys[5])
	sword1.anchor.set(0.5, 0.5)
	sword1.scale.set(0.7)
	sword1.position.set(200, VIEWPORT_H - 110)
	sword1.rotation = -Math.PI / 4;
	sword1.alpha = 1.0

	const sword2 = Sprite.from(heroKeys[6])
	sword2.anchor.set(0.5, 0.5)
	sword2.scale.set(0.8)
	sword2.position.set(220, VIEWPORT_H - 160)
	sword2.rotation = -Math.PI / 3.5;
	sword2.alpha = 0.0

	const rightArm = Sprite.from(heroKeys[7])
	rightArm.anchor.set(0.5, 0.5)
	rightArm.scale.set(1.0)
	rightArm.position.set(80, VIEWPORT_H - 110)
	//rightArm.rotation = -Math.PI / 6;
	rightArm.alpha = 1.0

	const head1 = Sprite.from(heroKeys[3])
	head1.anchor.set(0.5, 0.5)
	head1.scale.set(1.0)
	head1.position.set(90, VIEWPORT_H - 230)
	//head1.rotation = -Math.PI / 6;
	head1.alpha = 1.0
	
	const head2 = Sprite.from(heroKeys[4])
	head2.anchor.set(0.5, 0.5)
	head2.scale.set(1.2)
	head2.position.set(87, VIEWPORT_H - 235)
	//head1.rotation = -Math.PI / 6;
	head2.alpha = 0.0

	const rightShoulder = Sprite.from(heroKeys[8])
	rightShoulder.anchor.set(0.5, 0.5)
	rightShoulder.scale.set(1.0)
	rightShoulder.position.set(20, VIEWPORT_H - 200)
	rightShoulder.rotation = -Math.PI / 8
	rightShoulder.alpha = 0.0

	const leftShoulder = Sprite.from(heroKeys[8])
	leftShoulder.anchor.set(0.5, 0.5)
	leftShoulder.scale.set(1.0)
	leftShoulder.scale.x *= -1
	leftShoulder.position.set(175, VIEWPORT_H - 200)
	leftShoulder.rotation = Math.PI / 8
	leftShoulder.alpha = 0.0

	root.addChild(cape, leftShoulder, leftArm, rightShoulder, body, sword1, sword2, rightArm, head1, head2)
	
	layers.heroLayer.addChild(root)

	return {
		root,
		cape,
		leftArm,
		body,
		sword1, sword2,
		rightArm,
		head1, head2,
		rightShoulder, leftShoulder }
}

export function buildPickups(layers: SceneLayers): { swordPickup: Sprite, swordGlow: Sprite, skillPickup: Sprite, skillGlow: Sprite } {
	const swordGlow = Sprite.from('glow_radial_1')
	swordGlow.anchor.set(0.5, 0.5)
	swordGlow.position.set(VIEWPORT_W / 2, VIEWPORT_H / 2)
	swordGlow.scale.set(1.5)
	swordGlow.alpha = 0
	swordGlow.visible = false
	layers.overlayLayer.addChild(swordGlow)

	const swordPickup = Sprite.from('sword_icon')
	swordPickup.anchor.set(0.5, 0.5)
	swordPickup.position.set(VIEWPORT_W / 2, VIEWPORT_H / 2)
	swordPickup.scale.set(0.6)
	swordPickup.alpha = 0
	swordPickup.visible = false
	swordPickup.eventMode = 'none'
	layers.overlayLayer.addChild(swordPickup)

	const skillGlow = Sprite.from('glow_radial_2')
	skillGlow.anchor.set(0.5, 0.5)
	skillGlow.position.set(VIEWPORT_W / 2, VIEWPORT_H / 2)
	skillGlow.scale.set(1.5)
	skillGlow.alpha = 0
	skillGlow.visible = false
	layers.overlayLayer.addChild(skillGlow)

	const skillPickup = Sprite.from('skill_icon')
	skillPickup.anchor.set(0.5, 0.5)
	skillPickup.position.set(VIEWPORT_W / 2, VIEWPORT_H / 2)
	skillPickup.scale.set(0)
	skillPickup.alpha = 0
	skillPickup.visible = false
	skillPickup.eventMode = 'none'
	layers.overlayLayer.addChild(skillPickup)

	return { swordPickup, swordGlow, skillPickup, skillGlow }
}