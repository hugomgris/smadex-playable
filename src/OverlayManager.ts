import { Sprite, Texture, AnimatedSprite, Rectangle, Assets } from 'pixi.js'
import { VIEWPORT_W, VIEWPORT_H, ENEMY_X, ENEMY_Y, ENEMY_HP } from './constants'
import { tween, easeOut, spawnBurst, shake, reveal, makeSleeping } from './vfx'
import type { HeroParts } from './types'
import type { EnemyManager, EnemyManagerState } from './EnemyManager'

export class OverlayManager {
    s: EnemyManagerState;
    hero: HeroParts;
    swordPickup: Sprite;
    swordGlow: Sprite;
    skillPickup: Sprite;
    skillGlow: Sprite;
    enemyManager: EnemyManager;

    constructor(
        s: EnemyManagerState,
        hero: HeroParts,
        pickups: { swordPickup: Sprite, swordGlow: Sprite, skillPickup: Sprite, skillGlow: Sprite },
        enemyManager: EnemyManager
    ) {
        this.s = s;
        this.hero = hero;
        this.swordPickup = pickups.swordPickup;
        this.swordGlow = pickups.swordGlow;
        this.skillPickup = pickups.skillPickup;
        this.skillGlow = pickups.skillGlow;
        this.enemyManager = enemyManager;

        this.onSwordTap = this.onSwordTap.bind(this);
        this.onSkillTap = this.onSkillTap.bind(this);
    }

    setupTutorialHand(): void {
        const tutorialHand = Sprite.from('hand')
        tutorialHand.anchor.set(0.1, 0.1)
        tutorialHand.position.set(ENEMY_X + 60, ENEMY_Y - 40)
        tutorialHand.scale.set(0.5)
        tutorialHand.alpha = 0
        tutorialHand.eventMode = 'none'
        this.s.layers.overlayLayer.addChild(tutorialHand)
        this.s.tutorialHand = tutorialHand
    }

    async showSwordPickup(): Promise<void> {
        this.s.phase = 'gear'

        this.swordPickup.visible = true
        this.swordGlow.visible = true

        await Promise.all([
            tween(this.swordGlow as unknown as Record<string, number>, 'alpha', 0.7, 400, easeOut),
            tween(this.swordPickup as unknown as Record<string, number>, 'alpha', 1, 300, easeOut)
        ])

        this.swordPickup.eventMode = 'static'
        this.swordPickup.cursor = 'pointer'
        this.swordPickup.on('pointerdown', this.onSwordTap)
    }

    private async onSwordTap(): Promise<void> {
        this.swordPickup.removeAllListeners()
        this.swordPickup.eventMode = 'none'

        await Promise.all([
            tween(this.swordPickup.scale as unknown as Record<string, number>, 'x', 0.8, 120, easeOut),
            tween(this.swordPickup.scale as unknown as Record<string, number>, 'y', 0.8, 120, easeOut),
        ])

        const heroX = this.hero.body.x + this.hero.root.x
        const heroY = this.hero.body.y + this.hero.root.y

        await Promise.all([
            tween(this.swordPickup as unknown as Record<string, number>, 'x', heroX, 380, easeOut),
            tween(this.swordPickup as unknown as Record<string, number>, 'y', heroY, 380, easeOut),
            tween(this.swordPickup as unknown as Record<string, number>, 'alpha', 0, 380, easeOut),
            tween(this.swordGlow as unknown as Record<string, number>, 'alpha', 0, 250, easeOut),
        ])

        this.hero.head1.alpha = 0.0
        this.hero.head2.alpha = 1.0
        this.hero.sword1.alpha = 0.0
        this.hero.sword2.alpha = 1.0
        this.hero.leftShoulder.alpha = 1
        this.hero.rightShoulder.alpha = 1

        spawnBurst(this.s.layers.fxLayer, this.s.particles, heroX, heroY, 16, 0xfbbf24, 0xf97316)

        this.swordPickup.position.set(VIEWPORT_W / 2, VIEWPORT_H / 2 + 60)
        this.swordPickup.scale.set(0.6)
        this.swordPickup.visible = false
        this.swordGlow.visible = false

        this.s.phase = 'battle'
        this.enemyManager.setInteractive(true)
    }

    async showSkillPickup(): Promise<void> {
        this.s.phase = 'boss'

        this.skillPickup.visible = true
        this.skillGlow.visible = true

        await Promise.all([
            tween(this.skillGlow as unknown as Record<string, number>, 'alpha', 0.8, 400, easeOut),
            tween(this.skillPickup.scale as unknown as Record<string, number>, 'x', 0.6, 500, easeOut),
            tween(this.skillPickup.scale as unknown as Record<string, number>, 'y', 0.6, 500, easeOut),
            tween(this.skillPickup as unknown as Record<string, number>, 'alpha', 1, 300, easeOut)
        ])

        this.skillPickup.eventMode = 'static'
        this.skillPickup.cursor = 'pointer'
        this.skillPickup.on('pointerdown', this.onSkillTap)
    }

