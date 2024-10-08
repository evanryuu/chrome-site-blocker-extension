import { RsbuildPlugin } from '@rsbuild/core';
import fs from 'fs-extra';
import path from 'path';

export const copyPlugin: RsbuildPlugin = {
  name: 'copy-plugin',
  setup(api) {
    api.modifyRsbuildConfig((config) => {
      const mode = config.mode;
      const isDevMode = mode === 'development';

      const copyFiles = () => {
        const distPath = path.resolve('dist');
        console.log(`Copying files to: ${distPath}`);

        // Ensure the directory existsx
        fs.ensureDirSync(distPath);

        // Copy manifest file
        const manifestSrc = path.resolve(`src/manifest.${mode}.json`);
        const manifestDest = path.join(distPath, 'manifest.json');
        console.log(`Copying manifest from ${manifestSrc} to ${manifestDest}`);
        if (fs.existsSync(manifestSrc)) {
          fs.copySync(manifestSrc, manifestDest);
          console.log('Manifest file copied successfully');
        } else {
          console.error(`Manifest file not found: ${manifestSrc}`);
        }

        // Only copy additional files in development mode
        if (isDevMode) {
          // Clean specific directories instead of the entire dist folder
          fs.emptyDirSync(path.join(distPath, 'js'));
          fs.emptyDirSync(path.join(distPath, 'css'));

          // Copy public folder
          const publicSrc = path.resolve('public');
          console.log(`Copying public folder from ${publicSrc} to ${distPath}`);
          if (fs.existsSync(publicSrc)) {
            fs.copySync(publicSrc, distPath, { overwrite: true });
            console.log('Public folder copied successfully');
          } else {
            console.error(`Public folder not found: ${publicSrc}`);
          }
        }
      };

      // Run copyFiles after build for both dev and prod modes
      api.onAfterBuild(() => {
        console.log('Running copyFiles after build');
        copyFiles();
      });

      return config;
    });
  },
};
