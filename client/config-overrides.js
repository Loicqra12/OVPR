module.exports = function override(config, env) {
  // Ajout de la règle pour gérer les fichiers d'images
  config.module.rules.push({
    test: /\.(png|jpe?g|gif)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/',
        },
      },
    ],
  });

  return config;
};
