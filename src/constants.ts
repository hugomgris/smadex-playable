export const VIEWPORT_W = 375
export const VIEWPORT_H = 812

export const ENEMY_HP = [2, 3, 4] as const
export const ENEMY_X = VIEWPORT_W / 2 - 20
export const ENEMY_Y = VIEWPORT_H / 2 - 40
export const hbKeys = [
    'health_bar_empty',
    'health_bar_one_third',
    'health_bar_half',
    'health_bar_two_thirds',
    'health_bar_full',
] as const

export const trackerKeys = ['enemy_1_icon', 'enemy_2_icon', 'enemy_3_icon'] as const

export const enemyKeys = ['enemy_1', 'enemy_2', 'enemy_3']

export const heroKeys = [
    'hero_cape',                // 0
    'hero_left_arm',            // 1
    'hero_body',                // 2
    'hero_head_1',              // 3
    'hero_head_2',              // 4
    'hero_sword_1',             // 5
    'hero_sword_2',             // 6
    'hero_right_arm',           // 7
    'hero_shoulder_level2'      // 8
]

export const MAX_PARTICLES = 64