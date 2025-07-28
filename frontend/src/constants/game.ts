export const GAME_CONFIG = {
    GRID_SIZES: {
        easy: { rows: 4, cols: 4, pairs: 8 },
        hard: { rows: 6, cols: 6, pairs: 18 }
    },
    TIMING: {
        CARD_FLIP_DELAY: 1000,
        TIMER_INTERVAL: 1000,
    },
    ANIMATION: {
        HOVER_SCALE: 1.05,
        ACTIVE_SCALE: 0.95,
        TRANSITION_DURATION: '300ms'
    }
} as const;

export const AVAILABLE_CARD_ICONS = Array.from({ length: 32 }, (_, i) => i + 1);
