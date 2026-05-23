import './style.css'
import { 
	Application,
	Assets,
	Sprite,
} from 'pixi.js'	

// Enemy manager class
import { EnemyManager } from './EnemyManager'

// Constants
import {
	VIEWPORT_W, VIEWPORT_H,
	ENEMY_HP,
	hbKeys,
	trackerKeys,
	enemyKeys,
	heroKeys
} from './constants'

// Types, Helpers && Interfaces
import { buildBackground, buildScene, buildUI, buildHero, buildPickups } from './builder'
import type { HeroParts, Particle, SceneLayers } from './types'
import { tween, easeOut } from './vfx'
import { OverlayManager } from './OverlayManager'

// Sprite containers
let layers: SceneLayers | null = null
let trackerIcons: Sprite[] = []
let healthBars: Sprite[] = []
let enemySprites: Sprite[] = []
let hero: HeroParts | null = null

// Asset import
import arena_bg from './assets/backgrounds/arena_bg.png'
import logo_white from './assets/logos/logo_white.png'
import enemy_1_icon from './assets/icons/enemy_1_icon.png'
import enemy_2_icon from './assets/icons/enemy_2_icon.png'
import enemy_3_icon from './assets/icons/enemy_3_icon.png'
import health_bar_empty from './assets/containers/health_bar_empty.png'
import health_bar_one_third from './assets/containers/health_bar_one_third.png'
import health_bar_half from './assets/containers/health_bar_half.png'
import health_bar_two_thirds from './assets/containers/health_bar_two_thirds.png'
import health_bar_full from './assets/containers/health_bar_full.png'
import enemy_1 from './assets/characters/enemy_1.png'
import enemy_2 from './assets/characters/enemy_2.png'
import enemy_3 from './assets/characters/enemy_3.png'
import hero_body from './assets/characters/hero_body.png'
import hero_cape from './assets/characters/hero_cape.png'
import hero_head_1 from './assets/characters/hero_head_1.png'
import hero_head_2 from './assets/characters/hero_head_2.png'
import hero_left_arm from './assets/characters/hero_left_arm.png'
import hero_right_arm from './assets/characters/hero_right_arm.png'
import hero_shoulder_level2 from './assets/characters/hero_shoulder_level2.png'
import hero_sword_1 from './assets/characters/hero_sword_1.png'
import hero_sword_2 from './assets/characters/hero_sword_2.png'
import sword_icon from './assets/icons/sword_icon.png'
import skill_icon from './assets/icons/skill_icon.png'
import glow_radial_1 from './assets/effects/glow_radial_1.png'
import glow_radial_2 from './assets/effects/glow_radial_2.png'
import lightning_animation from './assets/effects/lightning_animation.png'
import hand from './assets/hands/hand.png'

// CTA assets
import cta_background from "./assets/CTA/cta_bg.png"
import cta_top_left_corner from "./assets/CTA/cta_corner_top_left.png"
import cta_bottom_right_corner from "./assets/CTA/cta_corner_bottom_right.png"
import cta_logo from "./assets/CTA/cta_logo.png"
import cta_download from "./assets/CTA/cta_download.png"
import cta_claim from "./assets/CTA/cta_claim.png"

// State
const particles: Particle[] = []
const shakeState = { shakeStrength: 0, shakeTime: 0 }
let idleTime = 0

import type { EnemyManagerState } from './EnemyManager'
const sharedState: EnemyManagerState = {
	get layers() { return layers!; },
	set layers(v) { layers = v; },
	round: 0,
	enemyHp: 0,
	enemySprites,
	trackerIcons,
	healthBars,
	currentHealthbarIndex: -1,
	particles,
	shakeState,
	phase: 'battle'
}

// Managers
let enemyManager: EnemyManager | null = null
let overlayManager: OverlayManager | null = null

// App init
async function initApp(): Promise<Application> {
	const app = new Application()

	await app.init({
		width:				VIEWPORT_W,
		height:				VIEWPORT_H,
		antialias:			true,
		resolution:			1,	// higher densities hurt perfomance for no visual improvement at this scale
		autoDensity:		false,
		backgroundColor:	0x05080f,
	})

	document.getElementById('app')!.appendChild(app.canvas)

	return app
}


