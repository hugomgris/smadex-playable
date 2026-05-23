import {Container, Graphics, Sprite} from 'pixi.js'
import type { Particle, SceneLayers } from './types'
import { VIEWPORT_W, VIEWPORT_H, MAX_PARTICLES } from './constants'

export function applyVignette(bgLayer: Container): void {
    const steps = 24    // 24 steps to make bands invisible at this scale
	const sectionH = VIEWPORT_H * 0.45 / steps
	for (let i = 0; i < steps; i++) {
		const band = new Graphics()
		const alpha = (i / (steps - 1)) * 0.55
		band.rect(0, VIEWPORT_H * 0.55 + i * sectionH, VIEWPORT_W, sectionH)
			.fill({ color: 0x000000, alpha })
		bgLayer.addChild(band)
	}
}

export function spawnBurst(fxLayer: Container, particles: Particle[], x: number, y: number, count = 12, colorA = 0xa78bfa, colorB = 0x60a5fa) {
	const capped = Math.min(MAX_PARTICLES - particles.length, count)
	for (let i = 0; i < capped; i++) {
		const g = new Graphics()
		const size = 2 + Math.random() * 5
		const angle = (Math.PI * 2 * i) / capped + Math.random() * 0.4
		const speed = 3 + Math.random() * 5
		g.circle(0, 0, size).fill(i % 2 === 0 ? colorA : colorB)
		g.position.set(x, y)
		fxLayer.addChild(g)
		particles.push({
		graphic: g,
		vx: Math.cos(angle) * speed,
		vy: Math.sin(angle) * speed - 1.5,
		life: 30 + Math.random() * 20,
		age: 0,
		rotation: Math.random() * Math.PI * 2,
		rotationSpeed: (Math.random() - 0.5) * 0.3,
		})
	}
}

export function shake(state: { shakeStrength: number, shakeTime: number }, strength = 8, duration = 14) {
	state.shakeStrength = strength
	state.shakeTime = duration
}

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value))
}

export function easeOut(t: number): number {
	return 1 - Math.pow(1 - t, 3)
}

export function tween(
	target: Record<string, number>,
	prop: string,
	to: number,
	duration: number,
	easing: (t: number) => number = (t) => t,
): Promise<void> {
	return new Promise((resolve) => {
		const from = target[prop]
		const start = performance.now()
		function step () {
			const elapsed = performance.now() - start
			const t = clamp(elapsed / duration, 0, 1)
			target[prop] = lerp(from, to, easing(t))
			if (t < 1) requestAnimationFrame(step)
				else resolve()
		}
		requestAnimationFrame(step)
	})
}

export async function reveal(sprite: Sprite, targetY: number, duration = 380): Promise<void> {
	Promise.all([
		tween(sprite as unknown as Record<string, number>, 'alpha', 1, duration, easeOut),
		tween(sprite as unknown as Record<string, number>, 'y', targetY, duration, easeOut),
	]).then()
}

export function makeSleeping(layers: SceneLayers, alias: string, y: number, scale = 1.0, centerX: number): Sprite {
	const s = Sprite.from(alias)
	s.anchor.set(0.5, 0.5)
	s.position.set(centerX, y + 24)   // 24 px below final resting place
	s.scale.set(scale)
	s.alpha = 0
	layers.ctaLayer.addChild(s)
	return s
}