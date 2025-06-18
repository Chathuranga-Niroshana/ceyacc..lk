export const getColorForScore = (score) => {
    if (score > 100 && score < 120) {
        return 'linear-gradient(45deg, #00c853, #64dd17, #aeea00)';
    }
    if (score > 120 && score < 150) {
        return 'linear-gradient(45deg, #ff9800, #ffb74d, #ffd54f)';
    }
    return 'linear-gradient(45deg, #f44336, #ff5252, #ff8a80)';
};