async function loadAssets(): Promise<void> {
	Assets.add({ alias: 'arena_bg', src: arena_bg })
	Assets.add({ alias: 'logo_white', src: logo_white})

	const trackerSrcs = [enemy_1_icon, enemy_2_icon, enemy_3_icon] as const
	for (let i = 0; i < trackerKeys.length; ++i) {
		Assets.add({ alias: trackerKeys[i], src: trackerSrcs[i]})
	}

	const hbSrcs = [
		health_bar_empty,
		health_bar_one_third,
		health_bar_half,
		health_bar_two_thirds,
		health_bar_full
	]
	for (let i = 0; i < hbKeys.length; i++) {
		Assets.add({ alias: hbKeys[i], src: hbSrcs[i]})
	}

	await Assets.load([
		'arena_bg',
		'logo_white',
		...trackerKeys,
		...hbKeys
	])

	const enemySrcs = [enemy_1, enemy_2, enemy_3]
	for (let i = 0; i < enemyKeys.length; ++i) {
		Assets.add({ alias: enemyKeys[i], src: enemySrcs[i] })
	}

	await Assets.load([...enemyKeys])

	const heroSrcs = [
		hero_cape,
		hero_left_arm,
		hero_body,
		hero_head_1,
		hero_head_2,
		hero_sword_1,
		hero_sword_2,
		hero_right_arm,
		hero_shoulder_level2
	]
	for (let i = 0; i < heroKeys.length; ++i) {
		Assets.add({ alias: heroKeys[i], src: heroSrcs[i] })
	}

	await Assets.load([...heroKeys])

	Assets.add({ alias: 'sword_icon',              src: sword_icon })
	Assets.add({ alias: 'glow_radial_1',           src: glow_radial_1 })
	Assets.add({ alias: 'skill_icon',              src: skill_icon })
	Assets.add({ alias: 'glow_radial_2',           src: glow_radial_2 })
	Assets.add({ alias: 'lightning_animation',     src: lightning_animation })
	Assets.add({ alias: 'hand',                    src: hand })
	Assets.add({ alias: 'cta_background',          src: cta_background })
	Assets.add({ alias: 'cta_top_left_corner',     src: cta_top_left_corner })
	Assets.add({ alias: 'cta_bottom_right_corner', src: cta_bottom_right_corner })
	Assets.add({ alias: 'cta_logo',                src: cta_logo })       // ← new
	Assets.add({ alias: 'cta_download',            src: cta_download })   // ← new
	Assets.add({ alias: 'cta_claim',               src: cta_claim })      // ← new

	await Assets.load([
		'sword_icon', 'glow_radial_1', 'skill_icon', 'glow_radial_2',
		'lightning_animation', 'hand',
		'cta_background', 'cta_top_left_corner', 'cta_bottom_right_corner',
		'cta_logo', 'cta_download', 'cta_claim',   // ← new
	])
}

async function startGame() {
	sharedState.phase = 'battle'
	sharedState.round = 0
	sharedState.enemyHp = ENEMY_HP[0]

	enemySprites[0].eventMode = 'static'
	enemySprites[0].cursor = 'pointer'

	// setup characters
	const first = enemySprites[0]
	first.alpha = 0
	first.scale.set(0.75)

    const initialHero = hero!.root
overlayManager!.setupTutorialHand()

	await Promise.all([
		tween(first as unknown as Record<string, number>, 'alpha', 1, 500, easeOut),
		tween(first.scale as unknown as Record<string, number>, 'x', 0.8, 500, easeOut),
		tween(first.scale as unknown as Record<string, number>, 'y', 0.8, 500, easeOut),
		tween(initialHero as unknown as Record<string, number>, 'alpha', 1, 500, easeOut),
		tween(sharedState.tutorialHand as unknown as Record<string, number>, 'alpha', 1, 500, easeOut)
	])

	let node: any = enemySprites[0]
	while (node) {
		console.log(node.constructor.name, '| eventMode:', node.eventMode, '| visible:', node.visible, '| alpha:', node.alpha)
		node = node.parent
	}

	enemyManager!.setInteractive(true)
}

function runGame(app: Application): void {
	app.ticker.add((ticker) => {
		const dt = ticker.deltaTime

		idleTime += dt * 0.04

		if (hero) {
			hero.root.y = Math.sin(idleTime) * 5
		}

		let currentEnemy = enemySprites[sharedState.round]
		if (currentEnemy) {
			const scaleSway = 0.8 + Math.sin(idleTime * 1.5) * 0.01
			currentEnemy.scale.set(scaleSway)
		}

		if (shakeState.shakeTime > 0) {
			if (!layers) return
			layers.world.x = (Math.random() - 0.5) * shakeState.shakeStrength
			layers.world.y = (Math.random() - 0.5) * shakeState.shakeStrength
			shakeState.shakeTime -= dt
		} else {
			layers?.world.position.set(0, 0)
		}

		for (let i = particles.length - 1; i >= 0; i--) {
			const p = particles[i]
			p.age += dt
			p.graphic.x += p.vx * dt * 0.6
			p.graphic.y += p.vy * dt * 0.6
			p.vy += 0.12 * dt
			p.vx *= 0.97
			p.graphic.alpha = Math.max(0, 1 - p.age / p.life)
			if (p.age >= p.life) {
				p.graphic.destroy()
				particles.splice(i, 1)
			}
		}

		if (overlayManager) {
			overlayManager.tick(idleTime)
		}
	})
}

function instantiateEnemyManager(): EnemyManager {
	const enemyManager = new EnemyManager(
		sharedState,
			async (completedRound) => {
				if (completedRound === 0) await overlayManager?.showSwordPickup()  // Phase 11
				if (completedRound === 1) { 
					enemyManager.setInteractive(true)
				}
				if (completedRound === 2) {
					await overlayManager?.showSkillPickup()
				}
			}
		)
	
		return enemyManager
}

function instantiateOverlayManager(): void {
	if (!layers) throw new Error('layers must be initialized before OverlayManager')
	const pickups = buildPickups(layers)
	overlayManager = new OverlayManager(sharedState, hero!, pickups, enemyManager!)
}

async function bootstrap() {
	const app = await initApp()

	layers = buildScene(app)
	sharedState.layers = layers

	enemyManager = instantiateEnemyManager()
	await loadAssets()

	buildBackground(layers)
	buildUI(layers, trackerIcons, healthBars)

	enemyManager.buildEnemies()
	sharedState.currentHealthbarIndex = hbKeys.indexOf('health_bar_full')
	healthBars[sharedState.currentHealthbarIndex].alpha = 1

	hero = buildHero(layers)
	
	instantiateOverlayManager()

	await startGame()

	runGame(app)
}

void bootstrap()