    private async onSkillTap(): Promise<void> {
        this.skillPickup.removeAllListeners()
        this.skillPickup.eventMode = 'none'

        await Promise.all([
            tween(this.skillPickup.scale as unknown as Record<string, number>, 'x', 0.9, 120, easeOut),
            tween(this.skillPickup.scale as unknown as Record<string, number>, 'y', 0.9, 120, easeOut),
        ])

        await Promise.all([
            tween(this.skillPickup as unknown as Record<string, number>, 'alpha', 0, 250, easeOut),
            tween(this.skillGlow as unknown as Record<string, number>, 'alpha', 0, 250, easeOut),
        ])

        this.skillPickup.visible = false
        this.skillGlow.visible = false

        const lightningBase = Assets.get<Texture>('lightning_animation')
        const LIGHTNING_FRAMES = 5
        const frameW = Math.floor(lightningBase.width / LIGHTNING_FRAMES)
        const lightningTextures: Texture[] = Array.from({ length: LIGHTNING_FRAMES }, (_, i) =>
            new Texture({
                source: lightningBase.source,
                frame:  new Rectangle(i * frameW, 0, frameW, lightningBase.height),
            }),
        )

        const lightning = new AnimatedSprite(lightningTextures)
        lightning.anchor.set(0.5, 0.9)
        lightning.position.set(ENEMY_X, ENEMY_Y)
        lightning.animationSpeed = 0.4
        lightning.loop = false
        lightning.onComplete = () => lightning.destroy()
        this.s.layers.fxLayer.addChild(lightning)
        lightning.play()

        await new Promise(resolve => setTimeout(resolve, 150))

        spawnBurst(this.s.layers.fxLayer, this.s.particles, ENEMY_X, ENEMY_Y - 40, 30, 0x60a5fa, 0xffffff)
        shake(this.s.shakeState, 14, 20)

        this.s.enemyHp = 0
        this.enemyManager.updateHealthBar(0, ENEMY_HP[2])

        const bossSprite = this.s.enemySprites[2]
        await this.enemyManager.killEnemy(bossSprite)

        console.log("Win condition triggered")
        await this.showCTAScreen()
    }

    public async showCTAScreen(): Promise<void> {
        this.s.phase = 'cta'

        // step: fade in CTA background
        const ctaBg = Sprite.from('cta_background')
        ctaBg.anchor.set(0.5, 0.5)
        ctaBg.position.set(VIEWPORT_W / 2, VIEWPORT_H / 2)
        const bgScale = Math.max(VIEWPORT_W / ctaBg.texture.width, VIEWPORT_H / ctaBg.texture.height)
        ctaBg.scale.set(bgScale)
        ctaBg.alpha = 0
        this.s.layers.ctaLayer.addChild(ctaBg)

        const topLeftCorner = Sprite.from('cta_top_left_corner')
        topLeftCorner.anchor.set(0, 0)
        topLeftCorner.position.set(0, 0)
        topLeftCorner.alpha = 0
        this.s.layers.ctaLayer.addChild(topLeftCorner)

        const bottomRightCorner = Sprite.from('cta_bottom_right_corner')
        bottomRightCorner.anchor.set(1, 1)
        bottomRightCorner.position.set(VIEWPORT_W, VIEWPORT_H)
        bottomRightCorner.alpha = 0
        this.s.layers.ctaLayer.addChild(bottomRightCorner)

        await Promise.all([
            tween(this.s.layers.world as unknown as Record<string, number>, 'alpha', 0, 500, easeOut),
            tween(ctaBg as unknown as Record<string, number>, 'alpha', 1, 500, easeOut),
            tween(topLeftCorner as unknown as Record<string, number>, 'alpha', 1, 500, easeOut),
            tween(bottomRightCorner as unknown as Record<string, number>, 'alpha', 1, 500, easeOut),
        ])

        // step 2: render CTA content
        await this.showCTAContent()
    }

    private async showCTAContent(): Promise<void> {
        const centerX = VIEWPORT_W / 2

        const SPACING   = 210
        const downloadY = VIEWPORT_H / 2
        const logoY     = downloadY - SPACING - 30
        const claimY    = downloadY + SPACING - 30

        const logo     = makeSleeping(this.s.layers, 'cta_logo',     logoY,     1.0, centerX)
        const download = makeSleeping(this.s.layers, 'cta_download',  downloadY, 0.8, centerX)
        const claim    = makeSleeping(this.s.layers, 'cta_claim',    claimY,    1.0, centerX)

        // Wire up the download button
        download.eventMode = 'static'
        download.cursor = 'pointer'
        download.on('pointerdown', () => console.log('ACQUIRING USER!'))

        // Staggered reveal: logo first, then download, then claim
        const STAGGER = 120
        await reveal(logo, logoY)
        await new Promise(r => setTimeout(r, STAGGER))
        await reveal(download, downloadY)
        await new Promise(r => setTimeout(r, STAGGER))
        await reveal(claim, claimY)
    }

    tick(idleTime: number): void {
        if (this.s.phase === 'gear' && this.swordPickup.visible) {
            const pickupScale = 0.6 + Math.sin(idleTime * 4) * 0.05
            this.swordPickup.scale.set(pickupScale)
        }

        if (this.s.phase === 'boss' && this.skillPickup.visible) {
            const pickupScale = 0.6 + Math.sin(idleTime * 4) * 0.05
            this.skillPickup.scale.set(pickupScale)
        }

        if (this.s.tutorialHand && !this.s.tutorialHand.destroyed) {
            const handScale = 0.5 + Math.sin(idleTime * 4) * 0.05
            this.s.tutorialHand.scale.set(handScale)
        }
    }
}