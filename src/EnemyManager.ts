// enemyManager.ts
import { Sprite } from 'pixi.js'
import { ENEMY_X, ENEMY_Y, ENEMY_HP, hbKeys, trackerKeys, enemyKeys } from './constants'
import type { SceneLayers } from './types'
import { tween, easeOut, spawnBurst, shake } from './vfx'
import type { Particle } from './types'

export interface EnemyManagerState {
	layers: SceneLayers
	round: number
	enemyHp: number
	enemySprites: Sprite[]
	trackerIcons: Sprite[]
	healthBars: Sprite[]
	currentHealthbarIndex: number
	particles: Particle[]
	shakeState: { shakeStrength: number, shakeTime: number }
	phase: string
	tutorialHand?: Sprite | null
}

export class EnemyManager {
	private s: EnemyManagerState
	private onRoundCleared: (nextRound: number) => Promise<void>

	constructor(state: EnemyManagerState, onRoundCleared: (nextRound: number) => Promise<void>) {
		this.s = state
		this.onRoundCleared = onRoundCleared
	}

	buildEnemies(): void {
		for (let i = 0; i < trackerKeys.length; ++i) {
			const enemy = Sprite.from(enemyKeys[i])
			enemy.anchor.set(0.5, 0.5)
			enemy.scale.set(0.8)
			enemy.position.set(ENEMY_X, ENEMY_Y)
			enemy.alpha = i === 0 ? 1.0 : 0.0
			enemy.eventMode = i === 0 ? 'static' : 'none'
			this.s.layers.enemyLayer.addChild(enemy)
			this.s.enemySprites.push(enemy)
		}
	}

	setInteractive(active: boolean): void {
		const sprite = this.s.enemySprites[this.s.round]
		sprite.eventMode = active ? 'static' : 'none'
		sprite.cursor = active ? 'pointer' : 'default'
		if (active) {
			sprite.on('pointerdown', this.onTap)
		} else {
			sprite.removeAllListeners()
		}
	}

	private onTap = async (): Promise<void> => {
		const { s } = this
		if (!s.layers || s.phase === 'win') return

		if (s.tutorialHand) {
			tween(s.tutorialHand as unknown as Record<string, number>, 'alpha', 0, 200, easeOut).then(() => {
				s.tutorialHand?.destroy()
				s.tutorialHand = null
			})
		}

		const sprite = s.enemySprites[s.round]
		const hitX = sprite.x
		const hitY = sprite.y - sprite.height * 0.5

		spawnBurst(s.layers.fxLayer, s.particles, hitX, hitY, 10)
		shake(s.shakeState, 6 + s.round * 2, 10)

		if (s.enemyHp > 1) {
			const ex = sprite.x
			tween(sprite as unknown as Record<string, number>, 'x', ex + 14, 60, easeOut).then(() =>
				tween(sprite as unknown as Record<string, number>, 'x', ex, 120, easeOut)
			)
		}

		s.enemyHp -= 1
		this.updateHealthBar(s.enemyHp, ENEMY_HP[s.round])

		if (s.round === 2 && s.enemyHp <= Math.floor(ENEMY_HP[2] / 2)) {
			this.setInteractive(false)
			await this.onRoundCleared(s.round)
			return
		}

		if (s.enemyHp > 0) return

		this.setInteractive(false)

		if (s.round === 0 || s.round === 1) {
			const completedRound = s.round
			await this.killEnemy(sprite)
			await this.transitionToRound((s.round + 1) as 1 | 2)
			await this.onRoundCleared(completedRound)
		} else if (s.round === 2) {
			const completedRound = s.round
			// await this.killEnemy(sprite) // let the lightning skill kill the boss!
			await this.onRoundCleared(completedRound)
		}
	}

	async killEnemy(sprite: Sprite): Promise<void> {
		const ex = sprite.x
		await tween(sprite as unknown as Record<string, number>, 'x', ex + 20, 60, easeOut)
		await tween(sprite as unknown as Record<string, number>, 'x', ex, 120, easeOut)

		await Promise.all([
			tween(sprite as unknown as Record<string, number>, 'alpha', 0, 300, easeOut),
			tween(sprite.scale as unknown as Record<string, number>, 'y', 0.3, 300, easeOut),
		])

		sprite.position.set(ENEMY_X, ENEMY_Y)
		sprite.scale.set(0.8)
		sprite.alpha = 0
		sprite.eventMode = 'none'
	}

	async transitionToRound(nextRound: 1 | 2): Promise<void> {
		const { s } = this
		s.trackerIcons[s.round].alpha = 0.35

		s.round = nextRound
		s.enemyHp = ENEMY_HP[nextRound]

		s.healthBars[s.currentHealthbarIndex].alpha = 0
		s.currentHealthbarIndex = hbKeys.indexOf('health_bar_full')
		s.healthBars[s.currentHealthbarIndex].alpha = 1

		const next = s.enemySprites[nextRound]
		next.position.set(ENEMY_X, ENEMY_Y)
		next.scale.set(0.6)
		next.alpha = 0
		next.eventMode = 'none'

		await Promise.all([
			tween(s.trackerIcons[nextRound] as unknown as Record<string, number>, 'alpha', 1, 500, easeOut),
			tween(next as unknown as Record<string, number>, 'alpha', 1, 500, easeOut),
			tween(next.scale as unknown as Record<string, number>, 'x', 0.75, 500, easeOut),
			tween(next.scale as unknown as Record<string, number>, 'y', 0.75, 500, easeOut),
		])
	}

	updateHealthBar(hp: number, maxHp: number): void {
		const { s } = this
		s.healthBars[s.currentHealthbarIndex].alpha = 0

		const ratio = hp / maxHp
		let key: typeof hbKeys[number]
		if (ratio <= 0)         key = 'health_bar_empty'
		else if (ratio <= 0.33) key = 'health_bar_one_third'
		else if (ratio <= 0.5)  key = 'health_bar_half'
		else if (ratio <= 0.75) key = 'health_bar_two_thirds'
		else                    key = 'health_bar_full'

		s.currentHealthbarIndex = hbKeys.indexOf(key)
		s.healthBars[s.currentHealthbarIndex].alpha = 1
	}
}