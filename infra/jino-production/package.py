from pathlib import Path
import shutil,sys
root=Path(__file__).resolve().parents[2]
out=Path(sys.argv[1]).resolve()
if out.exists():raise SystemExit('Destination must not exist')
shutil.copytree(root/'dist',out)
shutil.copy2(root/'infra/jino-production/production.htaccess',out/'.htaccess')
bridge=(root/'infra/jino-preview/bridge.php').read_text().replace('declare(strict_types=1);',"declare(strict_types=1);\ndefine('KIBER_JINO_CONFIG',dirname(__DIR__,2).'/.kiber-jino-prep/production.php');")
(out/'bridge.php').write_text(bridge)
print('Packaged production site without private configuration')
