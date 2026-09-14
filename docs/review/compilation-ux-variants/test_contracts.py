from pathlib import Path
from bs4 import BeautifulSoup
import unittest
R=Path(__file__).parent
class Contracts(unittest.TestCase):
 def test_all_six(self):
  for slug,n in [('roboty-sobaki',3),('roboty-gumanoidy',7)]:
   base=BeautifulSoup((R/(slug+'.html')).read_text(),'html.parser')
   expected={a.select_one('h3').text:a.select_one('.robot-card__price').get_text(' ',strip=True) for a in base.select('#catalog .robot-card')}
   for v in 'abc':
    p=BeautifulSoup((R/'site'/slug/v/'index.html').read_text(),'html.parser')
    with self.subTest(slug=slug,v=v):
     self.assertIn('noindex',p.select_one('meta[name=robots]')['content']);self.assertEqual(len(p.select('h1')),1);self.assertEqual(len(p.select('form')),0)
     self.assertFalse(p.select('script[src*="analytics"],script[src*="contact-lead"]'))
     self.assertFalse([a for a in p.select('a[href]') if a['href'].startswith(('tel:','mailto:','/lead/','https://www.kiber-portal.ru'))])
     self.assertEqual(len(p.select('#ux-inquiry')),1)
     for a in p.select('.humanoid-template__hero a'):
      self.assertTrue(a['href'].startswith('#'));self.assertIsNotNone(p.select_one(a['href']))
     if v=='a':self.assertFalse(p.select('#quick-models'));self.assertEqual(len(p.select('#catalog .robot-card')),n)
     else:
      self.assertEqual({a.select_one('h3').text:a.select_one('strong').text for a in p.select('.ux-choice')},expected)
     if v=='c':self.assertFalse(p.select('.humanoid-template__gallery,#catalog'));self.assertTrue(p.select('[data-filter]'))
     else:
      self.assertTrue(p.select('.humanoid-template__gallery'));self.assertEqual(len(p.select('.ux-caption')),len(p.select('.humanoid-template__gallery figure')))
if __name__=='__main__':unittest.main()
