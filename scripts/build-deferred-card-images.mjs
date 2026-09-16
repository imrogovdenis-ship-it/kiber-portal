import {readFileSync,writeFileSync} from 'node:fs';
import {transform} from 'esbuild';
const bootstrap=readFileSync('src/lib/deferred-card-images.js','utf8');
const slider=readFileSync('public/scripts/home-image-cards-slider.js','utf8');
const source=bootstrap+`\n(()=>{const start=()=>{${slider}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();})();`;
const result=await transform(source,{minify:true,target:'es2020',legalComments:'none'});
writeFileSync('public/scripts/internal-cards-v1.js',result.code);
