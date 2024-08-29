import { rimraf } from 'rimraf';
import { glob } from 'glob';

glob('www/favicons/**/*')
  .then(files => {
    rimraf(files)
      .then(() => {
        console.log('Favicons removed', files);
      });
  })


// rimraf('www/favicons/**/*', { glob: true }).then((files, files2) => {
//   console.log('Favicons removed', files, files2);
// });