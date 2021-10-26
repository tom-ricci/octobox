module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    module: {
      rules: [
        {
          test: /\.tsx$/,
          use: 'glob-import-loader'
        },
      ]
    }
  }
}