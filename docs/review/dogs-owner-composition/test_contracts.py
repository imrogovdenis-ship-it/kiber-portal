from pathlib import Path
from bs4 import BeautifulSoup
import unittest,json
R=Path(__file__).parent
class Contracts(unittest.TestCase):
 def test_owner_order_and_reuse(self):
  before=BeautifulSoup((R/'baseline.html').read_text(),'html.parser');p=BeautifulSoup((R/'site/index.html').read_text(),'html.parser');ss=p.select_one('main > article').find_all('section',recursive=False)
  expected=['hero','text','product','gosha-intro','guide','scenarios','gosha-intro','catalog','faq','cta','blog','compilations']
  def kind(x):
   c=' '.join(x.get('class',[]))
   for a in ['hero','text','gosha-intro','guide','scenarios','cta']:
    if 'humanoid-template__'+a in c:return a
   if x.get('id')=='featured-dogs':return 'product'
   if x.get('id')=='catalog':return 'catalog'
   if x.select_one('details'):return 'faq'
   if 'bottom-compilations' in c:return 'compilations'
   return 'blog'
  self.assertEqual([kind(x) for x in ss],expected)
  self.assertFalse(p.select('.humanoid-template__gallery'))
  self.assertEqual(len(p.select('.article-blocks__featured-model')),3);self.assertEqual(len(p.select('#catalog .robot-card')),3)
  for sel in ['.humanoid-template__hero','.humanoid-template__text','.humanoid-template__guide','.humanoid-template__scenarios','.humanoid-template__cta','.humanoid-template__bottom-compilations']:
   self.assertEqual(p.select_one(sel).get_text(' ',strip=True),before.select_one(sel).get_text(' ',strip=True))
   self.assertEqual([i['src'] for i in p.select_one(sel).select('img')],[i['src'] for i in before.select_one(sel).select('img')])
  self.assertEqual([x.get_text(' ',strip=True) for x in p.select('.humanoid-template__gosha-intro')],[x.get_text(' ',strip=True) for x in before.select('.humanoid-template__gosha-intro')])
  for featured,card in zip(p.select('.article-blocks__featured-model'),before.select('#catalog .robot-card')):
   self.assertEqual(featured.select_one('h3').text,card.select_one('h3').text);self.assertEqual(featured.select_one('.article-blocks__featured-price').text,card.select_one('.robot-card__price').text);self.assertEqual(featured.select_one('.article-blocks__featured-description').text,json.loads((R/'featured-descriptions.json').read_text())[card.select_one('h3').text]);self.assertEqual(featured.select_one('a')['href'],card['href'])
  ids=[n['id'] for n in p.select('[id]')];self.assertEqual(len(ids),len(set(ids)))
  self.assertFalse(p.select('form,script[src*=analytics]'));self.assertIn('noindex',p.select_one('meta[name=robots]')['content'])
if __name__=='__main__':unittest.main()
