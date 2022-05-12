module.exports = {
  moduleNameMapper: {
    '^.+\\.scss$': '<rootDir>/tests/jest-mock-styles.js',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.html?$': 'html-loader-jest',
    '^.+\\.svg?$': 'html-loader-jest',
    // '^.+\\.css$': 'jest-transform-scss',
    // '^.+\\.scss$': 'jest-transform-scss',
  },
};