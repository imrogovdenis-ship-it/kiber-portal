import fs from 'node:fs';import path from 'node:path';
const out=process.argv[2];if(!out)throw new Error('Pass a fresh output directory outside dist');if(fs.existsSync(out))throw new Error('Output must be a fresh directory');
fs.cpSync('dist',out,{recursive:true,filter:p=>!p.split(path.sep).includes('api')});
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}
for(const f of walk(out).filter(x=>x.endsWith('.html'))){let t=fs.readFileSync(f,'utf8').replaceAll('data-production="true"','data-production="false"').replace(/<meta\b[^>]*name="robots"[^>]*>/gi,'').replace('</head>','<meta name="robots" content="noindex, nofollow"><script src="/scripts/full-site-preview-guard.js"></script></head>');t=t.replace(/(<a\b[^>]*href=")https?:\/\/(?:www\.)?kiber-portal\.ru(?=\/|")/gi,'$1');fs.writeFileSync(f,t);}
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(out,'scripts/full-site-preview-guard.js'),`/* Preview only: production source and runtime remain unchanged. */
document.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();var f=e.target;var n=f.querySelector('[data-preview-status]');if(!n){n=document.createElement('p');n.dataset.previewStatus='true';n.setAttribute('role','status');f.appendChild(n);}n.textContent='Это превью сайта. Заявка не отправлена.';},true);`);
console.log('Prepared protected full-site preview:',out);
