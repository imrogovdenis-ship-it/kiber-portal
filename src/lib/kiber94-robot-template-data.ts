import cyberdogRemediation from '../../data/content/robot-card-pilot/arenda-xiaomi-cyberdog-2.json';
import go2Remediation from '../../data/content/robot-card-pilot/arenda-unitree-go2.json';
import promobotRemediation from '../../data/content/robot-card-pilot/arenda-promobot-v4.json';
import tronRemediation from '../../data/content/robot-card-pilot/arenda-robota-tron.json';
import sofiaRemediation from '../../data/content/robot-card-pilot/arenda-robota-sofiya.json';
import ardiRemediation from '../../data/content/robot-card-pilot/arenda-robota-ardi.json';
import bumiRemediation from '../../data/content/robot-card-pilot/arenda-noetix-bumi.json';
import h2Remediation from '../../data/content/robot-card-pilot/arenda-unitree-h2.json';
import r1Remediation from '../../data/content/robot-card-pilot/arenda-unitree-r1.json';
import g1Remediation from '../../data/content/robot-card-pilot/arenda-unitree-g1.json';
import x2Remediation from '../../data/content/robot-card-pilot/arenda-agibot-x2.json';
import roboshashkiPilot from '../../data/content/robot-card-pilot/arenda-roboshashki.json';
import senseRobotPilot from '../../data/content/robot-card-pilot/arenda-senserobot.json';
const pilotCopyBySlug: Record<string, typeof roboshashkiPilot | undefined> = { 'arenda-xiaomi-cyberdog-2': cyberdogRemediation, 'arenda-unitree-go2': go2Remediation, 'arenda-promobot-v4': promobotRemediation, 'arenda-robota-tron': tronRemediation, 'arenda-robota-sofiya': sofiaRemediation, 'arenda-robota-ardi': ardiRemediation, 'arenda-noetix-bumi': bumiRemediation, 'arenda-unitree-h2': h2Remediation, 'arenda-unitree-r1': r1Remediation, 'arenda-roboshashki': roboshashkiPilot, 'arenda-senserobot': senseRobotPilot, 'arenda-unitree-g1': g1Remediation, 'arenda-agibot-x2': x2Remediation };
import type { RobotPageRecord } from './robot-pages';
import type { RobotCardTemplateData } from './page-type-templates';

function toPreviewAsset(src: string): string | undefined {
  if (!src.startsWith('/')) return src;
  const publicAssets = import.meta.glob('/public/**/*', { eager: true, query: '?url', import: 'default' });
  if (publicAssets[`/public${src}`]) return src;
  const rawFilename = src.split('/').at(-1);
  const previewFilename = rawFilename?.replace(/\.(jpe?g|png)$/i, '.webp');
  const previewSrc = previewFilename ? `/images/kiber-94-preview/${previewFilename}` : undefined;
  return previewSrc && publicAssets[`/public${previewSrc}`] ? previewSrc : undefined;
}

type RobotCardTextBlock = RobotCardTemplateData['robot']['capabilities'][number];

type OwnerSeoOverride = {
  title: string;
  description: string;
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
};

type OwnerSeoIntent = {
  pageType: 'robot_card';
  pageIntent: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  modelNameVariants: string[];
  entitySynonyms: string[];
  aiAgentHints: string[];
  entity: { type: 'Robot'; name: string; model?: string; manufacturer?: string; category?: string; canonicalPath: string };
  isCrawlerOnlyText: false;
};

type OwnerFaqOverride = Array<{ question: string; answer: string }>;

type OwnerRobotCardCopy = {
  capabilitiesLead: string;
  capabilities: Array<Pick<RobotCardTextBlock, 'title' | 'text'>>;
  scenariosLead: string;
  scenarios: Array<Pick<RobotCardTextBlock, 'title' | 'text'>>;
};


const kettybotReviewGallery = [
  {
    'src': '/images/kiber-45/arenda-kettybot.webp',
    'alt': 'Робот-официант KettyBot: крупным планом везёт поднос на корпоративном мероприятии.'
  },
  {
    'src': '/images/kiber-94-preview/tild6236-3131-4466-a632-623038373139__07.webp',
    'alt': 'Робот-официант KettyBot: крупным планом везёт поднос на корпоративном мероприятии.'
  },
  {
    'src': '/images/kiber-94-preview/tild6139-3335-4138-a539-383539326630__01.webp',
    'alt': 'Робот-доставщик KettyBot, робот для ресторана KettyBot: едет вдоль столиков в кафе; на рекламном экране показаны изображения блюд. Горизонтальное фото.'
  },
  {
    'src': '/images/kiber-94-preview/tild6330-6138-4764-a335-376636333838__04.webp',
    'alt': 'Робот-промоутер с экраном KettyBot, интерактивный робот-официант KettyBot: везёт два блюда гостям конференции, вид сзади.'
  },
  {
    'src': '/images/kiber-94-preview/tild3762-3232-4237-b965-323533333164__09.webp',
    'alt': 'Заказать сервисного робота KettyBot на HoReCa-зоны и события с гостями: крупным планом едет по кафе; на заднем фоне столики и стулья.'
  },
  {
    'src': '/images/kiber-94-preview/tild3864-3062-4563-b431-666566303761__02.webp',
    'alt': 'Робот-официант KettyBot: стоит у фотозоны на выставке рядом с женщиной, которая смотрит на него и фотографируется с ним.'
  },
  {
    'src': '/images/kiber-94-preview/tild3736-3534-4030-b338-333366663735__06.webp',
    'alt': 'Арендовать робота-промоутера KettyBot для HoReCa-зоны и события с гостями: едет по ресторану; на экране отображаются изображения блюд.'
  },
  {
    'src': '/images/kiber-94-preview/tild6365-3064-4761-a334-303561393261__03.webp',
    'alt': 'Робот-доставщик KettyBot, робот для ресторана KettyBot: крупным планом в помещении кафе.'
  },
  {
    'src': '/images/kiber-94-preview/tild3938-3662-4534-b030-623936613139__05.webp',
    'alt': 'Взять в прокат сервисного робота KettyBot для HoReCa-зоны и события с гостями: Сервисный робот-официант KettyBot на корпоративном мероприятии позирует рядом с робобаром.'
  }
].map((image) => ({ ...image, sourceStatus: 'page_content' as const }));


const batch1ReviewGalleryBySlug: Record<string, Array<{ src: string; alt: string; sourceStatus: 'page_content' }>> = {
  'arenda-agibot-x2': [
    { src: '/images/kiber-45/arenda-agibot-x2.webp', alt: "Каталожное изображение arenda-agibot-x2 для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-agibot-x2__tild6437-3735-4235-a161-656439643739__02.webp", alt: "Робот в виде человека Agibot X2, интерактивный гуманоид Agibot X2: на сером фоне бежит и демонстрирует передвижение бегом.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-agibot-x2__tild3063-6333-4161-b064-343764636537__011.webp", alt: "Заказать человекоподобного робота Agibot X2 на презентации: Реальная фотография: робот-гуманоид Agibot X2 танцует на сером фоне, вид спереди.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-agibot-x2__tild6561-6236-4831-a663-663263643764__07.webp", alt: "Человекоподобный робот Agibot X2, робот-человек Agibot X2: на производстве что-то рассматривает. Вид спереди.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-agibot-x2__tild6265-3335-4233-a339-333166366661__08.webp", alt: "Робот-человек Agibot X2, андроид Agibot X2: на белом фоне демонстрирует движение из ушу или боевого единоборства. Вид спереди.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-agibot-x2__tild6665-6366-4537-a464-653439383238__09.webp", alt: "Прокат андроида Agibot X2 для мероприятия: стоит вертикально на белом фоне, руки немного согнуты, как будто он разговаривает с человеком.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-agibot-x2__tild6664-3537-4635-a266-633164383463__05.webp", alt: "Взять в прокат человекоподобного робота Agibot X2 для выставочного стенда: на выставке общается с людьми; вокруг него много мужчин, которые смотрят на робота или.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-agibot-x2__tild3730-3866-4365-b461-336133633866__01.webp", alt: "Арендовать андроида Agibot X2 для мероприятия: Крупный план робота Agibot X2 с человеком: человек приобнимает робота, у робота одна рука.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-agibot-x2__tild6238-6339-4439-b061-313961333062__04.webp", alt: "Человекообразный робот Agibot X2: рядом с робособакой на выставке демонстрации технологий. Вид немного спереди.", sourceStatus: 'page_content' as const },
  ],
  'arenda-noetix-bumi': [
    { src: '/images/kiber-45/arenda-noetix-bumi.webp', alt: "Каталожное изображение arenda-noetix-bumi для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-noetix-bumi__tild3965-3331-4665-b330-623534633536__04.webp", alt: "Робот-гуманоид Noetix Bumi, робот-компаньон Noetix Bumi: Молодая девушка держит робота Noetix Bumi на руках, показывая, насколько он лёгкий. Изображение.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-noetix-bumi__tild3236-3461-4431-b233-623937366430__noroot.webp", alt: "Арендовать интерактивного гуманоида Noetix Bumi для уличной площадки: танцует на улице на фестивале.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-noetix-bumi__tild3335-3863-4438-b032-663231346639__01.webp", alt: "Прокат интерактивного гуманоида Noetix Bumi для демонстрации возможностей: крупным планом в классе для обучения детей программированию демонстрирует движение при.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-noetix-bumi__tild3036-3735-4763-b764-613239623964__02.webp", alt: "Мини-гуманоид Noetix Bumi: Ребёнок управляет роботом Noetix Bumi в домашних условиях в своей комнате.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-noetix-bumi__tild6265-6262-4137-a166-336266316631__noroot.webp", alt: "Заказать человекоподобного робота Noetix Bumi на презентации: танцует на мероприятии.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-noetix-bumi__tild6631-3463-4837-b233-303232393430__08.webp", alt: "Интерактивный гуманоид Noetix Bumi, робот в виде человека Noetix Bumi: танцует на выставке, рядом стоят люди и смотрят на него.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-noetix-bumi__tild6361-6334-4263-b464-663235336535__03.webp", alt: "Взять в прокат человекоподобного робота Noetix Bumi для презентации: Ребёнок занимается с роботом-гуманоидом Noetix Bumi в школе программирования, рядом дети за.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-noetix-bumi__tild3664-6436-4461-b166-303266313631__010.webp", alt: "Робот-гуманоид Noetix Bumi, робот-компаньон Noetix Bumi: бежит по траве вместе с ребёнком; они примерно одинакового роста, ребёнок веселится. Вид спереди.", sourceStatus: 'page_content' as const },
  ],
  'arenda-unitree-r1': [
    { src: '/images/kiber-45/arenda-unitree-r1.webp', alt: "Каталожное изображение arenda-unitree-r1 для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-r1__tild6536-3766-4034-a538-626532663162__noroot.webp", alt: "Заказать человекоподобного робота Unitree R1 на демонстрации возможностей: делает акробатический трюк — стойку на руках на краю каменного утёса. Фотография крупным.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-r1__tild3062-3332-4361-b232-613130313861__03.webp", alt: "Интерактивный гуманоид Unitree R1: Крупная фотография робота Unitree R1, вероятно созданная с помощью искусственного интеллекта.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-r1__tild6136-3331-4366-b934-653538306539__noroot.webp", alt: "Прокат андроида Unitree R1 для мероприятия: Эпическое изображение робота-гуманоида Unitree R1, стилизованного под огромного робота из.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-r1__tild3937-3061-4237-a338-346232613765__04.webp", alt: "Арендовать андроида Unitree R1 для демонстрации возможностей: крупным планом во весь рост стоит у входа в здание; за ним лестница поднимается вверх, вход.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-r1__tild6664-6138-4933-b832-633633326535__05.webp", alt: "Робот-человек Unitree R1, андроид Unitree R1: на лужайке с зелёной травой стоит на руках и выполняет акробатический трюк; на заднем фоне.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-r1__tild6432-3865-4237-b665-626633613332__07.webp", alt: "Человекоподобный робот Unitree R1, робот-человек Unitree R1: на выставке на переднем плане, виден примерно по колено; сзади несколько человек наблюдают за.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-r1__tild6664-3730-4138-a238-373063623031__01.webp", alt: "Взять в прокат человекоподобного робота Unitree R1 для демонстрации возможностей: на фоне высоких зданий делает акробатический трюк — стойку на руках, ноги разведены в стороны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-r1__tild3762-6238-4662-b332-366430336433__noroot.webp", alt: "Прямоходящий робот Unitree R1, робот на двух ногах Unitree R1: Крупное изображение двух роботов-гуманоидов Unitree R1, лежащих на столе головами друг к другу.", sourceStatus: 'page_content' as const },
  ],
  'arenda-unitree-h2': [
    { src: '/images/kiber-45/arenda-unitree-h2.webp', alt: "Каталожное изображение arenda-unitree-h2 для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-h2__tild3338-3033-4761-b961-663635646131__06.webp", alt: "Прямоходящий робот Unitree H2, робот на двух ногах Unitree H2: Крупный план робота Unitree H2 на выставке: похоже на первую презентацию аудитории, люди.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-h2__tild3132-6631-4237-a432-326664313536__02.webp", alt: "Интерактивный гуманоид Unitree H2: стоит в полный рост в стойке единоборств, похожей на каратэ. Он на улице на фоне стеклянного.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-h2__tild6263-3431-4436-b463-366666346362__noroot.webp", alt: "Робот-человек Unitree H2, андроид Unitree H2: крупным планом, обрезан по колено, танцует на фоне пустого зала; сверху на потолке софиты.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-h2__tild3465-6438-4039-a362-363565353563__04.webp", alt: "Заказать человекоподобного робота Unitree H2 на презентации: идёт по подиуму в светлом костюме с длинными рукавами, штанинами и капюшоном; рядом идёт.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-h2__tild6665-6262-4230-b331-653935303135__01.webp", alt: "Арендовать андроида Unitree H2 для выставочного стенда: Крупный план робота Unitree H2 по пояс на выставочном стенде Unitree; на заднем фоне рекламные.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-unitree-h2__tild3634-6665-4631-b530-653838623332__07.webp", alt: "Прокат андроида Unitree H2 для мероприятия: на ринге проводит бой с роботом-гуманоидом Unitree G1. Оба в мягких шлемах и перчатках; H2 бьёт.", sourceStatus: 'page_content' as const },
  ],
  'arenda-robota-sofiya': [
    { src: '/images/kiber-45/arenda-robota-sofiya.webp', alt: "Каталожное изображение arenda-robota-sofiya для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-sofiya__tild3231-3464-4138-b632-653036383765__06.webp", alt: "Заказать человекоподобного робота София на уличной площадки: идёт по тротуару городской улицы и катит перед собой тележку. Она одета в серую блузку и.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-sofiya__tild3134-6537-4237-b337-396630643233__noroot.webp", alt: "Арендовать робота-гуманоида София для сцены и публичного выступления: читает речь на выступлении в ООН в основном зале совещаний; рядом стоит женщина в синем, на.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-sofiya__tild6138-3464-4439-a336-323663313833__07.webp", alt: "Андроид София, робот-гуманоид София: Крупный план робота Софии: на лице выражено удивление, она находится в фотозоне или похожей.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-sofiya__tild3165-6261-4366-b538-336262343464__04.webp", alt: "Робот София: крупным планом даёт интервью, перед ней множество микрофонов разных телекомпаний.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-sofiya__tild3735-6536-4366-b133-363031306330__011.webp", alt: "Робот-человек София, гуманоид Hanson Robotics София: на экране телевизора: робот София в студии телекомпании, внизу экрана бегущая строка и описание.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-sofiya__tild6436-3932-4231-b931-653434363937__noroot.webp", alt: "Взять в прокат человекоподобного робота София для сцены и публичного выступления: ведёт эмоциональное выступление на событии Citizen Robot; она одета в красно-белое одеяние, рот.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-sofiya__tild3765-3435-4633-b862-323837616537__05.webp", alt: "Робот-человек София, гуманоид Hanson Robotics София: на сцене оперного театра поёт под аккомпанемент оркестра; руки подняты и выражают эмоции. На.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-sofiya__tild6630-3139-4562-b532-363137613763__08.webp", alt: "Прокат робота-гуманоида София для мероприятия: Красивое фото робота Софии крупным планом: она даёт интервью телекомпании, вид спереди, на шее.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-sofiya__tild3734-3332-4338-b166-383336376131__010.webp", alt: "Андроид София, робот-гуманоид София: даёт интервью или выступает на сцене: сзади интерактивный экран, перед ней тумба и два.", sourceStatus: 'page_content' as const },
  ],
  'arenda-robota-ardi': [
    { src: '/images/kiber-45/arenda-robota-ardi.webp', alt: "Каталожное изображение arenda-robota-ardi для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-ardi__tild3038-3330-4135-a132-316462346334__noroot.webp", alt: "Заказать сервисного робота Ardi на презентации: Очень крупная фотография робота Ardi: видны только голова и шея.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-ardi__tild6631-3064-4130-b065-386464393630__06.webp", alt: "Робот-промоутер Ardi, робот-хостес Ardi: выступает перед аудиторией на сцене; перед ним микрофон, эмоциональное выступление, вид спереди.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-ardi__tild3538-3231-4930-a234-613065646461__03.webp", alt: "Взять в прокат сервисного робота Ardi для выставочного стенда: Оператор готовит робота Ardi к выступлению: робот стоит в холле выставки, подключён проводом к.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-ardi__tild6666-6639-4363-b535-636638386662__08.webp", alt: "Интерактивный робот Ardi, робот с экраном Ardi: выступает перед гостями на робошоу, крупный план, фронтальное изображение немного сбоку.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-ardi__tild3434-3862-4665-b832-643034303733__noroot.webp", alt: "Робот Ardi: выступает на выставке лицом к зрителю; две девушки фотографируют его на телефоны или.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-ardi__tild6232-3966-4565-a364-376230343535__011.webp", alt: "Прокат интерактивного робота Ardi для сцены и публичного выступления: крупным планом на сцене мероприятия; видны только грудь и голова.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-ardi__tild3766-6366-4261-b161-313637633031__04.webp", alt: "Интерактивный робот Ardi, робот с экраном Ardi: Эмоциональное выступление робота Ardi перед аудиторией; видеооператор снимает его выступление.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-ardi__tild3764-3566-4436-b462-636632653738__05.webp", alt: "Арендовать интерактивного робота Ardi для выставочного стенда: взаимодействует с аудиторией на корпоративном мероприятии или выставке, вид сбоку; люди и дети.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-ardi__tild6464-3364-4466-b331-613636656637__012.webp", alt: "Робот-промоутер Ardi, робот-хостес Ardi: выступает перед публикой на сцене крупным планом; перед ним микрофон, неоновая подсветка, руки.", sourceStatus: 'page_content' as const },
  ],
  'arenda-robota-tron': [
    { src: '/images/kiber-45/arenda-robota-tron.webp', alt: "Каталожное изображение arenda-robota-tron для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild3839-6235-4164-a665-346361626166__noroot.webp", alt: "Заказать робота Tron на колёсной базе на презентации: крупным планом на сером фоне на колёсной базе. Фирменное изображение сайта производителя.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild6362-3431-4465-b132-356532616262__07.webp", alt: "Робот-трансформер Tron, мобильный робот Tron: Фирменное изображение с тремя роботами Tron, у каждого разная база передвижения: ноги, ступни и.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild3235-3966-4364-b635-306562343464__013.webp", alt: "Робот-трансформер Tron, мобильный робот Tron: находится в положении сидя на полу; виден сам робот и руки человека, который держит пульт.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild3463-3739-4766-b036-376366613534__noroot.webp", alt: "Прокат демонстрационного робота Tron для мероприятия: крупным планом на технологичном фоне со стеклом, стоит на колёсной базе и смотрит на зрителя.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild3536-3736-4337-b632-643630306235__01.webp", alt: "Интерактивный робот Tron, демонстрационный робот Tron: на колёсной базе спускается вниз по широкой лестнице.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild6535-6131-4931-b562-646633363134__03.webp", alt: "Интерактивный робот Tron, демонстрационный робот Tron: на колёсной базе движется на выставке среди толпы людей, все смотрят на него.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild3238-3533-4861-a431-303533306661__012.webp", alt: "Аренда демонстрационного робота Tron для мероприятия: Человек укладывает сложенного робота Tron в чемодан для перевозки, показывая компактность и.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild3530-3730-4030-b432-386539343765__02.webp", alt: "Арендовать демонстрационного робота Tron для выставочного стенда: на колёсной базе движется на выставке среди множества людей, вид спереди.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild6637-3136-4133-b838-616337386661__011.webp", alt: "Модульный робот Tron: преодолевает полосу препятствий, как бегун на барьерной дорожке. Крупное изображение, вид.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch1-humanoids/arenda-robota-tron__tild3031-3435-4261-b363-393361623934__05.webp", alt: "Взять в прокат робота Tron на колёсной базе для демонстрации возможностей: поднимается вверх по лестнице на колёсной базе, рядом человек подталкивает его, демонстрируя.", sourceStatus: 'page_content' as const },
  ],
  'arenda-unitree-g1': [
    { src: "/images/kiber-45/arenda-unitree-g1.webp", alt: "Каталожное изображение arenda-unitree-g1 для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-g1__tild6333-3137-4465-b265-323436646539__06.webp", alt: "Робот-человек Unitree G1 пожимает руку посетителю на выставке НИЖФАРМ, андроид для делового стенда.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-g1__tild3335-3863-4737-b865-343938666339__04.webp", alt: "Робот-гуманоид Unitree G1 на фирменном студийном кадре, человекоподобный робот в виде человека.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-g1__tild6262-6336-4038-a130-626264326663__02.webp", alt: "Арендовать робота-гуманоида Unitree G1 для презентации: прямоходящий человекоподобный робот бежит на фирменном кадре.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-g1__tild6434-6663-4638-b765-303861663563__05.webp", alt: "Андроид Unitree G1 спускается по лестнице, робот на двух ногах демонстрирует движение в боковом ракурсе.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-g1__tild3662-3964-4530-a331-663534313936__01.webp", alt: "Прокат робота-человека Unitree G1 для выставочного стенда: гуманоид в фирменном образе с LED-дисплеем.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-g1__tild6134-6536-4662-a134-643063656632__09.webp", alt: "Человекоподобный робот Unitree G1 на групповом фото с командой стенда НИЖФАРМ.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-g1__tild6430-3334-4539-b033-633732353634__07.webp", alt: "Взять в прокат андроида Unitree G1 для стенда Винпин в Крокус Экспо и выставочного интерактива.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-g1__tild6532-3936-4631-a336-313438353966__010.webp", alt: "Интерактивный гуманоид Unitree G1 рядом с робособакой Unitree Go2 на площадке 20-30.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-g1__tild3639-3163-4237-a262-626361333964__03.webp", alt: "Заказать робота-человека Unitree G1 на мероприятие: андроид машет рукой и показывает подвижность корпуса.", sourceStatus: 'page_content' as const },
  ],
  'arenda-bellabot': [
    { src: "/images/kiber-45/arenda-bellabot.webp", alt: "Каталожное изображение arenda-bellabot для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild6137-3561-4532-b062-646264396639__02.webp", alt: "Робот-официант BellaBot: крупным планом на сером фоне, вид спереди немного наискось.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild3730-3164-4238-a530-353561376234__noroot.webp", alt: "Робот-доставщик BellaBot, робот для ресторана BellaBot: крупным планом; видна кошачья мордочка и стилизованное человеческое лицо на экране. Робот явно.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild3161-3431-4835-a134-373533613032__03.webp", alt: "Прокат робота для ресторана BellaBot для мероприятия: Два белых робота-официанта BellaBot крупным планом на сером фоне.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild6430-3838-4730-a532-343435366463__09.webp", alt: "Робот-кот официант BellaBot, интерактивный официант BellaBot: крупным планом; видна только верхняя часть кошачьей мордочки, на заднем фоне помещение ресторана.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild3461-3562-4063-b032-656137346433__05.webp", alt: "Заказать сервисного робота BellaBot на HoReCa-зоны и события с гостями: во весь рост движется по помещению кафе или ресторана.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild6239-6132-4661-a438-316164333461__01.webp", alt: "Робот-официант BellaBot: Белый робот-официант BellaBot находится в помещении ресторана; широкое изображение, видно почти.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild6533-3031-4766-b662-303762393638__010.webp", alt: "Арендовать робота для ресторана BellaBot для демонстрации возможностей: движется по залу мероприятия и перевозит блюда. На заднем фоне несколько человек стоят и.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild6338-3063-4335-b931-623732346635__noroot.webp", alt: "Робот-доставщик BellaBot, робот для ресторана BellaBot: на выставке; на заднем фоне люди сидят и слушают лекцию, робот движется по направлению от.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild3966-6630-4761-a135-306232623062__08.webp", alt: "Взять в прокат сервисного робота BellaBot для презентации: Чёрный робот-официант BellaBot крупным планом, на его подносах лежат сладости.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-bellabot__tild3532-3264-4261-a634-643438656237__noroot.webp", alt: "Робот-кот официант BellaBot, интерактивный официант BellaBot: Два робота-официанта BellaBot чёрного и белого цвета на светлом фоне помещения; стилизованное.", sourceStatus: 'page_content' as const },
  ],
  'arenda-kettybot': [
    { src: "/images/kiber-45/arenda-kettybot.webp", alt: "Каталожное изображение arenda-kettybot для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild6362-3235-4561-a436-623839356139__011.webp", alt: "Робот-промоутер с экраном KettyBot, интерактивный робот-официант KettyBot: Жёлтый робот-официант KettyBot крупным планом на белом фоне.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild6236-3131-4466-a632-623038373139__07.webp", alt: "Робот-официант KettyBot: крупным планом везёт поднос на корпоративном мероприятии.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild6139-3335-4138-a539-383539326630__01.webp", alt: "Робот-доставщик KettyBot, робот для ресторана KettyBot: едет вдоль столиков в кафе; на рекламном экране показаны изображения блюд. Горизонтальное фото.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild3663-6530-4536-b734-643935626664__08.webp", alt: "Прокат робота-промоутера KettyBot для мероприятия: Два робота KettyBot, один жёлтый и один белый, крупным планом на белом фоне.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild6330-6138-4764-a335-376636333838__04.webp", alt: "Робот-промоутер с экраном KettyBot, интерактивный робот-официант KettyBot: везёт два блюда гостям конференции, вид сзади.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild3762-3232-4237-b965-323533333164__09.webp", alt: "Заказать сервисного робота KettyBot на HoReCa-зоны и события с гостями: крупным планом едет по кафе; на заднем фоне столики и стулья.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild3864-3062-4563-b431-666566303761__02.webp", alt: "Робот-официант KettyBot: стоит у фотозоны на выставке рядом с женщиной, которая смотрит на него и фотографируется с ним.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild3736-3534-4030-b338-333366663735__06.webp", alt: "Арендовать робота-промоутера KettyBot для HoReCa-зоны и события с гостями: едет по ресторану; на экране отображаются изображения блюд.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild6365-3064-4761-a334-303561393261__03.webp", alt: "Робот-доставщик KettyBot, робот для ресторана KettyBot: крупным планом в помещении кафе.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-kettybot__tild3938-3662-4534-b030-623936613139__05.webp", alt: "Взять в прокат сервисного робота KettyBot для HoReCa-зоны и события с гостями: Сервисный робот-официант KettyBot на корпоративном мероприятии позирует рядом с робобаром.", sourceStatus: 'page_content' as const },
  ],
  'arenda-unitree-go2': [
    { src: "/images/kiber-45/arenda-unitree-go2.webp", alt: "Каталожное изображение arenda-unitree-go2 для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild6666-3666-4662-a431-636535616562__6.webp", alt: "Заказать робособаку Unitree Go2 для фестиваля, уличной демонстрации и интерактива с гостями.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild6530-3530-4530-b063-393336396631__-_unitree_go2____.webp", alt: "Робот-пёс Unitree Go2 выполняет акробатический трюк на передних лапах, четвероногий робот демонстрирует баланс.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild3736-3066-4163-a539-633336363532__-_unitree_go2______.webp", alt: "Механический пёс Unitree Go2 крупным планом на улице, робот-собака с модулем и световым индикатором.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild3966-3830-4332-a165-396334616437___-_unitree_go2______.webp", alt: "Прокат робота-пса Unitree Go2 для демонстрации движения на открытой площадке.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild6235-3630-4865-a365-316333613930__-_unitree_go2_____.webp", alt: "Четвероногий робот Unitree Go2 проходит каменистую поверхность, механический пёс демонстрирует проходимость.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild6530-6261-4733-b832-343462316432__4.webp", alt: "Робот-собака Unitree Go2 в декоративной фотозоне рядом с гостями, интерактивная робособака для события.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild3334-6166-4337-a661-373732343830__3.webp", alt: "Взять в прокат механического пса Unitree Go2 для новогоднего мероприятия, фотозоны и интерактива с детьми.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild3034-3431-4664-b364-613830393864__1.webp", alt: "Кибер-пёс Unitree Go2 на фестивале ИГРАПРОМ с LED-панелью и рекламной строкой.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild3234-6131-4736-b062-623866663537__2.webp", alt: "Арендовать робота-собаку Unitree Go2 для детского дня рождения с подносом для торта.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-unitree-go2__tild3233-3033-4335-b638-343335666637__5.webp", alt: "Робот-пёс Unitree Go2 крупным планом на фоне неоновой подсветки, современная робособака для эффектной фотозоны.", sourceStatus: 'page_content' as const },
  ],
  'arenda-xiaomi-cyberdog-2': [
    { src: "/images/kiber-45/arenda-xiaomi-cyberdog-2.webp", alt: "Каталожное изображение arenda-xiaomi-cyberdog-2 для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-xiaomi-cyberdog-2__tild3536-6239-4431-b434-333763623165__noroot.webp", alt: "Заказать робособаки Xiaomi CyberDog 2 на презентации: Крупный план робособаки Xiaomi CyberDog 2: видна передняя часть туловища, ноги и голова, рядом.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-xiaomi-cyberdog-2__tild3634-6431-4932-a636-653336656338__010.webp", alt: "Робот-пёс Xiaomi CyberDog 2: Крупное изображение робота-собаки Xiaomi CyberDog 2 на чёрном фоне; видны только голова и шея.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-xiaomi-cyberdog-2__tild3239-3230-4630-a339-353163353432__noroot.webp", alt: "Робособака Xiaomi CyberDog 2, механический пёс Xiaomi CyberDog 2: Крупный план робособаки Xiaomi CyberDog 2 на сером фоне, вид сбоку.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-xiaomi-cyberdog-2__tild6531-3232-4333-b263-373839366131__05.webp", alt: "Прокат механического пса Xiaomi CyberDog 2 для мероприятия: Крупный план робособаки Xiaomi CyberDog 2 на светлом фоне; видна рука человека по локоть.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-xiaomi-cyberdog-2__tild3334-6430-4538-a132-313139356263__03.webp", alt: "Кибер-пёс Xiaomi CyberDog 2, четвероногий робот Xiaomi CyberDog 2: Крупный план робособаки Xiaomi CyberDog 2 в движении, вид сбоку; собака касается земли только.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-xiaomi-cyberdog-2__tild3834-3231-4836-b737-366637613031__08.webp", alt: "Робот на четырёх лапах Xiaomi CyberDog 2: позирует перед зрителями на выставке в положении сидя: передняя часть тела поднята, передние.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-xiaomi-cyberdog-2__tild6138-6135-4862-a132-626663393638__07.webp", alt: "Арендовать механического пса Xiaomi CyberDog 2 для мероприятия: Вид сбоку: робособака Xiaomi CyberDog 2 и ребёнок в светлой рубашке и светлой кепке. Робособака.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-xiaomi-cyberdog-2__tild3130-6661-4337-b133-613762633164__09.webp", alt: "Робот-пёс Xiaomi CyberDog 2, робот-собака Xiaomi CyberDog 2: Робопёс Xiaomi CyberDog 2 стоит на полу, вид почти сверху; вокруг него много людей со всех.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-xiaomi-cyberdog-2__tild3236-3835-4331-b539-373139386462__01.webp", alt: "Взять в прокат робособаки Xiaomi CyberDog 2 для презентации: сидит на полу перед обычной собакой; они видны сбоку и смотрят друг на друга.", sourceStatus: 'page_content' as const },
  ],
  'arenda-promobot-v4': [
    { src: "/images/kiber-45/arenda-promobot-v4.webp", alt: "Каталожное изображение arenda-promobot-v4 для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild3835-6365-4632-b863-616638656231__011.webp", alt: "Робот-промоутер Promobot V4: на мероприятии крупным планом, вид спереди; руки разведены в стороны, на лице улыбка.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild3834-3962-4239-b965-316661316234__01.webp", alt: "Робот-хостес Promobot V4, робот-консультант Promobot V4: в помещении торгового центра взаимодействует с посетителями; двое мужчин общаются с ним.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild3562-6138-4433-b931-646465643163__08.webp", alt: "Прокат промо-робота Promobot V4 для выставочного стенда: на ярком выставочном стенде; рядом девушка-промо сидит, вместе они взаимодействуют с.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild3636-6331-4535-b465-646266393432__03.webp", alt: "Интерактивный робот с экраном Promobot V4, промо-робот Promobot V4: крупным планом, вид спереди; стоит в помещении офисного центра, виден по пояс, на лице улыбка.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild3534-3933-4962-b462-376361346430__012.webp", alt: "Заказать сервисного робота Promobot V4 на выставочного стенда: крупным планом во весь рост, вид сбоку, в холле выставки.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild6333-3039-4261-b631-313337316333__05.webp", alt: "Робот-промоутер Promobot V4: Девушка держит на руках ребёнка, который тянется, чтобы дотронуться до робота Promobot V4; все.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild6533-6561-4461-b632-323964643433__noroot.webp", alt: "Арендовать промо-робота Promobot V4 для сцены и публичного выступления: на сцене развлекает людей и машет руками. Яркая фотография, вид спереди.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild3732-6531-4935-a361-376363323131__04.webp", alt: "Робот-хостес Promobot V4, робот-консультант Promobot V4: на выставке взаимодействует с посетителями; фото крупным планом, на заднем фоне люди, робот.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild6664-3339-4639-b231-323261366264__010.webp", alt: "Взять в прокат сервисного робота Promobot V4 для презентации: Девушка стоит лицом к Promobot V4, к зрителю спиной, и взаимодействует с интерактивным экраном.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild3135-6638-4431-a538-363464393463__07.webp", alt: "Интерактивный робот с экраном Promobot V4, промо-робот Promobot V4: на выставочном стенде крупным планом; вместо глаз у него стилизованные сердечки.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch2-robot-cards/arenda-promobot-v4__tild3832-3664-4865-b531-663761353435__09.webp", alt: "Аренда промо-робота Promobot V4 для выставочного стенда: на выставочном стенде крупным планом; на заднем фоне люди взаимодействуют со стендом.", sourceStatus: 'page_content' as const },
  ],
  'arenda-robot-barmen': [
    { src: '/images/kiber-45/arenda-robot-barmen.webp', alt: 'Каталожное изображение arenda-robot-barmen для Hero; не используется как фото галереи.', sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robot-barmen__tild3630-3731-4165-b139-303235633465__noroot.webp", alt: "Манипулятор робота-бармена крупным планом на неоновом фоне.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robot-barmen__tild3165-3834-4637-b363-633935616133__06.webp", alt: "Робот-бармен держит в руке рюмку и готов наливать в неё алкоголь. Аренда робот-бармен «Робобар» для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robot-barmen__tild3864-6538-4231-b239-656133613061__noroot.webp", alt: "Роботизированная рука робота-бармена крупным планом на мероприятии.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robot-barmen__tild6337-3061-4562-b138-326565643530__07.webp", alt: "Крупный план бутылок с алкоголем, установленных внутри куба робота-бармена. Аренда робот-бармен «Робобар» для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robot-barmen__tild3465-6639-4631-b436-313332343335__noroot.webp", alt: "Рука-манипулятор робота-бармена передвигается внутри куба, чтобы налить алкоголь в коктейль.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robot-barmen__tild3039-3761-4238-b036-383439386666__01.webp", alt: "Мужчина наблюдает, как робот-бармен изготавливает фирменный коктейль для девушки на корпоративе. Аренда робот-бармен «Робобар» для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robot-barmen__tild3132-3731-4235-b666-306330316665__noroot.webp", alt: "Робобар готовит фирменные коктейли на выставке для девушки, люди наблюдают за процессом.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robot-barmen__tild3533-3065-4934-b435-656434356665__05.webp", alt: "Крупный план процесса разлива алкоголя по стаканам: в стакане лёд, манипулятор наливает алкогольный напиток, вид спереди. Аренда робот-бармен «Робобар» для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
  ],
  'arenda-robo-kofeyni': [
    { src: '/images/kiber-45/arenda-robo-kofeyni.webp', alt: 'Каталожное изображение arenda-robo-kofeyni для Hero; не используется как фото галереи.', sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robo-kofeyni__tild3539-6161-4962-b461-313766373363__01.webp", alt: "Роботизированная рука Robo-Кофейни наливает готовый кофе в стакан.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robo-kofeyni__tild6461-3763-4635-b532-666633626634__010.webp", alt: "Процесс приготовления кофе в Robo-Кофейне крупным планом, технологичное фото. Аренда Robo-Кофейня для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robo-kofeyni__tild6235-3566-4030-b434-383765343333__03.webp", alt: "Манипулятор Robo-Кофейни засыпает молотый кофе в кофемашину, крупный план.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robo-kofeyni__tild3737-6237-4465-a132-393964613265__noroot.webp", alt: "Крупное изображение стакана кофе, небольшого тканевого мешочка с кофе и кофейных зёрен как иллюстрация к робокофейне. Аренда Robo-Кофейня для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robo-kofeyni__tild3739-3864-4263-b630-616561386635__06.webp", alt: "Манипулятор робокофейни держит стакан кофе и готов передать его человеку на мероприятии.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robo-kofeyni__tild3438-3161-4562-b937-626434386232__05.webp", alt: "Человек выбирает кофе на планшете: видно планшет крупным планом и руку человека, которая нажимает на экран. Аренда Robo-Кофейня для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robo-kofeyni__tild3166-3530-4635-a635-326430303162__08.webp", alt: "Манипулятор Robo-Кофейни крупным планом держит стакан только что приготовленного свежего кофе и готов передать его человеку.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robo-kofeyni__tild6663-3336-4432-a366-386435363061__04.webp", alt: "Крупный план: робот-манипулятор достаёт держатель для кофе из кофемашины на мероприятии. Аренда Robo-Кофейня для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
  ],
  'arenda-mini-robo-kofeyni': [
    { src: '/images/kiber-45/arenda-mini-robo-kofeyni.webp', alt: 'Каталожное изображение arenda-mini-robo-kofeyni для Hero; не используется как фото галереи.', sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-mini-robo-kofeyni__tild3439-3161-4166-a662-336436386532__08.webp", alt: "Человек держит в руке стакан кофе, приготовленный мини-робокофейней. Видна только рука человека, на заднем фоне размытое здание, фото сделано на улице.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-mini-robo-kofeyni__tild3430-3038-4438-a532-323836613937__04.webp", alt: "Процесс приготовления кофе мини-робокофейней: видно стакан, в который льётся кофе, стакан держит роботизированная рука. Аренда мини Robo-Кофейня для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-mini-robo-kofeyni__tild3364-3236-4736-b430-303065663465__02.webp", alt: "Мини-робокофейня крупным планом во весь рост, видна целиком и установлена в зале конференции.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-mini-robo-kofeyni__tild6231-3835-4131-b966-373139663534__07.webp", alt: "Человек только что взял стакан кофе у робокофейни: видны только руки человека, манипулятор робота и стол. Аренда мини Robo-Кофейня для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-mini-robo-kofeyni__tild6634-3530-4637-a534-653639323435__05.webp", alt: "Человек подошёл к робокофейне и забирает свой стакан кофе, крупный план.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-mini-robo-kofeyni__tild3035-3038-4565-b133-646631646662__03.webp", alt: "Мини-робокофейня делает мороженое: роботизированная рука держит стакан, в который из аппарата подаётся мороженое. Аренда мини Robo-Кофейня для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-mini-robo-kofeyni__tild6265-3763-4265-b135-653138386261__06.webp", alt: "Несколько женщин стоят и ждут своей очереди у мини-робокофейни на мероприятии.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-mini-robo-kofeyni__tild3462-6461-4733-b237-356464643830__01.webp", alt: "Робокофейня крупным планом на выставке; рядом две женщины ждут, пока приготовится кофе. Аренда мини Robo-Кофейня для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
  ],
  'arenda-glambot': [
    { src: '/images/kiber-45/arenda-glambot.webp', alt: 'Каталожное изображение arenda-glambot для Hero; не используется как фото галереи.', sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-glambot__tild6439-3737-4733-a635-653830636563__01.webp", alt: "Робот GlamBot крупным планом, вид спереди на светло-синем фоне. Профессиональная съёмка.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-glambot__tild6262-3061-4134-a465-323062633539__05.webp", alt: "Робот GlamBot на светло-розовом фоне стоит на подставке; рядом пульт управления тоже стоит на подставке. Аренда GlamBot для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-glambot__tild6563-3439-4536-b265-393066346365__07.webp", alt: "Робот GlamBot снимает красную дорожку на крупном ярком мероприятии или концерте, по дорожке идут две две женщины.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-glambot__tild3637-3630-4030-b038-613562616238__06.webp", alt: "Робот GlamBot стоит на выставке, вид сзади; перед ним пульт управления, рядом человек. Аренда GlamBot для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-glambot__tild3337-3930-4364-b435-613434363334__04.webp", alt: "Робот GlamBot крупным планом на фоне неоновой подсветки.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-glambot__tild3430-3866-4336-a665-323638663034__02.webp", alt: "Две девушки позируют для робота GlamBot на фотозоне. Аренда GlamBot для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-glambot__tild6635-6361-4463-b939-396566616636__08.webp", alt: "Робот GlamBot крупным планом на подставке на технологичной выставке.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-glambot__tild6231-3464-4563-b232-353731303462__03.webp", alt: "Робот GlamBot снимает девушку на праздничной вечеринке; девушка-блондинка улыбается и довольна съёмкой. Аренда GlamBot для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
  ],
  'arenda-sketchbot': [
    { src: '/images/kiber-45/arenda-sketchbot.webp', alt: 'Каталожное изображение arenda-sketchbot для Hero; не используется как фото галереи.', sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-sketchbot__tild3333-3837-4336-b232-396235623162__09.webp", alt: "Робот-художник Sketchbot рисует скетч; виден сам робот и процесс рисования.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-sketchbot__tild3064-6338-4337-b230-376434623431__01.webp", alt: "Человек держит три скетча, нарисованных роботом-художником Sketchbot. На изображении видны только руки и сами скетчи, человека не видно. Аренда Sketchbot для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-sketchbot__tild6139-6562-4232-b230-363664373137__017.webp", alt: "Робот-художник Sketchbot расположен на белом фоне и рисует скетчи. Рядом лежат яркие маркеры, скетчи стилизованные и брендированные с логотипами компании, что показывает возможность брендирования рисунков под заказчика.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-sketchbot__tild3834-3838-4137-b333-646164343332__02.webp", alt: "На столе расположены сразу три робота-художника Sketchbot, которые рисуют скетчи. Аренда Sketchbot для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-sketchbot__tild3834-6463-4234-b165-323762353931__noroot.webp", alt: "Робот-художник Sketchbot крупным планом рисует изображение.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-sketchbot__tild3739-6331-4234-b635-633262663663__010.webp", alt: "Робот-художник Sketchbot крупным планом, вид сбоку, на выставке рисует изображение. На заднем фоне размыты люди. Аренда Sketchbot для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-sketchbot__tild6630-3238-4963-b564-316235323834__015.webp", alt: "Робот-художник Sketchbot рисует скетч чёрным маркером. Крупное изображение: видны манипулятор, маркер и скетч.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-sketchbot__tild6563-3964-4130-a239-393764383362__07.webp", alt: "Робот-художник Sketchbot рисует скетч, крупное изображение немного сбоку. Аренда Sketchbot для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
  ],
  'arenda-robota-hudozhnika-a4': [
    { src: '/images/kiber-45/arenda-robota-hudozhnika-a4.webp', alt: 'Каталожное изображение arenda-robota-hudozhnika-a4 для Hero; не используется как фото галереи.', sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robota-hudozhnika-a4__tild6434-3038-4462-a265-313833396538__09.webp", alt: "Робот-художник A4 крупным планом на светлом фоне: виден только манипулятор, который держит карандаш.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robota-hudozhnika-a4__tild3034-3566-4665-b136-633866383265__03.webp", alt: "Робот-художник A4 рисует портрет: лист закреплён на деревянном холсте, виден манипулятор сзади, стол, холст и стена на фоне. Аренда робот-художник A4 для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robota-hudozhnika-a4__tild3364-3836-4633-b538-633865636364__01.webp", alt: "Изображение роботизированной руки робота-художника A4 на сером фоне.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robota-hudozhnika-a4__tild3438-3431-4038-b939-396465653237__02.webp", alt: "Манипулятор робота-художника A4 крупным планом рисует изображение на мероприятии; виден сам процесс рисования. Аренда робот-художник A4 для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robota-hudozhnika-a4__tild3138-6562-4865-b933-313264613765__06.webp", alt: "Крупный план манипулятора робота-художника A4 на мероприятии, на фоне проходят люди.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robota-hudozhnika-a4__tild6339-3766-4133-a566-356232306263__08.webp", alt: "Роботизированная рука робота-художника A4 установлена на столе; рядом лежит холст и масляные краски, манипулятор кисточкой рисует изображение красками. Аренда робот-художник A4 для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robota-hudozhnika-a4__tild3135-3665-4635-a234-313737613137__07.webp", alt: "Роботизированная рука робота-художника A4 в офисе компании в процессе тестирования; на заднем фоне стол, монитор и компьютер.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch3-robot-cards/arenda-robota-hudozhnika-a4__tild3033-3262-4138-b338-326636666339__04.webp", alt: "Процесс создания изображения: на металлическом столе на конференции установлен робот-художник A4, перед ним деревянная конструкция с закреплённым листом бумаги, идёт рисование. Аренда робот-художник A4 для мероприятия и интерактивной зоны.", sourceStatus: 'page_content' as const },
  ],

  'arenda-inchbot-l1-w-edu': [
    { src: '/images/kiber-45/arenda-inchbot-l1-w-edu.webp', alt: "Каталожное изображение Inchbot L1-W EDU для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-inchbot-l1-w-edu__01-tild3039-6438-4864-a336-613831663462__noroot.webp", alt: "Робот-пёс Inchbot L1-W EDU, механический пёс Inchbot L1-W EDU: оторвалась от земли и делает сальто в воздухе. Фотография спереди крупным планом", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-inchbot-l1-w-edu__02-tild6263-3565-4132-b736-663530333864__08.webp", alt: "Прокат четвероногого робота Inchbot L1-W EDU для демонстрации возможностей: движется на колёсах по пустыне, вид сбоку; за ней поднимается пыль", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-inchbot-l1-w-edu__03-tild6637-6536-4064-a663-353132643466__07.webp", alt: "Четвероногий робот Inchbot L1-W EDU, робот на четырёх лапах Inchbot L1-W EDU: видна издалека, спускается с небольшого каменистого пригорка и показывает технологические", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-inchbot-l1-w-edu__04-tild6164-3661-4835-b039-303964323837__noroot.webp", alt: "Заказать робособаки Inchbot L1-W EDU на демонстрации возможностей: едет между кустарниками по земле, вид спереди, демонстрация проходимости", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-inchbot-l1-w-edu__05-tild3165-6138-4635-b538-623931653530__noroot.webp", alt: "Образовательная робособака Inchbot L1-W EDU: на мероприятии на колёсной базе едет между столов, вид сбоку", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-inchbot-l1-w-edu__06-tild3237-3030-4131-b965-346163333661__noroot.webp", alt: "Арендовать четвероногого робота Inchbot L1-W EDU для демонстрации возможностей: на колёсной базе поднимается вверх по широкой каменной лестнице, вид сзади", sourceStatus: 'page_content' as const },
  ],
  'arenda-klipmeiker': [
    { src: '/images/kiber-45/arenda-klipmeiker.webp', alt: "Каталожное изображение Клипмейкер для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-klipmeiker__01-tild3039-3538-4564-b237-626230636636__06.webp", alt: "Камера-робот Klipmeiker, робот для видеороликов Klipmeiker: Робот для создания клипов Klipmeiker крупным планом на фоне красивой неоновой подсветки в", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-klipmeiker__02-tild6165-6134-4737-b861-653139383366__04.webp", alt: "Прокат медиа-робота Klipmeiker для HoReCa-зоны и события с гостями: Роботизированная рука с камерой, вид спереди крупным планом, стоит на подставке на мероприятии", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-klipmeiker__03-tild3330-3561-4639-b639-343130353130__08.webp", alt: "Робот для контента Klipmeiker, медиа-робот Klipmeiker: на подставке стоит на сцене в небольшой дымке и снимает выступающего человека", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-klipmeiker__04-tild3936-6361-4463-a536-336239326466__07.webp", alt: "Заказать роботизированной камеры Klipmeiker на фотозоны и фотоактивации: Девушка позирует для роботизированной руки с камерой Klipmeiker; у неё развеваются волосы, она", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-klipmeiker__05-tild3331-3030-4833-a364-383039306561__09.webp", alt: "Робот-Klipmeiker: установлен на подставке на сцене; вокруг мужчины монтируют его. На заднем фоне много экранов с", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-klipmeiker__06-tild6661-3737-4761-b032-643935616666__02.webp", alt: "Роборука робота Клипмейкер с камерой для моушн-видео", sourceStatus: 'page_content' as const },
  ],
  'arenda-roboshashki': [
    { src: '/images/kiber-45/arenda-roboshashki.webp', alt: "Каталожное изображение Робошашки для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-roboshashki__01-tild6237-6438-4661-a563-393364353366__01.webp", alt: "Игровой робот Робошашки, робот-манипулятор для шашек Робошашки: выставили шашки в правильной последовательности и ждут начала игры на технологичной выставке", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-roboshashki__02-tild3363-3066-4533-a662-373435393838__06.webp", alt: "Прокат интерактивного робота для шашек для выставочного стенда: Игровая доска для робота-шашиста расположена на выставке; рядом подошёл ребёнок и", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-roboshashki__03-tild6662-3163-4339-b535-393537623661__09.webp", alt: "Интерактивный робот для настольной игры Робошашки, робот-шашист Робошашки: Робот-шашист установлен на турнире по игре в шашки и ожидает претендента на игру", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-roboshashki__04-tild3939-6338-4836-b630-333563303035__02.webp", alt: "Заказать робота для игры в шашки на интерактивной игровой зоны: Девушку фотографируют во время процесса игры с роботом-шашистом на мероприятии", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-roboshashki__05-tild6337-3337-4531-a264-306436333637__07.webp", alt: "Робот для игры в шашки Робошашки: Гости выставки обсуждают процесс игры с роботом в шашки", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-roboshashki__06-tild3736-3630-4564-b964-333336653665__04.webp", alt: "Арендовать интерактивного робота для шашек для интерактивной игровой зоны: Ребёнок соревнуется с роботом-шашистом в игре на праздничном мероприятии", sourceStatus: 'page_content' as const },
  ],
  'arenda-senserobot': [
    { src: '/images/kiber-45/arenda-senserobot.webp', alt: "Каталожное изображение SenseRobot для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-senserobot__01-tild3761-6664-4265-b236-313865633932__02.webp", alt: "Робот-манипулятор для шахмат SenseRobot, интерактивный робот для игры в шахматы SenseRobot: Крупный план: манипулятор робота-шахматиста Senserobot готовится взять фигуру с шахматной", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-senserobot__02-tild3630-6162-4864-b262-303132393161__08.webp", alt: "Прокат интерактивного робота для шахмат SenseRobot для интерактивной игровой зоны: установлен на столе в помещении; манипулятор поднят вверх и ожидает хода соперника. Видны", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-senserobot__03-tild6535-6534-4332-b931-333537643739__05.webp", alt: "Робот с шахматной доской SenseRobot, робот-шахматист SenseRobot: Крупный план робота-шахматиста Senserobot сбоку: манипулятор находится над шахматной доской", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-senserobot__04-tild3936-3039-4339-a464-636466646534__011.webp", alt: "Заказать шахматного робота SenseRobot на выставочного стенда: Крупный план робота-шахматиста Senserobot на выставке: робот установлен на столе, сзади виден", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-senserobot__05-tild3063-3131-4232-b234-393062353332.webp", alt: "Шахматный робот SenseRobot: Соревнование по шахматам в большом технологическом помещении: на столах установлено много", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-senserobot__06-tild3230-3831-4936-a465-656439373766__noroot.webp", alt: "Арендовать интерактивного робота для шахмат SenseRobot для интерактивной игровой зоны: стоит на столе в комнате квартиры; перед ним человек, который играет с ним и обдумывает ход", sourceStatus: 'page_content' as const },
  ],
  'arenda-uv-box': [
    { src: '/images/kiber-45/arenda-uv-box.webp', alt: "Каталожное изображение UV-BOX для Hero; не используется как фото галереи.", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-uv-box__01-tild3730-6233-4534-b461-633133306461__09.webp", alt: "Виртуальная примерочная UV Box, интерактивный экран UV Box: Три UV Box выставлены в ряд в холле торгового центра; на каждом экране стилизованное", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-uv-box__02-tild3137-3933-4065-b034-616639376437__noroot.webp", alt: "Прокат цифрового консультанта UV Box для демонстрации возможностей: установлен в торговом центре; на экране изображён телефон с характеристиками, молодой человек", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-uv-box__03-tild3339-3062-4261-b731-663038613337__02.webp", alt: "Роботизированная витрина UV Box, цифровой консультант UV Box: Крупный план UV Box, перед которым стоит мужчина; на экране изображение серёжек, мужчина", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-uv-box__04-tild6134-3766-4335-b032-376433643865__012.webp", alt: "Заказать цифровой витрины UV Box на презентации: вмонтирован в стену на мероприятии Москва 20:30; на экране справочная информация, перед ним", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-uv-box__05-tild3230-3463-4365-a235-613931656262__08.webp", alt: "Интерактивная витрина UV Box: Три UV Box вмонтированы в стену, над ними логотип компании; на экранах разная одежда, которую", sourceStatus: 'page_content' as const },
    { src: "/images/kiber-94-preview/batch4-robot-cards/arenda-uv-box__06-tild3634-3530-4438-a133-643236646537__013.webp", alt: "Арендовать цифрового консультанта UV Box для HoReCa-зоны и события с гостями: установлен в холле торгового центра; перед ним стоит девушка в светлой кофте и чёрных брюках, а", sourceStatus: 'page_content' as const },
  ],
};


const curatedRobotCardSlugs = new Set([
  'arenda-kettybot',
  'arenda-unitree-g1',
  'arenda-bellabot',
  'arenda-unitree-go2',
  'arenda-xiaomi-cyberdog-2',
  'arenda-promobot-v4',
  'arenda-agibot-x2',
  'arenda-noetix-bumi',
  'arenda-unitree-r1',
  'arenda-unitree-h2',
  'arenda-robota-sofiya',
  'arenda-robota-ardi',
  'arenda-robota-tron',
  'arenda-robot-barmen',
  'arenda-robo-kofeyni',
  'arenda-mini-robo-kofeyni',
  'arenda-glambot',
  'arenda-sketchbot',
  'arenda-robota-hudozhnika-a4',
  'arenda-inchbot-l1-w-edu',
  'arenda-klipmeiker',
  'arenda-roboshashki',
  'arenda-senserobot',
  'arenda-uv-box',
]);

function assertCuratedRobotCardData(robot: RobotPageRecord, gallery: Array<{ src: string; alt: string; sourceStatus: 'page_content' }>, goshaQuote: string | undefined): void {
  if (!curatedRobotCardSlugs.has(robot.slug)) return;
  if (!goshaQuote) throw new Error(`Missing explicit per-robot Gosha quote for curated robot card: ${robot.slug}`);
  const galleryPhotoAssets = gallery.slice(1);
  if (galleryPhotoAssets.length < 6) throw new Error(`Missing explicit source-gallery runtime assets for curated robot card: ${robot.slug}`);
  if (galleryPhotoAssets.some((image) => image.src.includes('/images/kiber-45/'))) throw new Error(`Catalog/Hero image leaked into curated gallery: ${robot.slug}`);
  if (galleryPhotoAssets.some((image) => image.src.includes('__photo'))) throw new Error(`Legacy Tilda hero/background leaked into curated gallery: ${robot.slug}`);
  if (galleryPhotoAssets.some((image) => !image.src.startsWith('/images/kiber-94-preview/'))) throw new Error(`Curated gallery must use explicit public preview assets: ${robot.slug}`);
}

function fallbackGoshaQuoteForUnpreparedRobot(robot: RobotPageRecord): string {
  return `— ${robot.identity.name} пока ждёт отдельной цитаты Гоши: не буду притворяться, что эта карточка уже прошла редакторскую подготовку. Для review можно увидеть структуру, но перед публикацией нужен свой текст под модель и сценарий.

Напишите менеджеру: команда КИБЕР ПОРТАЛ уточнит задачу, площадку, тайминг и подготовит сценарий без роботических сюрпризов.`;
}

const ownerSeoBySlug: Record<string, OwnerSeoOverride> = {
  'arenda-agibot-x2': {
    title: "Аренда Agibot X2 — робот-гуманоид для выставки и презентации",
    description: "Аренда Agibot X2 для выставки, презентации или интерактивной зоны: сценарий выхода, подготовка площадки и сопровождение команды КИБЕР ПОРТАЛ.",
    h1: "Аренда робота-гуманоида Agibot X2",
    primaryKeyword: "аренда Agibot X2",
    secondaryKeywords: ["Agibot X2 аренда", "прокат Agibot X2", "заказать Agibot X2", "робот Agibot X2"],
  },
  'arenda-noetix-bumi': {
    title: "Аренда Noetix Bumi — компактный робот-гуманоид для интерактива",
    description: "Аренда Noetix Bumi для интерактивной зоны, образовательного показа или промо: подготовка сценария, настройка демонстрации и сопровождение КИБЕР ПОРТАЛ.",
    h1: "Аренда робота-гуманоида Noetix Bumi",
    primaryKeyword: "аренда Noetix Bumi",
    secondaryKeywords: ["Noetix Bumi аренда", "прокат Noetix Bumi", "заказать Noetix Bumi", "робот Noetix Bumi"],
  },
  'arenda-unitree-r1': {
    title: "Аренда Unitree R1 — робот-гуманоид для мероприятия и стенда",
    description: "Аренда Unitree R1 для выставки, презентации, шоурума или корпоративного события: сценарий демонстрации, безопасная зона и операторское сопровождение.",
    h1: "Аренда робота-гуманоида Unitree R1",
    primaryKeyword: "аренда Unitree R1",
    secondaryKeywords: ["Unitree R1 аренда", "прокат Unitree R1", "заказать Unitree R1", "робот Unitree R1"],
  },
  'arenda-unitree-h2': {
    title: "Аренда Unitree H2 — человекоподобный робот для шоу и презентации",
    description: "Аренда Unitree H2 для технологичных мероприятий: подготовка выхода, демонстрационного сценария, безопасной зоны движения и сопровождение оператора.",
    h1: "Аренда робота-гуманоида Unitree H2",
    primaryKeyword: "аренда Unitree H2",
    secondaryKeywords: ["Unitree H2 аренда", "прокат Unitree H2", "заказать Unitree H2", "робот Unitree H2"],
  },
  'arenda-robota-sofiya': {
    title: "Аренда робота София — гуманоид для презентации и события",
    description: "Аренда робота София для презентации, пресс-подхода или технологичного события: сценарий общения, подготовка вопросов и сопровождение команды КИБЕР ПОРТАЛ.",
    h1: "Аренда робота София",
    primaryKeyword: "аренда робота София",
    secondaryKeywords: ["робот София аренда", "прокат робот София", "заказать робот София", "робот София"],
  },
  'arenda-robota-ardi': {
    title: "Аренда робота Арди — интерактивный робот для мероприятий",
    description: "Аренда робота Арди для промо-зоны, выставки, открытия или корпоративного события: сценарий взаимодействия, подготовка площадки и сопровождение оператора.",
    h1: "Аренда робота Арди",
    primaryKeyword: "аренда робота Арди",
    secondaryKeywords: ["робот Арди аренда", "прокат робот Арди", "заказать робот Арди", "робот Арди"],
  },
  'arenda-robota-tron': {
    title: "Аренда Tron — модульный робот для мероприятия и шоу",
    description: "Аренда робота Tron для шоу, промо-зоны или технологичной демонстрации: подготовка сценария, проверка площадки и сопровождение команды КИБЕР ПОРТАЛ.",
    h1: "Аренда робота Tron",
    primaryKeyword: "аренда робота Tron",
    secondaryKeywords: ["робот Tron аренда", "прокат робот Tron", "заказать робот Tron", "робот Tron"],
  },
  'arenda-kettybot': {
    title: 'Аренда KettyBot — робот-официант для ресторана и мероприятия',
    description: 'Аренда KettyBot с доставкой, настройкой маршрутов, рекламным экраном и сопровождением для ресторана, банкета, отеля или выставки HoReCa.',
    h1: 'Аренда робота-официанта KettyBot',
    primaryKeyword: 'аренда KettyBot',
    secondaryKeywords: ['KettyBot аренда', 'робот-официант KettyBot', 'прокат KettyBot', 'заказать KettyBot', 'KettyBot для ресторана'],
  },
  'arenda-unitree-g1': {
    title: "Аренда Unitree G1 — робот-гуманоид для мероприятия",
    description: "Аренда Unitree G1 для выставки, презентации, фотозоны или технологичного шоу: сценарий выхода, подготовка площадки и операторское сопровождение.",
    h1: "Аренда робота-гуманоида Unitree G1",
    primaryKeyword: "аренда Unitree G1",
    secondaryKeywords: ["Unitree G1 аренда", "прокат Unitree G1", "заказать Unitree G1", "робот Unitree G1", "Unitree G1 для мероприятия"],
  },
  'arenda-bellabot': {
    title: "Аренда BellaBot — робот-официант для ресторана и мероприятия",
    description: "Аренда BellaBot для ресторана, банкета, отеля или выставки HoReCa: доставка блюд, вау-эффект, настройка маршрутов и сопровождение.",
    h1: "Аренда робота-официанта BellaBot",
    primaryKeyword: "аренда BellaBot",
    secondaryKeywords: ["BellaBot аренда", "робот-официант BellaBot", "прокат BellaBot", "заказать BellaBot", "BellaBot для ресторана"],
  },
  'arenda-unitree-go2': {
    title: "Аренда Unitree Go2 — робот-собака для мероприятия",
    description: "Аренда Unitree Go2 для выставки, фотозоны, детского праздника или корпоративного события: трюки, интерактив с гостями и операторское сопровождение.",
    h1: "Аренда робота-собаки Unitree Go2",
    primaryKeyword: "аренда Unitree Go2",
    secondaryKeywords: ["Unitree Go2 аренда", "прокат Unitree Go2", "заказать Unitree Go2", "робот-собака Unitree Go2", "Unitree Go2 для мероприятия"],
  },
  'arenda-xiaomi-cyberdog-2': {
    title: "Аренда Xiaomi CyberDog 2 — робот-собака для шоу и промо",
    description: "Аренда Xiaomi CyberDog 2 для технологичной выставки, промо-акции, фотозоны или съёмки контента: трюки, интерактив и сопровождение.",
    h1: "Аренда робота-собаки Xiaomi CyberDog 2",
    primaryKeyword: "аренда Xiaomi CyberDog 2",
    secondaryKeywords: ["Xiaomi CyberDog 2 аренда", "прокат Xiaomi CyberDog 2", "заказать Xiaomi CyberDog 2", "робот-собака Xiaomi CyberDog 2", "CyberDog 2 для мероприятия"],
  },
  'arenda-promobot-v4': {
    title: "Аренда Promobot V4 — промо-робот для выставки и события",
    description: "Аренда Promobot V4 для выставочного стенда, открытия, форума или корпоративного события: общение с гостями, экран, сценарий и сопровождение.",
    h1: "Аренда Promobot V4",
    primaryKeyword: "аренда Promobot V4",
    secondaryKeywords: ["Promobot V4 аренда", "прокат Promobot V4", "заказать Promobot V4", "промо-робот Promobot V4", "Promobot V4 для выставки"],
  },
  'arenda-robot-barmen': { title: "Аренда робота-бармена «Робобар» для мероприятий", description: "Прокат робота-бармена «Робобар»: алко- и безалкогольные коктейли за минуту, заказ через планшет, оператор на площадке. Москва и регионы.", h1: "Аренда робот-бармен «Робобар»", primaryKeyword: "аренда робота-бармена Робобар", secondaryKeywords: ["прокат робота-бармена «Робобар»", "заказать робота-бармена «Робобар» на мероприятие", "робота-бармена «Робобар» для выставки", "робота-бармена «Робобар» для корпоративного мероприятия"] },
  'arenda-robo-kofeyni': { title: "Аренда Robo-Кофейни для мероприятий", description: "Робо-кофейня варит 6 видов кофе роборукой без бариста и без подключения к воде. Прокат для выставок и форумов по Москве и России.", h1: "Аренда Robo-Кофейни", primaryKeyword: "аренда робо-кофейни", secondaryKeywords: ["прокат робота-кофейни", "заказать Robo-Кофейню на мероприятие", "Robo-Кофейня для выставки", "Robo-Кофейня для корпоративного мероприятия", "сервисный робот для мероприятия", "робот для HoReCa и промо-зоны"] },
  'arenda-mini-robo-kofeyni': { title: "Аренда мини Robo-Кофейни для мероприятий", description: "Мини робо-кофейня готовит 7 видов кофе и мороженое в компактном модуле 120×140 см. Аренда «под ключ» для мероприятий по всей России.", h1: "Аренда мини Robo-Кофейни", primaryKeyword: "аренда мини робо-кофейни", secondaryKeywords: ["прокат мини робо-кофейни", "заказать мини Robo-Кофейню на мероприятие", "мини Robo-Кофейня для выставки", "мини Robo-Кофейня для корпоративного мероприятия", "сервисный робот для мероприятия", "робот для HoReCa и промо-зоны"] },
  'arenda-glambot': { title: "Аренда GlamBot для фото- и видеозон", description: "GlamBot — робот-камера для slow-motion съёмки в стиле красной дорожки. Прокат для премий, показов и открытий по Москве и всей России.", h1: "Аренда GlamBot", primaryKeyword: "аренда GlamBot", secondaryKeywords: ["прокат GlamBot", "заказать GlamBot на мероприятие", "GlamBot для выставки", "GlamBot для корпоративного мероприятия", "робот для фотозоны", "робот для эффектной видеосъёмки"] },
  'arenda-sketchbot': { title: "Аренда робота-художника Sketchbot для мероприятий", description: "Прокат робота-художника Sketchbot: ИИ-портреты гостей за минуту, брендирование логотипом, доставка и оператор по Москве и регионам. Расчёт за час.", h1: "Аренда Sketchbot", primaryKeyword: "аренда Sketchbot", secondaryKeywords: ["прокат Sketchbot", "заказать Sketchbot на мероприятие", "Sketchbot для выставки", "Sketchbot для корпоративного мероприятия", "робот-художник на мероприятие", "робот для творческой зоны"] },
'arenda-robota-hudozhnika-a4': { title: "Аренда робота-художника A4 для мероприятий", description: "Робот-художник A4 рисует портреты гостей на бумаге: творческая зона для свадеб, премий, корпоративов и стендов. Расчёт аренды под событие.", h1: "Аренда робота-художника A4", primaryKeyword: "аренда робота-художника A4", secondaryKeywords: ["прокат робота-художника A4", "заказать робота-художника A4 на мероприятие", "робот-художник A4 для выставки", "робот-художник A4 для корпоративного мероприятия", "робот-художник на мероприятие", "робот для творческой зоны"] },



  'arenda-inchbot-l1-w-edu': { title: "Аренда Inchbot L1-W EDU — робот-собака для STEM и промо", description: "Аренда Inchbot L1-W EDU: робот-собака для образовательной зоны, промо, детского события или технологичного стенда. Доставка, настройка и оператор.", h1: "Аренда робота-собаки Inchbot L1-W EDU", primaryKeyword: "аренда Inchbot L1-W EDU", secondaryKeywords: ["Inchbot L1-W EDU аренда", "прокат Inchbot L1-W EDU", "заказать Inchbot L1-W EDU", "робот-собака Inchbot для мероприятия", "Inchbot робот-собака"] },
  'arenda-klipmeiker': { title: "Аренда Клипмейкера — роботизированная камера для event-видео", description: "Аренда Клипмейкера для мероприятия: роботизированная камера снимает динамичные ролики гостей, бренд-зоны и промо. Сценарий, свет и оператор.", h1: "Аренда робота Клипмейкер", primaryKeyword: "аренда Клипмейкер", secondaryKeywords: ["Клипмейкер аренда", "прокат Клипмейкера", "заказать Клипмейкер на мероприятие", "робот для видеосъёмки", "роботизированная камера для мероприятия"] },
  'arenda-roboshashki': { title: "Аренда Робошашек — игровой робот для стенда и интерактива", description: "Аренда Робошашек: роботизированная игровая зона с шашками для выставки, семейного дня, корпоративного события или промо. Оператор и настройка.", h1: "Аренда робота для игры в шашки", primaryKeyword: "аренда робошашки", secondaryKeywords: ["Робошашки аренда", "прокат робота для шашек", "робот для игры в шашки", "робот шашки", "игровой робот на мероприятие"] },
  'arenda-senserobot': { title: "Аренда SenseRobot — робот-шахматист для мероприятия", description: "Аренда SenseRobot: робот-шахматист для интеллектуальной игровой зоны, выставки, клуба, школы или корпоративного события. Настройка и оператор.", h1: "Аренда робота-шахматиста SenseRobot", primaryKeyword: "аренда SenseRobot", secondaryKeywords: ["SenseRobot аренда", "прокат SenseRobot", "робот шахматист аренда", "аренда робота шахматиста", "SenseRobot шахматы"] },
  'arenda-uv-box': { title: "Аренда UV-BOX — интерактивная витрина для презентации продукта", description: "Аренда UV-BOX: интерактивная сенсорная витрина с 3D-эффектом для выставки, шоурума, презентации продукта или retail-зоны.", h1: "Аренда интерактивной витрины UV-BOX", primaryKeyword: "аренда UV-BOX", secondaryKeywords: ["UV-BOX аренда", "прокат UV-BOX", "интерактивная витрина UV-BOX", "аренда интерактивной витрины", "сенсорная витрина для мероприятия"] },
};

const ownerSeoIntentBySlug: Record<string, OwnerSeoIntent> = {
  'arenda-agibot-x2': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда Agibot X2",
    secondaryKeywords: ["Agibot X2 аренда", "прокат Agibot X2", "заказать Agibot X2", "робот Agibot X2"],
    modelNameVariants: ["Agibot X2", "робот Agibot X2", "Агибот X2", "Agibot", "робот-гуманоид Agibot X2"],
    entitySynonyms: ["робот-гуманоид", "человекоподобный робот", "AI-гуманоид", "робот для выставки", "робот для презентации"],
    aiAgentHints: [
      "Страница отвечает на коммерческий запрос аренды конкретной модели, а не на общий запрос по роботам-гуманоидам.",
      "Generic спрос по гуманоидным роботам относится к подборкам и статьям; карточка удерживает exact-model intent.",
      "Цена, сценарий, доступность, зона движения и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.",
    ],
    entity: { type: 'Robot', name: "Agibot X2", model: "Agibot X2", category: 'humanoid_robot', canonicalPath: "/preview/kiber-94/robot-card/arenda-agibot-x2/" },
    isCrawlerOnlyText: false,
  },
  'arenda-noetix-bumi': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда Noetix Bumi",
    secondaryKeywords: ["Noetix Bumi аренда", "прокат Noetix Bumi", "заказать Noetix Bumi", "робот Noetix Bumi"],
    modelNameVariants: ["Noetix Bumi", "робот Noetix Bumi", "Ноэтикс Буми", "Bumi", "компактный гуманоид Noetix Bumi"],
    entitySynonyms: ["компактный робот-гуманоид", "образовательный робот", "интерактивный робот", "человекоподобный робот", "робот для детей и гостей"],
    aiAgentHints: [
      "Страница отвечает на коммерческий запрос аренды конкретной модели, а не на общий запрос по роботам-гуманоидам.",
      "Generic спрос по гуманоидным роботам относится к подборкам и статьям; карточка удерживает exact-model intent.",
      "Цена, сценарий, доступность, зона движения и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.",
    ],
    entity: { type: 'Robot', name: "Noetix Bumi", model: "Noetix Bumi", category: 'humanoid_robot', canonicalPath: "/preview/kiber-94/robot-card/arenda-noetix-bumi/" },
    isCrawlerOnlyText: false,
  },
  'arenda-unitree-r1': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда Unitree R1",
    secondaryKeywords: ["Unitree R1 аренда", "прокат Unitree R1", "заказать Unitree R1", "робот Unitree R1"],
    modelNameVariants: ["Unitree R1", "робот Unitree R1", "Юнитри R1", "Юнитри Эр 1", "Unitree R1 humanoid"],
    entitySynonyms: ["робот-гуманоид", "ходящий робот", "человекоподобный робот", "демонстрационный робот", "робот для технологичного стенда"],
    aiAgentHints: [
      "Страница отвечает на коммерческий запрос аренды конкретной модели, а не на общий запрос по роботам-гуманоидам.",
      "Generic спрос по гуманоидным роботам относится к подборкам и статьям; карточка удерживает exact-model intent.",
      "Цена, сценарий, доступность, зона движения и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.",
    ],
    entity: { type: 'Robot', name: "Unitree R1", model: "Unitree R1", category: 'humanoid_robot', canonicalPath: "/preview/kiber-94/robot-card/arenda-unitree-r1/" },
    isCrawlerOnlyText: false,
  },
  'arenda-unitree-h2': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда Unitree H2",
    secondaryKeywords: ["Unitree H2 аренда", "прокат Unitree H2", "заказать Unitree H2", "робот Unitree H2"],
    modelNameVariants: ["Unitree H2", "робот Unitree H2", "Юнитри H2", "Юнитри Эйч 2", "Unitree H2 humanoid"],
    entitySynonyms: ["человекоподобный робот", "робот-гуманоид", "ходящий робот", "робот для шоу", "робот для презентации"],
    aiAgentHints: [
      "Страница отвечает на коммерческий запрос аренды конкретной модели, а не на общий запрос по роботам-гуманоидам.",
      "Generic спрос по гуманоидным роботам относится к подборкам и статьям; карточка удерживает exact-model intent.",
      "Цена, сценарий, доступность, зона движения и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.",
    ],
    entity: { type: 'Robot', name: "Unitree H2", model: "Unitree H2", category: 'humanoid_robot', canonicalPath: "/preview/kiber-94/robot-card/arenda-unitree-h2/" },
    isCrawlerOnlyText: false,
  },
  'arenda-robota-sofiya': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда робота София",
    secondaryKeywords: ["робот София аренда", "прокат робот София", "заказать робот София", "робот София"],
    modelNameVariants: ["робот София", "София", "Sophia robot", "гуманоид София", "робот-гуманоид София"],
    entitySynonyms: ["робот-гуманоид", "человекоподобный робот", "интерактивный робот", "робот для презентации", "робот для пресс-события"],
    aiAgentHints: [
      "Страница отвечает на коммерческий запрос аренды конкретной модели, а не на общий запрос по роботам-гуманоидам.",
      "Generic спрос по гуманоидным роботам относится к подборкам и статьям; карточка удерживает exact-model intent.",
      "Цена, сценарий, доступность, зона движения и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.",
    ],
    entity: { type: 'Robot', name: "робот София", model: "София", category: 'humanoid_robot', canonicalPath: "/preview/kiber-94/robot-card/arenda-robota-sofiya/" },
    isCrawlerOnlyText: false,
  },
  'arenda-robota-ardi': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда робота Арди",
    secondaryKeywords: ["робот Арди аренда", "прокат робот Арди", "заказать робот Арди", "робот Арди"],
    modelNameVariants: ["робот Арди", "Арди", "Ardi robot", "робот Ardi", "интерактивный робот Арди"],
    entitySynonyms: ["интерактивный робот", "робот-промоутер", "робот для мероприятия", "робот-гуманоид", "робот для промо-зоны"],
    aiAgentHints: [
      "Страница отвечает на коммерческий запрос аренды конкретной модели, а не на общий запрос по роботам-гуманоидам.",
      "Generic спрос по гуманоидным роботам относится к подборкам и статьям; карточка удерживает exact-model intent.",
      "Цена, сценарий, доступность, зона движения и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.",
    ],
    entity: { type: 'Robot', name: "робот Арди", model: "Арди", category: 'humanoid_robot', canonicalPath: "/preview/kiber-94/robot-card/arenda-robota-ardi/" },
    isCrawlerOnlyText: false,
  },
  'arenda-robota-tron': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда робота Tron",
    secondaryKeywords: ["робот Tron аренда", "прокат робот Tron", "заказать робот Tron", "робот Tron"],
    modelNameVariants: ["робот Tron", "Tron", "модульный робот Tron", "Трон", "робот Трон"],
    entitySynonyms: ["модульный робот", "интерактивный робот", "робот для шоу", "робот для мероприятия", "робот для промо"],
    aiAgentHints: [
      "Страница отвечает на коммерческий запрос аренды конкретной модели, а не на общий запрос по роботам-гуманоидам.",
      "Generic спрос по гуманоидным роботам относится к подборкам и статьям; карточка удерживает exact-model intent.",
      "Цена, сценарий, доступность, зона движения и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.",
    ],
    entity: { type: 'Robot', name: "робот Tron", model: "Tron", category: 'humanoid_robot', canonicalPath: "/preview/kiber-94/robot-card/arenda-robota-tron/" },
    isCrawlerOnlyText: false,
  },
  'arenda-kettybot': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: 'аренда KettyBot',
    secondaryKeywords: ['KettyBot аренда', 'робот-официант KettyBot', 'прокат KettyBot', 'заказать KettyBot', 'KettyBot для ресторана'],
    modelNameVariants: ['KettyBot', 'Ketty Bot', 'Кеттибот', 'Кэтибот', 'робот KettyBot', 'Pudu KettyBot'],
    entitySynonyms: ['робот-официант', 'сервисный робот', 'робот-доставщик', 'робот для ресторана', 'робот для HoReCa'],
    aiAgentHints: [
      'Страница отвечает на коммерческий запрос аренды конкретной модели KettyBot.',
      'Generic запросы про аренду робота-официанта принадлежат подборке/сценарной странице, а не primaryKeyword этой карточки.',
      'Wordstat показал низкий exact-model спрос, но наличие выдачи и entity-запроса robot-waiter KettyBot подтверждает смысл exact-model карточки.',
      'Цена, маршрут, длительность, брендирование и условия площадки уточняются менеджером КИБЕР ПОРТАЛ.',
    ],
    entity: { type: 'Robot', name: 'KettyBot', model: 'KettyBot', manufacturer: 'Pudu Robotics', category: 'service_robot', canonicalPath: '/preview/kiber-94/robot-card/arenda-kettybot/' },
    isCrawlerOnlyText: false,
  },
  'arenda-unitree-g1': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда Unitree G1",
    secondaryKeywords: ["Unitree G1 аренда", "прокат Unitree G1", "заказать Unitree G1", "робот Unitree G1", "Unitree G1 для мероприятия"],
    modelNameVariants: ["Unitree G1", "робот Unitree G1", "Юнитри G1", "Unitree G1 humanoid", "робот-гуманоид Unitree G1"],
    entitySynonyms: ["робот-гуманоид", "человекоподобный робот", "робот для выставки", "интерактивный робот", "робот для презентации"],
    aiAgentHints: ["Страница отвечает на коммерческий запрос аренды конкретной модели Unitree G1.", "Generic спрос по категории относится к подборкам и статьям; карточка удерживает exact-model intent.", "Цена, сценарий, доступность, зона работы и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ."],
    entity: { type: 'Robot', name: "Unitree G1", model: "Unitree G1", category: "humanoid_robot", canonicalPath: "/preview/kiber-94/robot-card/arenda-unitree-g1/" },
    isCrawlerOnlyText: false,
  },
  'arenda-bellabot': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда BellaBot",
    secondaryKeywords: ["BellaBot аренда", "робот-официант BellaBot", "прокат BellaBot", "заказать BellaBot", "BellaBot для ресторана"],
    modelNameVariants: ["BellaBot", "Bella Bot", "Беллабот", "робот BellaBot", "Pudu BellaBot"],
    entitySynonyms: ["робот-официант", "сервисный робот", "робот-доставщик", "робот для ресторана", "робот для HoReCa"],
    aiAgentHints: ["Страница отвечает на коммерческий запрос аренды конкретной модели BellaBot.", "Generic спрос по категории относится к подборкам и статьям; карточка удерживает exact-model intent.", "Цена, сценарий, доступность, зона работы и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ."],
    entity: { type: 'Robot', name: "BellaBot", model: "BellaBot", category: "service_robot", canonicalPath: "/preview/kiber-94/robot-card/arenda-bellabot/" },
    isCrawlerOnlyText: false,
  },
  'arenda-unitree-go2': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда Unitree Go2",
    secondaryKeywords: ["Unitree Go2 аренда", "прокат Unitree Go2", "заказать Unitree Go2", "робот-собака Unitree Go2", "Unitree Go2 для мероприятия"],
    modelNameVariants: ["Unitree Go2", "робот Unitree Go2", "Юнитри Go2", "робот-собака Unitree Go2", "Unitree Go2 quadruped"],
    entitySynonyms: ["робот-собака", "робопёс", "интерактивная робособака", "четвероногий робот", "робот для фотозоны"],
    aiAgentHints: ["Страница отвечает на коммерческий запрос аренды конкретной модели Unitree Go2.", "Generic спрос по категории относится к подборкам и статьям; карточка удерживает exact-model intent.", "Цена, сценарий, доступность, зона работы и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ."],
    entity: { type: 'Robot', name: "Unitree Go2", model: "Unitree Go2", category: "robot_dog", canonicalPath: "/preview/kiber-94/robot-card/arenda-unitree-go2/" },
    isCrawlerOnlyText: false,
  },
  'arenda-xiaomi-cyberdog-2': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда Xiaomi CyberDog 2",
    secondaryKeywords: ["Xiaomi CyberDog 2 аренда", "прокат Xiaomi CyberDog 2", "заказать Xiaomi CyberDog 2", "робот-собака Xiaomi CyberDog 2", "CyberDog 2 для мероприятия"],
    modelNameVariants: ["Xiaomi CyberDog 2", "CyberDog 2", "робот Xiaomi CyberDog 2", "Кибердог 2", "робот-собака CyberDog 2"],
    entitySynonyms: ["робот-собака", "робопёс", "интерактивная робособака", "робот для промо", "робот для выставки"],
    aiAgentHints: ["Страница отвечает на коммерческий запрос аренды конкретной модели Xiaomi CyberDog 2.", "Generic спрос по категории относится к подборкам и статьям; карточка удерживает exact-model intent.", "Цена, сценарий, доступность, зона работы и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ."],
    entity: { type: 'Robot', name: "Xiaomi CyberDog 2", model: "Xiaomi CyberDog 2", category: "robot_dog", canonicalPath: "/preview/kiber-94/robot-card/arenda-xiaomi-cyberdog-2/" },
    isCrawlerOnlyText: false,
  },
  'arenda-promobot-v4': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: "аренда Promobot V4",
    secondaryKeywords: ["Promobot V4 аренда", "прокат Promobot V4", "заказать Promobot V4", "промо-робот Promobot V4", "Promobot V4 для выставки"],
    modelNameVariants: ["Promobot V4", "Промобот V4", "робот Promobot V4", "Promobot", "промо-робот Promobot V4"],
    entitySynonyms: ["промо-робот", "сервисный робот", "робот-консультант", "робот для выставки", "робот для промо-зоны"],
    aiAgentHints: ["Страница отвечает на коммерческий запрос аренды конкретной модели Promobot V4.", "Generic спрос по категории относится к подборкам и статьям; карточка удерживает exact-model intent.", "Цена, сценарий, доступность, зона работы и сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ."],
    entity: { type: 'Robot', name: "Promobot V4", model: "Promobot V4", category: "robot_service", canonicalPath: "/preview/kiber-94/robot-card/arenda-promobot-v4/" },
    isCrawlerOnlyText: false,
  },
  'arenda-robot-barmen': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда робота-бармена Робобар", secondaryKeywords: ["прокат робота-бармена «Робобар»", "заказать робота-бармена «Робобар» на мероприятие", "робота-бармена «Робобар» для выставки", "робота-бармена «Робобар» для корпоративного мероприятия"], modelNameVariants: ["робот-бармен «Робобар»", "робота-бармена «Робобар»"], entitySynonyms: ["робот для мероприятия", "интерактивная зона", "service_robot"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, сценарий, доступность и требования площадки подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "робот-бармен «Робобар»", model: "робот-бармен «Робобар»", category: "service_robot", canonicalPath: '/robots/arenda-robot-barmen/' }, isCrawlerOnlyText: false },
  'arenda-robo-kofeyni': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда робо-кофейни", secondaryKeywords: ["прокат робота-кофейни", "заказать Robo-Кофейню на мероприятие", "Robo-Кофейня для выставки", "Robo-Кофейня для корпоративного мероприятия", "сервисный робот для мероприятия", "робот для HoReCa и промо-зоны"], modelNameVariants: ["Robo-Кофейня", "Robo-Кофейня"], entitySynonyms: ["робот для мероприятия", "интерактивная зона", "coffee_robot"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, сценарий, доступность и требования площадки подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "Robo-Кофейня", model: "Robo-Кофейня", category: "coffee_robot", canonicalPath: '/robots/arenda-robo-kofeyni/' }, isCrawlerOnlyText: false },
  'arenda-mini-robo-kofeyni': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда мини робо-кофейни", secondaryKeywords: ["прокат мини робо-кофейни", "заказать мини Robo-Кофейню на мероприятие", "мини Robo-Кофейня для выставки", "мини Robo-Кофейня для корпоративного мероприятия", "сервисный робот для мероприятия", "робот для HoReCa и промо-зоны"], modelNameVariants: ["мини Robo-Кофейня", "мини Robo-Кофейня"], entitySynonyms: ["робот для мероприятия", "интерактивная зона", "coffee_robot"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, сценарий, доступность и требования площадки подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "мини Robo-Кофейня", model: "мини Robo-Кофейня", category: "coffee_robot", canonicalPath: '/robots/arenda-mini-robo-kofeyni/' }, isCrawlerOnlyText: false },
  'arenda-glambot': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда GlamBot", secondaryKeywords: ["прокат GlamBot", "заказать GlamBot на мероприятие", "GlamBot для выставки", "GlamBot для корпоративного мероприятия", "робот для фотозоны", "робот для эффектной видеосъёмки"], modelNameVariants: ["GlamBot", "робота GlamBot"], entitySynonyms: ["робот для мероприятия", "интерактивная зона", "media_robot"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, сценарий, доступность и требования площадки подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "GlamBot", model: "GlamBot", category: "media_robot", canonicalPath: '/robots/arenda-glambot/' }, isCrawlerOnlyText: false },
  'arenda-sketchbot': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда Sketchbot", secondaryKeywords: ["прокат Sketchbot", "заказать Sketchbot на мероприятие", "Sketchbot для выставки", "Sketchbot для корпоративного мероприятия", "робот-художник на мероприятие", "робот для творческой зоны"], modelNameVariants: ["Sketchbot", "робота-художника Sketchbot"], entitySynonyms: ["робот для мероприятия", "интерактивная зона", "drawing_robot"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, сценарий, доступность и требования площадки подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "Sketchbot", model: "Sketchbot", category: "drawing_robot", canonicalPath: '/robots/arenda-sketchbot/' }, isCrawlerOnlyText: false },
  'arenda-robota-hudozhnika-a4': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда робота-художника A4", secondaryKeywords: ["прокат робота-художника A4", "заказать робота-художника A4 на мероприятие", "робот-художник A4 для выставки", "робот-художник A4 для корпоративного мероприятия", "робот-художник на мероприятие", "робот для творческой зоны"], modelNameVariants: ["робот-художник A4", "робот-художник A4"], entitySynonyms: ["робот для мероприятия", "интерактивная зона", "drawing_robot"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, сценарий, доступность и требования площадки подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "робот-художник A4", model: "робот-художник A4", category: "drawing_robot", canonicalPath: '/robots/arenda-robota-hudozhnika-a4/' }, isCrawlerOnlyText: false },


  'arenda-inchbot-l1-w-edu': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда Inchbot L1-W EDU", secondaryKeywords: ["Inchbot L1-W EDU аренда", "прокат Inchbot L1-W EDU", "заказать Inchbot L1-W EDU", "робот-собака Inchbot для мероприятия", "Inchbot робот-собака"], modelNameVariants: ["робота-собаки Inchbot L1-W EDU", "собаки Inchbot L1-W EDU"], entitySynonyms: ["робот-собака", "четвероногий робот", "образовательный робот", "робот для детского события"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, доступность, требования площадки и операторское сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "робота-собаки Inchbot L1-W EDU", model: "робота-собаки Inchbot L1-W EDU", category: "robot_dog", canonicalPath: '/robots/arenda-inchbot-l1-w-edu/' }, isCrawlerOnlyText: false },
  'arenda-klipmeiker': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда Клипмейкер", secondaryKeywords: ["Клипмейкер аренда", "прокат Клипмейкера", "заказать Клипмейкер на мероприятие", "робот для видеосъёмки", "роботизированная камера для мероприятия"], modelNameVariants: ["робота Клипмейкер", "Клипмейкер"], entitySynonyms: ["роботизированная камера", "робот для видеосъёмки", "медиа-робот", "видеозона"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, доступность, требования площадки и операторское сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "робота Клипмейкер", model: "робота Клипмейкер", category: "media_robot", canonicalPath: '/robots/arenda-klipmeiker/' }, isCrawlerOnlyText: false },
  'arenda-roboshashki': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда робошашки", secondaryKeywords: ["Робошашки аренда", "прокат робота для шашек", "робот для игры в шашки", "робот шашки", "игровой робот на мероприятие"], modelNameVariants: ["робота для игры в шашки", "для игры в шашки"], entitySynonyms: ["игровой робот", "робот для шашек", "интерактивная игровая зона", "робот-манипулятор"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, доступность, требования площадки и операторское сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "робота для игры в шашки", model: "робота для игры в шашки", category: "game_robot", canonicalPath: '/robots/arenda-roboshashki/' }, isCrawlerOnlyText: false },
  'arenda-senserobot': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда SenseRobot", secondaryKeywords: ["SenseRobot аренда", "прокат SenseRobot", "робот шахматист аренда", "аренда робота шахматиста", "SenseRobot шахматы"], modelNameVariants: ["робота-шахматиста SenseRobot", "шахматиста SenseRobot"], entitySynonyms: ["робот-шахматист", "шахматный робот", "интеллектуальная игровая зона", "робот-манипулятор"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, доступность, требования площадки и операторское сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "робота-шахматиста SenseRobot", model: "робота-шахматиста SenseRobot", category: "chess_robot", canonicalPath: '/robots/arenda-senserobot/' }, isCrawlerOnlyText: false },
  'arenda-uv-box': { pageType: 'robot_card', pageIntent: 'commercial_robot_rental', primaryKeyword: "аренда UV-BOX", secondaryKeywords: ["UV-BOX аренда", "прокат UV-BOX", "интерактивная витрина UV-BOX", "аренда интерактивной витрины", "сенсорная витрина для мероприятия"], modelNameVariants: ["интерактивной витрины UV-BOX", "интерактивной витрины UV-BOX"], entitySynonyms: ["интерактивная витрина", "сенсорная витрина", "3D-витрина", "digital retail display"], aiAgentHints: ['Страница отвечает на запрос аренды этого робота и помогает понять, подойдёт ли он под событие.', 'Цена, доступность, требования площадки и операторское сопровождение подтверждаются менеджером КИБЕР ПОРТАЛ.'], entity: { type: 'Robot', name: "интерактивной витрины UV-BOX", model: "интерактивной витрины UV-BOX", category: "interactive_display", canonicalPath: '/robots/arenda-uv-box/' }, isCrawlerOnlyText: false },
};

const ownerFaqBySlug: Record<string, OwnerFaqOverride> = {
  'arenda-agibot-x2': [
    { question: "Для каких мероприятий подходит Agibot X2?", answer: "Agibot x2 используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда Agibot X2?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },    { question: "Можно ли адаптировать Agibot X2 под бренд?", answer: "Да, для Agibot X2 можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли Agibot X2 для выставочного стенда?", answer: "Да, Agibot X2 помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой Agibot X2?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-noetix-bumi': [
    { question: "Для каких мероприятий подходит Noetix Bumi?", answer: "Noetix bumi используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда Noetix Bumi?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },    { question: "Можно ли адаптировать Noetix Bumi под бренд?", answer: "Да, для Noetix Bumi можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли Noetix Bumi для выставочного стенда?", answer: "Да, Noetix Bumi помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой Noetix Bumi?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-unitree-r1': [
    { question: "Для каких мероприятий подходит Unitree R1?", answer: "Unitree r1 используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда Unitree R1?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },    { question: "Можно ли адаптировать Unitree R1 под бренд?", answer: "Да, для Unitree R1 можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли Unitree R1 для выставочного стенда?", answer: "Да, Unitree R1 помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой Unitree R1?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-unitree-h2': [
    { question: "Для каких мероприятий подходит Unitree H2?", answer: "Unitree h2 используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда Unitree H2?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },    { question: "Можно ли адаптировать Unitree H2 под бренд?", answer: "Да, для Unitree H2 можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли Unitree H2 для выставочного стенда?", answer: "Да, Unitree H2 помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой Unitree H2?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-robota-sofiya': [
    { question: "Для каких мероприятий подходит робота София?", answer: "Робота софия используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда робота София?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },    { question: "Можно ли адаптировать робот София под бренд?", answer: "Да, для робот София можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли робот София для выставочного стенда?", answer: "Да, робот София помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой робот София?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-robota-ardi': [
    { question: "Для каких мероприятий подходит робота Арди?", answer: "Робота арди используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда робота Арди?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },    { question: "Можно ли адаптировать робот Арди под бренд?", answer: "Да, для робот Арди можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли робот Арди для выставочного стенда?", answer: "Да, робот Арди помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой робот Арди?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-robota-tron': [
    { question: "Для каких мероприятий подходит робота Tron?", answer: "Робота tron используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда робота Tron?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },    { question: "Можно ли адаптировать робот Tron под бренд?", answer: "Да, для робот Tron можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли робот Tron для выставочного стенда?", answer: "Да, робот Tron помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой робот Tron?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-kettybot': [
    { question: 'Для каких мероприятий подходит KettyBot?', answer: 'KettyBot подходит для ресторанов, кафе, отелей, банкетов, фуршетов и выставочных зон HoReCa. Робот помогает доставлять блюда, напитки или промо-материалы по заранее настроенному маршруту и одновременно создаёт заметный технологичный сервис.' },
    { question: 'Сколько стоит аренда KettyBot?', answer: 'Стоимость зависит от даты, города, длительности аренды, маршрутов, брендирования экрана и необходимости операторского сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит план зала, задачу робота и подготовит расчёт под ваш формат.' },
    { question: 'Нужен ли оператор для робота-официанта?', answer: 'Для мероприятия мы рекомендуем сопровождение: оператор помогает настроить маршрут, проверить проходы, объяснить персоналу загрузку подносов и быстро решить вопросы на площадке.' },
    { question: 'Какие требования к площадке?', answer: 'Нужен ровный сухой пол, достаточная ширина проходов, понятные точки остановки и стабильная зона движения без высоких порогов. Перед запуском команда проверяет маршрут и расстановку мебели.' },
    { question: 'Можно ли использовать KettyBot как рекламный экран?', answer: 'Да, экран робота можно использовать для приветствий, акций, меню, логотипа или коротких брендированных сообщений. Материалы и сценарий показа лучше согласовать заранее, чтобы реклама не мешала сервисной задаче.' },    { question: "Можно ли адаптировать KettyBot под бренд?", answer: "Да, для KettyBot можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли KettyBot для выставочного стенда?", answer: "Да, KettyBot помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой KettyBot?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-robot-barmen': [
    { question: "Для каких мероприятий подходит робот-бармен «Робобар»?", answer: "Робобар подходит для корпоративов, выставок, презентаций, закрытых вечеринок, лаунж-зон и welcome-зон, где бар должен стать заметной частью события, а не просто точкой выдачи напитков." },
    { question: "Что именно делает Робобар на площадке?", answer: "Роботизированная барная станция помогает принимать заказ через экран, готовить коктейли по согласованному меню и превращать процесс приготовления напитка в зрелищный интерактив для гостей." },
    { question: "Можно ли делать безалкогольные коктейли?", answer: "Да, меню можно собрать под формат события: безалкогольные миксы, фирменные напитки бренда, классические коктейли или ограниченный набор позиций, чтобы не создавать очередь." },
    { question: "Нужен ли оператор рядом с роботом-барменом?", answer: "Да, оператор нужен для запуска, контроля безопасной зоны, помощи гостям с интерфейсом и быстрой корректировки сценария, если меняется поток людей или условия площадки." },
    { question: "Какие требования к площадке для Робобара?", answer: "Нужна ровная зона под барную станцию, доступ к электропитанию, место для очереди, запас расходников и согласование правил площадки по напиткам, воде, льду и обслуживанию гостей." },
    { question: "Сколько гостей успеет обслужить робот-бармен?", answer: "Пропускная способность зависит от меню, числа ингредиентов, длительности смены и поведения гостей. Для мероприятия лучше заранее рассчитать поток и оставить запас по времени." },
    { question: "Можно ли брендировать меню и зону Робобара?", answer: "Да, обычно брендируют экран, названия напитков, стойку, подачу и сценарий общения. Детали зависят от площадки, сроков подготовки и доступных материалов." },
    { question: "Сколько стоит аренда робота-бармена?", answer: "Стоимость считается под дату, город, длительность, меню, логистику, расходники и состав сопровождения. Менеджер уточнит вводные и подготовит расчёт под событие." }
  ],

  'arenda-robo-kofeyni': [
    { question: "Для каких мероприятий подходит Robo-Кофейня?", answer: "Robo-Кофейня подходит для выставок, форумов, бизнес-завтраков, конференций, автосалонов, девелоперских офисов и бренд-зон, где кофе нужен как сервис и как технологичный повод для контакта." },
    { question: "Что делает робо-кофейня на мероприятии?", answer: "Роборука готовит кофе по выбранному меню, привлекает гостей движением и помогает собрать очередь вокруг понятного сервиса: человек получает напиток и одновременно видит роботизированное шоу." },
    { question: "Нужно ли подключение к воде?", answer: "Условия подключения зависят от конкретной комплектации и площадки. До аренды команда уточняет воду, электропитание, место установки, доступ для завоза и требования службы эксплуатации." },
    { question: "Нужен ли бариста или оператор?", answer: "Оператор нужен для запуска, контроля расходников, помощи гостям и решения технических вопросов. Бариста может не потребоваться, если меню и сценарий заранее согласованы." },
    { question: "Сколько напитков можно готовить?", answer: "Меню и скорость зависят от выбранной конфигурации, ингредиентов и длительности работы. Для выставки или форума лучше заранее оценить поток гостей и не перегружать меню." },
    { question: "Можно ли брендировать стаканы, экран и стойку?", answer: "Да, можно подготовить брендированные стаканы, меню, заставку на экране, оформление стойки и механику выдачи напитка под стенд или продуктовую презентацию." },
    { question: "Какие требования к месту установки?", answer: "Нужна ровная зона, электропитание, место для гостей и очереди, доступ для завоза оборудования и понятная логистика пополнения расходников во время мероприятия." },
    { question: "Сколько стоит аренда Robo-Кофейни?", answer: "Цена зависит от города, даты, часов работы, меню, расходников, брендинга, монтажа и состава команды. После брифа менеджер рассчитает аренду под конкретную площадку." }
  ],

  'arenda-mini-robo-kofeyni': [
    { question: "Чем мини Robo-Кофейня отличается от полноразмерной Robo-Кофейни?", answer: "Мини Robo-Кофейня занимает меньше места и подходит для компактных зон: офисных мероприятий, небольших стендов, лаунж-пространств и точек, где важны кофе, роботизированная подача и аккуратная логистика." },
    { question: "Для каких событий подходит мини Robo-Кофейня?", answer: "Её используют на камерных презентациях, клиентских днях, pop-up зонах, выставочных стендах, welcome-зонах и бизнес-мероприятиях, где полноразмерный модуль может быть избыточен." },
    { question: "Что готовит мини Robo-Кофейня?", answer: "Меню согласуют заранее: кофе, напитки и дополнительные позиции зависят от комплектации, расходников и условий площадки. Важно подобрать короткое меню, чтобы не создавать очередь." },
    { question: "Нужен ли оператор?", answer: "Да, оператор запускает модуль, контролирует расходники, помогает гостям с заказом и следит, чтобы роботизированная подача работала стабильно весь период аренды." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная зона, электропитание, место для установки и небольшая очередь. До события команда проверяет габариты проходов, доступ для завоза и требования площадки." },
    { question: "Можно ли поставить мини Robo-Кофейню на стенд?", answer: "Да, если есть место под модуль, безопасный проход для гостей и согласованная зона ожидания. Для стенда заранее рассчитывают поток людей и время приготовления напитков." },
    { question: "Можно ли добавить брендинг?", answer: "Да, можно оформить экран, меню, стаканы и зону выдачи в стиле бренда. Объём брендинга зависит от сроков подготовки и технических возможностей конкретного модуля." },
    { question: "Сколько стоит аренда мини Robo-Кофейни?", answer: "Стоимость зависит от даты, города, длительности, меню, логистики, расходников и оформления. Менеджер соберёт вводные и подготовит расчёт под формат события." }
  ],

  'arenda-glambot': [
    { question: "Для каких мероприятий подходит GlamBot?", answer: "GlamBot подходит для премий, модных показов, презентаций, открытий, корпоративов, красных дорожек и бренд-зон, где гостям нужен эффектный slow-motion ролик вместо обычной фотографии." },
    { question: "Что получает гость после съёмки?", answer: "Сценарий обычно строится вокруг короткого эффектного видео: проход, поза, движение камеры, свет и быстрый монтаж под стиль события. Формат выдачи роликов согласуется заранее." },
    { question: "Нужен ли оператор для GlamBot?", answer: "Да, оператор управляет съёмкой, безопасной зоной, очередью, светом и повторяемостью результата. Без оператора такой формат быстро превращается в хаос у фотозоны." },
    { question: "Какая зона нужна для установки?", answer: "Нужна ровная площадка с местом для камеры, гостя, света, очереди и безопасного радиуса движения. Размер зоны зависит от ракурса, декораций и ожидаемого потока гостей." },
    { question: "Можно ли брендировать ролики?", answer: "Да, можно добавить заставку, логотип, фирменный стиль, музыку или шаблон ролика, если это согласовано до мероприятия и подготовлены нужные материалы." },
    { question: "Подходит ли GlamBot для выставочного стенда?", answer: "Да, если на стенде есть место для безопасной траектории и очереди. На выставках GlamBot хорошо работает как магнит внимания и повод оставить контакт после съёмки." },
    { question: "Сколько людей можно снять за час?", answer: "Темп зависит от сценария, длительности дубля, очереди, монтажа и способа выдачи роликов. Для плотного события лучше заранее упростить механику и ограничить число вариантов." },
    { question: "Сколько стоит аренда GlamBot?", answer: "Цена зависит от города, даты, часов работы, комплекта света, декораций, брендинга, монтажа роликов и состава команды. Менеджер рассчитает смету после брифа." }
  ],

  'arenda-sketchbot': [
    { question: "Для каких мероприятий подходит Sketchbot?", answer: "Sketchbot подходит для выставок, корпоративов, презентаций, семейных дней, клиентских мероприятий и бренд-зон, где гостям нужен персональный сувенир — портрет, созданный роботом." },
    { question: "Что делает Sketchbot?", answer: "Sketchbot превращает фото гостя в стилизованный портрет и рисует его на бумаге. Процесс виден окружающим, поэтому зона работает и как интерактив, и как источник контента." },
    { question: "Сколько времени занимает один портрет?", answer: "Время зависит от сложности стиля, размера, настроек и очереди. Для события заранее выбирают режим, который даёт хороший результат и не создаёт слишком длинное ожидание." },
    { question: "Нужен ли оператор?", answer: "Да, оператор помогает гостям, контролирует очередь, проверяет фото, расходники и работу робота, чтобы портреты выдавались стабильно в течение мероприятия." },
    { question: "Какие требования к площадке?", answer: "Нужны стол или стойка, электропитание, освещение для фото, место для очереди и безопасная зона вокруг робота. Желательно заранее продумать, где гости будут забирать готовые портреты." },
    { question: "Можно ли брендировать портреты?", answer: "Да, можно добавить логотип, рамку, фирменный шаблон, карточку мероприятия или упаковку. Макеты лучше подготовить заранее, чтобы не терять время на площадке." },
    { question: "Подходит ли Sketchbot для детских и семейных мероприятий?", answer: "Да, но нужно учитывать очередь, высоту стойки, сопровождение взрослых и безопасную дистанцию. Оператор помогает сделать процесс понятным и спокойным для гостей." },
    { question: "Сколько стоит аренда Sketchbot?", answer: "Стоимость зависит от даты, города, длительности, формата портретов, расходников, брендинга и логистики. После брифа менеджер подготовит расчёт." }
  ],

  'arenda-robota-hudozhnika-a4': [
    { question: "Для каких мероприятий подходит робот-художник A4?", answer: "Робот-художник A4 подходит для свадеб, премий, корпоративов, выставок, презентаций и камерных VIP-событий, где нужен персональный портрет на бумаге и спокойная творческая зона." },
    { question: "Чем робот-художник A4 отличается от Sketchbot?", answer: "A4 делает акцент на бумажном портрете формата A4 и более детальном сувенире. Его выбирают, когда важен не только интерактив, но и вещь, которую гость унесёт с собой." },
    { question: "Сколько времени занимает портрет A4?", answer: "Время зависит от выбранной детализации, очереди, качества исходного фото и режима рисования. Для события заранее выбирают баланс между качеством портрета и пропускной способностью." },
    { question: "Нужен ли оператор?", answer: "Да, оператор встречает гостей, помогает сделать фото, следит за очередью, бумагой, настройками и безопасной зоной вокруг робота." },
    { question: "Что нужно подготовить на площадке?", answer: "Нужны стол или отдельная стойка, электропитание, стабильное освещение, место для очереди, зона выдачи готовых работ и запас расходников под ожидаемое число гостей." },
    { question: "Можно ли брендировать листы или рамки?", answer: "Да, можно подготовить фирменный бланк, рамку, логотип, подпись мероприятия или упаковку для портрета. Макеты и сроки печати нужно согласовать заранее." },
    { question: "Подходит ли робот-художник A4 для плотного потока гостей?", answer: "Подходит, если правильно ограничить время портрета и организовать очередь. Если гостей много, лучше заранее рассчитать смену, число работ и возможные паузы." },
    { question: "Сколько стоит аренда робота-художника A4?", answer: "Стоимость зависит от города, даты, длительности, детализации портретов, расходников, брендинга, логистики и оператора. Менеджер уточнит задачу и подготовит расчёт." }
  ],



  'arenda-inchbot-l1-w-edu': [
    { question: "Для каких мероприятий подходит Inchbot L1-W EDU?", answer: "Inchbot L1-W EDU подходит для образовательных зон, STEM-площадок, детских событий, технологичных стендов и промо, где нужен безопасный робот-собака с понятной демонстрацией." },
    { question: "Что делает робот-собака на площадке?", answer: "Робот показывает движение, повороты, стойки и короткие демонстрации. Сценарий заранее ограничивают под площадку, возраст гостей и безопасную дистанцию." },
    { question: "Можно ли использовать Inchbot для детского мероприятия?", answer: "Да, если есть оператор, ровная зона и понятные правила взаимодействия. Мы заранее согласуем формат показа, длительность подходов и роль ведущего." },
    { question: "Нужен ли оператор?", answer: "Да. Оператор запускает демонстрации, следит за зарядом, безопасной зоной и помогает встроить робота в программу без хаоса вокруг техники." },
    { question: "Какая площадка нужна?", answer: "Нужна ровная поверхность, свободная зона для движения, доступ к питанию для подзарядки и возможность ограничить слишком плотный контакт гостей с роботом." },
    { question: "Можно ли брендировать сценарий?", answer: "Можно адаптировать реплики ведущего, таблички, фото-точку и сценарий выхода под бренд или образовательную тему. Возможности самого робота не стоит обещать сверх проверенного режима." },
    { question: "Сколько длится аренда?", answer: "Минимальный и оптимальный пакет зависит от даты, города и программы. В тарифе есть дневные варианты, а итоговую длительность менеджер подтверждает после брифа." },
    { question: "Сколько стоит аренда Inchbot L1-W EDU?", answer: "Публичный вход — от 6 500 ₽ / час. Расчёт зависит от длительности, логистики, оператора и формата демонстрации." }
  ],
  'arenda-klipmeiker': [
    { question: "Для каких мероприятий подходит Клипмейкер?", answer: "Клипмейкер подходит для премий, запусков продукта, выставок, корпоративов и бренд-зон, где гостям нужен короткий динамичный ролик, а не только фотография." },
    { question: "Что снимает Клипмейкер?", answer: "Роботизированная камера движется по заданной траектории и снимает гостя или продукт. Итоговый формат ролика, свет и фон согласуются до мероприятия." },
    { question: "Нужен ли отдельный свет?", answer: "Обычно да: качество ролика сильно зависит от света, фона и пространства вокруг камеры. Мы заранее проверяем зону съёмки и подсказываем, что подготовить." },
    { question: "Как организовать очередь гостей?", answer: "Нужно заложить понятный вход, короткую инструкцию, безопасную дистанцию и выдачу ролика. Оператор помогает держать темп и не превращать съёмку в пробку." },
    { question: "Можно ли брендировать ролики?", answer: "Да, можно обсудить заставку, рамку, логотип или визуальный стиль выдачи. Конкретный монтаж и сроки выдачи фиксируются после брифа." },
    { question: "Какие ограничения у площадки?", answer: "Нужны место под траекторию камеры, стабильное питание, безопасная зона для гостей и согласованный фон. На тесной площадке сценарий придётся упростить." },
    { question: "Сколько времени занимает один ролик?", answer: "Время зависит от траектории, количества дублей, очереди и постобработки. Для массового потока выбирают короткий сценарий." },
    { question: "Сколько стоит аренда Клипмейкера?", answer: "Публичный вход — от 19 000 ₽ / час. Финальная стоимость зависит от смены, света, монтажа, оператора, логистики и брендинга." }
  ],
  'arenda-roboshashki': [
    { question: "Для каких мероприятий подходят Робошашки?", answer: "Робошашки подходят для выставок, семейных дней, образовательных событий, корпоративов и зон ожидания, где гости могут сыграть короткую партию с роботом." },
    { question: "Что делает робот для шашек?", answer: "Роботизированный манипулятор работает с игровой доской и помогает провести партию или демонстрацию. Сценарий зависит от выбранного режима и времени на гостя." },
    { question: "Это подходит детям?", answer: "Да, при участии оператора и ведущего. Важно заранее объяснить правила, ограничить очередь и не допускать хаотичного контакта с манипулятором." },
    { question: "Нужен ли оператор?", answer: "Да. Оператор запускает режим, следит за доской, помогает гостям и отвечает за безопасную дистанцию рядом с механикой." },
    { question: "Какая площадка нужна?", answer: "Нужен устойчивый стол или зона установки, питание, место для игрока и зрителей, а также пространство для небольшой очереди." },
    { question: "Можно ли сделать турнир?", answer: "Можно, если заранее согласовать регламент: длительность партий, число участников, роль ведущего и призовую механику. Для плотного потока лучше короткие партии." },
    { question: "Какие ограничения важно учесть?", answer: "Манипулятор не должен работать в толпе без контроля. Также нужно учитывать темп партии: это интерактив на вовлечение, а не аттракцион с мгновенной выдачей." },
    { question: "Сколько стоит аренда Робошашек?", answer: "Публичный вход — от 11 500 ₽ / час. Смета зависит от длительности, логистики, оператора, формата турнира и требований площадки." }
  ],
  'arenda-senserobot': [
    { question: "Для каких мероприятий подходит SenseRobot?", answer: "SenseRobot подходит для шахматных клубов, образовательных событий, выставок, семейных дней, корпоративных зон и интеллектуальных промо-активаций." },
    { question: "Что делает робот-шахматист?", answer: "SenseRobot распознаёт шахматную доску и передвигает фигуры манипулятором. Формат партии, уровень сложности и время на гостя нужно согласовать заранее." },
    { question: "Можно ли играть с гостями по очереди?", answer: "Да, но нужен регламент: длительность партии, очередь, помощь ведущего и понятный сценарий завершения, чтобы зона не застряла на одной игре." },
    { question: "Нужен ли оператор?", answer: "Да. Оператор следит за доской, настройками, очередью и безопасной зоной вокруг манипулятора." },
    { question: "Какая площадка нужна?", answer: "Нужен устойчивый стол, питание, нормальное освещение доски, место для игрока и небольшая зона ожидания для зрителей." },
    { question: "Подходит ли SenseRobot для детей?", answer: "Подходит, если есть ведущий и понятный уровень сложности. Для детского события лучше делать короткие партии или демонстрационный режим." },
    { question: "Можно ли брендировать зону?", answer: "Можно оформить стол, таблички, турнирную сетку, призы и сценарий ведущего. Саму механику робота нужно оставлять в проверенном режиме." },
    { question: "Сколько стоит аренда SenseRobot?", answer: "Публичный вход — от 10 000 ₽ / час. Итог зависит от длительности, логистики, оператора, формата турнира и подготовки зоны." }
  ],
  'arenda-uv-box': [
    { question: "Для каких мероприятий подходит UV-BOX?", answer: "UV-BOX подходит для выставок, шоурумов, презентаций продукта, retail-зон и промо, где товар нужно показать через интерактивную витрину и сенсорный экран." },
    { question: "Что делает интерактивная витрина?", answer: "Витрина помогает показать продукт, характеристики, визуальные материалы и 3D-эффект. Контент и сценарий взаимодействия нужно подготовить заранее." },
    { question: "Какие товары можно показывать?", answer: "Лучше всего подходят продукты, которые выигрывают от демонстрации: техника, косметика, украшения, мерч, макеты, премиальные подарки и новые линейки." },
    { question: "Нужен ли оператор?", answer: "Да. Оператор помогает запускать сценарий, следит за экраном, контентом, питанием и корректной работой витрины на площадке." },
    { question: "Что нужно подготовить для площадки?", answer: "Нужно место под установку, питание, безопасная зона вокруг витрины, заранее подготовленный контент и понимание, как гости будут подходить к экрану." },
    { question: "Можно ли брендировать UV-BOX?", answer: "Можно подготовить брендированный контент, визуальные материалы, экранные сценарии и оформление зоны. Точные форматы согласуются после брифа." },
    { question: "Какие ограничения есть?", answer: "Качество эффекта зависит от освещения, контента, расположения витрины и потока гостей. На яркой или тесной площадке сценарий нужно адаптировать." },
    { question: "Сколько стоит аренда UV-BOX?", answer: "Публичный вход — от 25 000 ₽ / час. Финальная смета зависит от длительности, контента, логистики, оператора и требований к монтажу." }
  ],
  'arenda-promobot-v4': [
    { question: "Для каких мероприятий подходит Promobot V4?", answer: "Promobot V4 подходит для выставок, презентаций, промо, фотозон, корпоративных событий и технологичных зон, где нужен управляемый вау-эффект." },
    { question: "Сколько стоит аренда Promobot V4?", answer: "Стоимость зависит от города, даты, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ подготовит расчёт под задачу." },
    { question: "Нужен ли оператор для Promobot V4?", answer: "Да, оператор готовит робота к выходу, контролирует безопасность, помогает команде площадки и адаптирует сценарий под реальный поток гостей." },
    { question: "Какие требования к площадке для Promobot V4?", answer: "Нужны ровная безопасная зона, понятная точка выхода, достаточно места для гостей и возможность заранее согласовать маршрут или место демонстрации." },
    { question: "Можно ли использовать Promobot V4 в фотозоне?", answer: "Да, Promobot V4 можно встроить в фотозону, welcome-зону или стенд, чтобы гости получали понятный повод для фото и короткого видео." },
    { question: "Можно ли адаптировать Promobot V4 под бренд?", answer: "Да, для Promobot V4 можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли Promobot V4 для выставочного стенда?", answer: "Да, Promobot V4 помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой Promobot V4?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-bellabot': [
    { question: "Для каких мероприятий подходит BellaBot?", answer: "BellaBot подходит для выставок, презентаций, промо, фотозон, корпоративных событий и технологичных зон, где нужен управляемый вау-эффект." },
    { question: "Сколько стоит аренда BellaBot?", answer: "Стоимость зависит от города, даты, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ подготовит расчёт под задачу." },
    { question: "Нужен ли оператор для BellaBot?", answer: "Да, оператор готовит робота к выходу, контролирует безопасность, помогает команде площадки и адаптирует сценарий под реальный поток гостей." },
    { question: "Какие требования к площадке для BellaBot?", answer: "Нужны ровная безопасная зона, понятная точка выхода, достаточно места для гостей и возможность заранее согласовать маршрут или место демонстрации." },
    { question: "Можно ли использовать BellaBot в фотозоне?", answer: "Да, BellaBot можно встроить в фотозону, welcome-зону или стенд, чтобы гости получали понятный повод для фото и короткого видео." },
    { question: "Можно ли адаптировать BellaBot под бренд?", answer: "Да, для BellaBot можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли BellaBot для выставочного стенда?", answer: "Да, BellaBot помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой BellaBot?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-unitree-g1': [
    { question: "Для каких мероприятий подходит Unitree G1?", answer: "Unitree G1 подходит для выставок, презентаций, промо, фотозон, корпоративных событий и технологичных зон, где нужен управляемый вау-эффект." },
    { question: "Сколько стоит аренда Unitree G1?", answer: "Стоимость зависит от города, даты, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ подготовит расчёт под задачу." },
    { question: "Нужен ли оператор для Unitree G1?", answer: "Да, оператор готовит робота к выходу, контролирует безопасность, помогает команде площадки и адаптирует сценарий под реальный поток гостей." },
    { question: "Какие требования к площадке для Unitree G1?", answer: "Нужны ровная безопасная зона, понятная точка выхода, достаточно места для гостей и возможность заранее согласовать маршрут или место демонстрации." },
    { question: "Можно ли использовать Unitree G1 в фотозоне?", answer: "Да, Unitree G1 можно встроить в фотозону, welcome-зону или стенд, чтобы гости получали понятный повод для фото и короткого видео." },
    { question: "Можно ли адаптировать Unitree G1 под бренд?", answer: "Да, для Unitree G1 можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли Unitree G1 для выставочного стенда?", answer: "Да, Unitree G1 помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой Unitree G1?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-unitree-go2': [
    { question: "Для каких мероприятий подходит Unitree Go2?", answer: "Unitree Go2 подходит для выставок, презентаций, промо, фотозон, корпоративных событий и технологичных зон, где нужен управляемый вау-эффект." },
    { question: "Сколько стоит аренда Unitree Go2?", answer: "Стоимость зависит от города, даты, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ подготовит расчёт под задачу." },
    { question: "Нужен ли оператор для Unitree Go2?", answer: "Да, оператор готовит робота к выходу, контролирует безопасность, помогает команде площадки и адаптирует сценарий под реальный поток гостей." },
    { question: "Какие требования к площадке для Unitree Go2?", answer: "Нужны ровная безопасная зона, понятная точка выхода, достаточно места для гостей и возможность заранее согласовать маршрут или место демонстрации." },
    { question: "Можно ли использовать Unitree Go2 в фотозоне?", answer: "Да, Unitree Go2 можно встроить в фотозону, welcome-зону или стенд, чтобы гости получали понятный повод для фото и короткого видео." },
    { question: "Можно ли адаптировать Unitree Go2 под бренд?", answer: "Да, для Unitree Go2 можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли Unitree Go2 для выставочного стенда?", answer: "Да, Unitree Go2 помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой Unitree Go2?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
  'arenda-xiaomi-cyberdog-2': [
    { question: "Для каких мероприятий подходит Xiaomi CyberDog 2?", answer: "Xiaomi CyberDog 2 подходит для выставок, презентаций, промо, фотозон, корпоративных событий и технологичных зон, где нужен управляемый вау-эффект." },
    { question: "Сколько стоит аренда Xiaomi CyberDog 2?", answer: "Стоимость зависит от города, даты, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ подготовит расчёт под задачу." },
    { question: "Нужен ли оператор для Xiaomi CyberDog 2?", answer: "Да, оператор готовит робота к выходу, контролирует безопасность, помогает команде площадки и адаптирует сценарий под реальный поток гостей." },
    { question: "Какие требования к площадке для Xiaomi CyberDog 2?", answer: "Нужны ровная безопасная зона, понятная точка выхода, достаточно места для гостей и возможность заранее согласовать маршрут или место демонстрации." },
    { question: "Можно ли использовать Xiaomi CyberDog 2 в фотозоне?", answer: "Да, Xiaomi CyberDog 2 можно встроить в фотозону, welcome-зону или стенд, чтобы гости получали понятный повод для фото и короткого видео." },
    { question: "Можно ли адаптировать Xiaomi CyberDog 2 под бренд?", answer: "Да, для Xiaomi CyberDog 2 можно согласовать роль, реплики, точки выхода и моменты для фото под бренд, продукт или тему мероприятия." },
    { question: "Подойдёт ли Xiaomi CyberDog 2 для выставочного стенда?", answer: "Да, Xiaomi CyberDog 2 помогает собрать внимание у стенда, создать понятный технологичный повод для общения и усилить презентацию продукта." },
    { question: "Что подготовить перед арендой Xiaomi CyberDog 2?", answer: "Нужно описать площадку, длительность, поток гостей, желаемый сценарий, технические ограничения и контакт ответственного на месте." },
  ],
};

const ownerAiSummaryBySlug: Record<string, string> = {
  'arenda-agibot-x2': "Agibot x2 — технологичный герой стенда. Его берут на выставки, презентации и события, где нужен заметный технологичный персонаж, фото- и видеоэффект и управляемый сценарий общения с гостями. КИБЕР ПОРТАЛ помогает подготовить задачу, проверить площадку и сопровождать запуск оператором.",
  'arenda-noetix-bumi': "Noetix bumi — компактный интерактивный персонаж. Его берут на выставки, презентации и события, где нужен заметный технологичный персонаж, фото- и видеоэффект и управляемый сценарий общения с гостями. КИБЕР ПОРТАЛ помогает подготовить задачу, проверить площадку и сопровождать запуск оператором.",
  'arenda-unitree-r1': "Unitree r1 — динамичный гуманоид для внимания гостей. Его берут на выставки, презентации и события, где нужен заметный технологичный персонаж, фото- и видеоэффект и управляемый сценарий общения с гостями. КИБЕР ПОРТАЛ помогает подготовить задачу, проверить площадку и сопровождать запуск оператором.",
  'arenda-unitree-h2': "Unitree h2 — человекоподобный робот для статусного выхода. Его берут на выставки, презентации и события, где нужен заметный технологичный персонаж, фото- и видеоэффект и управляемый сценарий общения с гостями. КИБЕР ПОРТАЛ помогает подготовить задачу, проверить площадку и сопровождать запуск оператором.",
  'arenda-robota-sofiya': "Робот софия — узнаваемый гуманоид для презентационного эффекта. Его берут на выставки, презентации и события, где нужен заметный технологичный персонаж, фото- и видеоэффект и управляемый сценарий общения с гостями. КИБЕР ПОРТАЛ помогает подготовить задачу, проверить площадку и сопровождать запуск оператором.",
  'arenda-robota-ardi': "Робот арди — дружелюбный интерактивный робот. Его берут на выставки, презентации и события, где нужен заметный технологичный персонаж, фото- и видеоэффект и управляемый сценарий общения с гостями. КИБЕР ПОРТАЛ помогает подготовить задачу, проверить площадку и сопровождать запуск оператором.",
  'arenda-robota-tron': "Робот tron — модульный робот для шоу-эффекта. Его берут на выставки, презентации и события, где нужен заметный технологичный персонаж, фото- и видеоэффект и управляемый сценарий общения с гостями. КИБЕР ПОРТАЛ помогает подготовить задачу, проверить площадку и сопровождать запуск оператором.",
  'arenda-kettybot': 'KettyBot — робот-официант для ресторанов, банкетов, отелей и выставочных зон HoReCa. Его берут, когда нужно эффектно доставлять блюда, напитки или промо-материалы, разгрузить персонал на маршрутах и показать гостям технологичный сервис. КИБЕР ПОРТАЛ настраивает точки остановки, проверяет проходы и сопровождает запуск оператором.',
  'arenda-unitree-g1': 'Unitree G1 - гуманоидный робот для мероприятий, выставок, презентаций и шоу-программ. Его можно арендовать как интерактивного гостя, промо-персонажа или технологичный элемент стенда. Команда КИБЕР ПОРТАЛА помогает подобрать сценарий, доставляет робота на площадку и сопровождает его работу оператором.',
  'arenda-bellabot': "BellaBot — робот-официант с кошачьей мордочкой для ресторанов, банкетов и HoReCa-зон. Его берут, когда нужна подача блюд, движение по залу, фото гостей и мягкий сервисный вау-эффект без замены персонала.",
  'arenda-unitree-go2': "Unitree Go2 — робот-собака для фотозон, шоу, детских праздников, выставок и промо. Он даёт понятный вау-эффект: трюки, движение, взаимодействие с гостями и много короткого видео для соцсетей.",
  'arenda-xiaomi-cyberdog-2': "Xiaomi CyberDog 2 — технологичная робособака для промо, IT-событий, фотозон и съёмок. Он помогает быстро создать образ будущего: выходит в фотозону, двигается по сценарию и собирает внимание гостей.",
  'arenda-promobot-v4': "Promobot V4 — промо-робот для выставок, торговых центров, форумов и открытий. Его используют как интерактивного персонажа с экраном, речевым сценарием и операторским сопровождением.",
  'arenda-robot-barmen': "Робобар — роботизированная барная станция для мероприятий: готовит согласованное меню напитков, показывает процесс приготовления и работает как заметная точка притяжения в welcome-зоне, на стенде или вечеринке. КИБЕР ПОРТАЛ помогает рассчитать поток гостей, меню, расходники, безопасную зону и операторское сопровождение.",

  'arenda-robo-kofeyni': "Robo-Кофейня — роботизированная кофейная зона для выставок, форумов и бренд-пространств. Роборука готовит напитки по согласованному меню, привлекает внимание движением и помогает превратить кофе-паузу в технологичный контакт с гостем.",

  'arenda-mini-robo-kofeyni': "Мини Robo-Кофейня — компактная роботизированная кофейная точка для стендов, офисных событий и камерных презентаций. Формат подходит, когда нужен кофе-сервис с роботизированной подачей, но без крупной зоны и сложной застройки.",

  'arenda-glambot': "GlamBot — роботизированная камера для slow-motion роликов, красных дорожек, премий, показов и бренд-фотозон. Формат строится вокруг света, движения камеры, очереди гостей и быстрой выдачи эффектного видео.",

  'arenda-sketchbot': "Sketchbot — робот-художник для портретной зоны на мероприятии. Гость делает фото, робот превращает его в рисунок, а организатор получает интерактив, очередь вокруг процесса и персональный сувенир с возможным брендингом.",

  'arenda-robota-hudozhnika-a4': "Робот-художник A4 — творческая зона с бумажными портретами формата A4. Его выбирают для свадеб, премий, корпоративов и VIP-событий, где важен не только процесс рисования роботом, но и сувенир, который гость забирает с собой.",



  'arenda-inchbot-l1-w-edu': "Inchbot L1-W EDU — робот-собака для образовательных и промо-событий. Его берут, когда нужен безопасный технологичный показ движения, STEM-акцент и управляемый интерактив с гостями.",
  'arenda-klipmeiker': "Клипмейкер — роботизированная камера для event-видео. Формат подходит для бренд-зон, премий, запусков продукта и стендов, где гостю нужен короткий динамичный ролик.",
  'arenda-roboshashki': "Робошашки — игровая роботизированная зона для коротких партий и демонстраций. Страница помогает оценить темп игры, требования к столу, оператору и очереди гостей.",
  'arenda-senserobot': "SenseRobot — робот-шахматист для интеллектуальной игровой зоны. Он подходит для шахматных, образовательных и корпоративных событий, где важен спокойный вовлекающий интерактив.",
  'arenda-uv-box': "UV-BOX — интерактивная сенсорная витрина для презентации продукта. Её используют на выставках, в шоурумах и retail-зонах, где товар нужно показать через экранный сценарий и 3D-эффект.",
};

const ownerRobotCardCopyBySlug: Record<string, OwnerRobotCardCopy> = {

  'arenda-agibot-x2': {
    capabilitiesLead: "Agibot x2 раскрывается лучше всего, когда у робота есть понятная роль в программе: встреча, демонстрация, фото, промо или короткий шоу-выход. Ниже — возможности, которые можно безопасно заложить в сценарий аренды после проверки площадки.",
    capabilities: [
      { title: "Выход в заданный момент", text: "Agibot x2 выводится по согласованному таймингу: для приветствия, кульминации презентации, открытия стенда или короткого шоу-блока." },
      { title: "Интерактив с гостями", text: "Робот помогает собрать внимание гостей: приветствует, позирует, поддерживает короткий сценарий и становится понятной точкой притяжения на площадке." },
      { title: "Фото- и видеоконтент", text: "Движение, внешний вид и реакция гостей дают материал для фото, коротких роликов, backstage и постов после мероприятия без отдельной постановочной зоны." },
      { title: "Брендированный сценарий", text: "Сценарий можно адаптировать под продукт, стенд или тему события: приветствие, короткие реплики, выход к аудитории и роль в программе согласуются заранее." },
      { title: "Операторское сопровождение", text: "Оператор помогает подготовить робота, проверить зону движения, объяснить команде площадки ограничения и быстро скорректировать демонстрацию по ситуации." },
      { title: "Безопасная зона", text: "Перед мероприятием важно определить ровную площадку, дистанцию до гостей, точку выхода и сценарий, чтобы робот выглядел уверенно и не мешал движению людей." },
    ],
    scenariosLead: "Сценарии для Agibot X2 строятся вокруг внимания гостей, тайминга события и безопасной зоны работы. Команда заранее уточняет площадку, плотность людей, точку выхода и роль оператора, чтобы робот стал частью программы, а не случайным техническим объектом.",
    scenarios: [
      { title: "Выставочный стенд", text: "На стенде Agibot X2 помогает остановить поток посетителей, начать разговор о бренде и показать технологичность экспозиции без агрессивного промо." },
      { title: "Презентация продукта", text: "Во время презентации робот появляется в нужный момент, усиливает запуск продукта и помогает аудитории запомнить главный технологичный акцент события." },
      { title: "Открытие площадки", text: "На открытии робот встречает гостей, поддерживает первое впечатление от пространства и создаёт живой повод для фото у входной или демонстрационной зоны." },
      { title: "Корпоративное событие", text: "На корпоративе робот работает как аккуратный вау-элемент: появляется в перерывах, участвует в фото и поддерживает атмосферу современного события." },
      { title: "Интерактивная фотозона", text: "В фотозоне робот становится главным объектом кадров: гости подходят ближе, снимают сторис и получают понятный повод поделиться событием в соцсетях." },
      { title: "Технологичное шоу", text: "В шоу-блоке робот подчёркивает тему технологий: сценарий, длительность выхода и дистанция до гостей согласуются заранее для безопасной демонстрации." },
    ],
  },

  'arenda-noetix-bumi': {
    capabilitiesLead: "Noetix bumi раскрывается лучше всего, когда у робота есть понятная роль в программе: встреча, демонстрация, фото, промо или короткий шоу-выход. Ниже — возможности, которые можно безопасно заложить в сценарий аренды после проверки площадки.",
    capabilities: [
      { title: "Выход в заданный момент", text: "Noetix bumi выводится по согласованному таймингу: для приветствия, кульминации презентации, открытия стенда или короткого шоу-блока." },
      { title: "Интерактив с гостями", text: "Робот помогает собрать внимание гостей: приветствует, позирует, поддерживает короткий сценарий и становится понятной точкой притяжения на площадке." },
      { title: "Фото- и видеоконтент", text: "Движение, внешний вид и реакция гостей дают материал для фото, коротких роликов, backstage и постов после мероприятия без отдельной постановочной зоны." },
      { title: "Брендированный сценарий", text: "Сценарий можно адаптировать под продукт, стенд или тему события: приветствие, короткие реплики, выход к аудитории и роль в программе согласуются заранее." },
      { title: "Операторское сопровождение", text: "Оператор помогает подготовить робота, проверить зону движения, объяснить команде площадки ограничения и быстро скорректировать демонстрацию по ситуации." },
      { title: "Безопасная зона", text: "Перед мероприятием важно определить ровную площадку, дистанцию до гостей, точку выхода и сценарий, чтобы робот выглядел уверенно и не мешал движению людей." },
    ],
    scenariosLead: "Сценарии для Noetix Bumi строятся вокруг внимания гостей, тайминга события и безопасной зоны работы. Команда заранее уточняет площадку, плотность людей, точку выхода и роль оператора, чтобы робот стал частью программы, а не случайным техническим объектом.",
    scenarios: [
      { title: "Выставочный стенд", text: "На стенде Noetix Bumi помогает остановить поток посетителей, начать разговор о бренде и показать технологичность экспозиции без агрессивного промо." },
      { title: "Презентация продукта", text: "Во время презентации робот появляется в нужный момент, усиливает запуск продукта и помогает аудитории запомнить главный технологичный акцент события." },
      { title: "Открытие площадки", text: "На открытии робот встречает гостей, поддерживает первое впечатление от пространства и создаёт живой повод для фото у входной или демонстрационной зоны." },
      { title: "Корпоративное событие", text: "На корпоративе робот работает как аккуратный вау-элемент: появляется в перерывах, участвует в фото и поддерживает атмосферу современного события." },
      { title: "Интерактивная фотозона", text: "В фотозоне робот становится главным объектом кадров: гости подходят ближе, снимают сторис и получают понятный повод поделиться событием в соцсетях." },
      { title: "Технологичное шоу", text: "В шоу-блоке робот подчёркивает тему технологий: сценарий, длительность выхода и дистанция до гостей согласуются заранее для безопасной демонстрации." },
    ],
  },

  'arenda-unitree-r1': {
    capabilitiesLead: "Unitree r1 раскрывается лучше всего, когда у робота есть понятная роль в программе: встреча, демонстрация, фото, промо или короткий шоу-выход. Ниже — возможности, которые можно безопасно заложить в сценарий аренды после проверки площадки.",
    capabilities: [
      { title: "Выход в заданный момент", text: "Unitree r1 выводится по согласованному таймингу: для приветствия, кульминации презентации, открытия стенда или короткого шоу-блока." },
      { title: "Интерактив с гостями", text: "Робот помогает собрать внимание гостей: приветствует, позирует, поддерживает короткий сценарий и становится понятной точкой притяжения на площадке." },
      { title: "Фото- и видеоконтент", text: "Движение, внешний вид и реакция гостей дают материал для фото, коротких роликов, backstage и постов после мероприятия без отдельной постановочной зоны." },
      { title: "Брендированный сценарий", text: "Сценарий можно адаптировать под продукт, стенд или тему события: приветствие, короткие реплики, выход к аудитории и роль в программе согласуются заранее." },
      { title: "Операторское сопровождение", text: "Оператор помогает подготовить робота, проверить зону движения, объяснить команде площадки ограничения и быстро скорректировать демонстрацию по ситуации." },
      { title: "Безопасная зона", text: "Перед мероприятием важно определить ровную площадку, дистанцию до гостей, точку выхода и сценарий, чтобы робот выглядел уверенно и не мешал движению людей." },
    ],
    scenariosLead: "Сценарии для Unitree R1 строятся вокруг внимания гостей, тайминга события и безопасной зоны работы. Команда заранее уточняет площадку, плотность людей, точку выхода и роль оператора, чтобы робот стал частью программы, а не случайным техническим объектом.",
    scenarios: [
      { title: "Выставочный стенд", text: "На стенде Unitree R1 помогает остановить поток посетителей, начать разговор о бренде и показать технологичность экспозиции без агрессивного промо." },
      { title: "Презентация продукта", text: "Во время презентации робот появляется в нужный момент, усиливает запуск продукта и помогает аудитории запомнить главный технологичный акцент события." },
      { title: "Открытие площадки", text: "На открытии робот встречает гостей, поддерживает первое впечатление от пространства и создаёт живой повод для фото у входной или демонстрационной зоны." },
      { title: "Корпоративное событие", text: "На корпоративе робот работает как аккуратный вау-элемент: появляется в перерывах, участвует в фото и поддерживает атмосферу современного события." },
      { title: "Интерактивная фотозона", text: "В фотозоне робот становится главным объектом кадров: гости подходят ближе, снимают сторис и получают понятный повод поделиться событием в соцсетях." },
      { title: "Технологичное шоу", text: "В шоу-блоке робот подчёркивает тему технологий: сценарий, длительность выхода и дистанция до гостей согласуются заранее для безопасной демонстрации." },
    ],
  },

  'arenda-unitree-h2': {
    capabilitiesLead: "Unitree h2 раскрывается лучше всего, когда у робота есть понятная роль в программе: встреча, демонстрация, фото, промо или короткий шоу-выход. Ниже — возможности, которые можно безопасно заложить в сценарий аренды после проверки площадки.",
    capabilities: [
      { title: "Выход в заданный момент", text: "Unitree h2 выводится по согласованному таймингу: для приветствия, кульминации презентации, открытия стенда или короткого шоу-блока." },
      { title: "Интерактив с гостями", text: "Робот помогает собрать внимание гостей: приветствует, позирует, поддерживает короткий сценарий и становится понятной точкой притяжения на площадке." },
      { title: "Фото- и видеоконтент", text: "Движение, внешний вид и реакция гостей дают материал для фото, коротких роликов, backstage и постов после мероприятия без отдельной постановочной зоны." },
      { title: "Брендированный сценарий", text: "Сценарий можно адаптировать под продукт, стенд или тему события: приветствие, короткие реплики, выход к аудитории и роль в программе согласуются заранее." },
      { title: "Операторское сопровождение", text: "Оператор помогает подготовить робота, проверить зону движения, объяснить команде площадки ограничения и быстро скорректировать демонстрацию по ситуации." },
      { title: "Безопасная зона", text: "Перед мероприятием важно определить ровную площадку, дистанцию до гостей, точку выхода и сценарий, чтобы робот выглядел уверенно и не мешал движению людей." },
    ],
    scenariosLead: "Сценарии для Unitree H2 строятся вокруг внимания гостей, тайминга события и безопасной зоны работы. Команда заранее уточняет площадку, плотность людей, точку выхода и роль оператора, чтобы робот стал частью программы, а не случайным техническим объектом.",
    scenarios: [
      { title: "Выставочный стенд", text: "На стенде Unitree H2 помогает остановить поток посетителей, начать разговор о бренде и показать технологичность экспозиции без агрессивного промо." },
      { title: "Презентация продукта", text: "Во время презентации робот появляется в нужный момент, усиливает запуск продукта и помогает аудитории запомнить главный технологичный акцент события." },
      { title: "Открытие площадки", text: "На открытии робот встречает гостей, поддерживает первое впечатление от пространства и создаёт живой повод для фото у входной или демонстрационной зоны." },
      { title: "Корпоративное событие", text: "На корпоративе робот работает как аккуратный вау-элемент: появляется в перерывах, участвует в фото и поддерживает атмосферу современного события." },
      { title: "Интерактивная фотозона", text: "В фотозоне робот становится главным объектом кадров: гости подходят ближе, снимают сторис и получают понятный повод поделиться событием в соцсетях." },
      { title: "Технологичное шоу", text: "В шоу-блоке робот подчёркивает тему технологий: сценарий, длительность выхода и дистанция до гостей согласуются заранее для безопасной демонстрации." },
    ],
  },

  'arenda-robota-sofiya': {
    capabilitiesLead: "Робот софия раскрывается лучше всего, когда у робота есть понятная роль в программе: встреча, демонстрация, фото, промо или короткий шоу-выход. Ниже — возможности, которые можно безопасно заложить в сценарий аренды после проверки площадки.",
    capabilities: [
      { title: "Выход в заданный момент", text: "Робота софия выводится по согласованному таймингу: для приветствия, кульминации презентации, открытия стенда или короткого шоу-блока." },
      { title: "Интерактив с гостями", text: "Робот помогает собрать внимание гостей: приветствует, позирует, поддерживает короткий сценарий и становится понятной точкой притяжения на площадке." },
      { title: "Фото- и видеоконтент", text: "Движение, внешний вид и реакция гостей дают материал для фото, коротких роликов, backstage и постов после мероприятия без отдельной постановочной зоны." },
      { title: "Брендированный сценарий", text: "Сценарий можно адаптировать под продукт, стенд или тему события: приветствие, короткие реплики, выход к аудитории и роль в программе согласуются заранее." },
      { title: "Операторское сопровождение", text: "Оператор помогает подготовить робота, проверить зону движения, объяснить команде площадки ограничения и быстро скорректировать демонстрацию по ситуации." },
      { title: "Безопасная зона", text: "Перед мероприятием важно определить ровную площадку, дистанцию до гостей, точку выхода и сценарий, чтобы робот выглядел уверенно и не мешал движению людей." },
    ],
    scenariosLead: "Сценарии для робота София строятся вокруг внимания гостей, тайминга события и безопасной зоны работы. Команда заранее уточняет площадку, плотность людей, точку выхода и роль оператора, чтобы робот стал частью программы, а не случайным техническим объектом.",
    scenarios: [
      { title: "Выставочный стенд", text: "На стенде робота София помогает остановить поток посетителей, начать разговор о бренде и показать технологичность экспозиции без агрессивного промо." },
      { title: "Презентация продукта", text: "Во время презентации робот появляется в нужный момент, усиливает запуск продукта и помогает аудитории запомнить главный технологичный акцент события." },
      { title: "Открытие площадки", text: "На открытии робот встречает гостей, поддерживает первое впечатление от пространства и создаёт живой повод для фото у входной или демонстрационной зоны." },
      { title: "Корпоративное событие", text: "На корпоративе робот работает как аккуратный вау-элемент: появляется в перерывах, участвует в фото и поддерживает атмосферу современного события." },
      { title: "Интерактивная фотозона", text: "В фотозоне робот становится главным объектом кадров: гости подходят ближе, снимают сторис и получают понятный повод поделиться событием в соцсетях." },
      { title: "Технологичное шоу", text: "В шоу-блоке робот подчёркивает тему технологий: сценарий, длительность выхода и дистанция до гостей согласуются заранее для безопасной демонстрации." },
    ],
  },

  'arenda-robota-ardi': {
    capabilitiesLead: "Робот арди раскрывается лучше всего, когда у робота есть понятная роль в программе: встреча, демонстрация, фото, промо или короткий шоу-выход. Ниже — возможности, которые можно безопасно заложить в сценарий аренды после проверки площадки.",
    capabilities: [
      { title: "Выход в заданный момент", text: "Робота арди выводится по согласованному таймингу: для приветствия, кульминации презентации, открытия стенда или короткого шоу-блока." },
      { title: "Интерактив с гостями", text: "Робот помогает собрать внимание гостей: приветствует, позирует, поддерживает короткий сценарий и становится понятной точкой притяжения на площадке." },
      { title: "Фото- и видеоконтент", text: "Движение, внешний вид и реакция гостей дают материал для фото, коротких роликов, backstage и постов после мероприятия без отдельной постановочной зоны." },
      { title: "Брендированный сценарий", text: "Сценарий можно адаптировать под продукт, стенд или тему события: приветствие, короткие реплики, выход к аудитории и роль в программе согласуются заранее." },
      { title: "Операторское сопровождение", text: "Оператор помогает подготовить робота, проверить зону движения, объяснить команде площадки ограничения и быстро скорректировать демонстрацию по ситуации." },
      { title: "Безопасная зона", text: "Перед мероприятием важно определить ровную площадку, дистанцию до гостей, точку выхода и сценарий, чтобы робот выглядел уверенно и не мешал движению людей." },
    ],
    scenariosLead: "Сценарии для робота Арди строятся вокруг внимания гостей, тайминга события и безопасной зоны работы. Команда заранее уточняет площадку, плотность людей, точку выхода и роль оператора, чтобы робот стал частью программы, а не случайным техническим объектом.",
    scenarios: [
      { title: "Выставочный стенд", text: "На стенде робота Арди помогает остановить поток посетителей, начать разговор о бренде и показать технологичность экспозиции без агрессивного промо." },
      { title: "Презентация продукта", text: "Во время презентации робот появляется в нужный момент, усиливает запуск продукта и помогает аудитории запомнить главный технологичный акцент события." },
      { title: "Открытие площадки", text: "На открытии робот встречает гостей, поддерживает первое впечатление от пространства и создаёт живой повод для фото у входной или демонстрационной зоны." },
      { title: "Корпоративное событие", text: "На корпоративе робот работает как аккуратный вау-элемент: появляется в перерывах, участвует в фото и поддерживает атмосферу современного события." },
      { title: "Интерактивная фотозона", text: "В фотозоне робот становится главным объектом кадров: гости подходят ближе, снимают сторис и получают понятный повод поделиться событием в соцсетях." },
      { title: "Технологичное шоу", text: "В шоу-блоке робот подчёркивает тему технологий: сценарий, длительность выхода и дистанция до гостей согласуются заранее для безопасной демонстрации." },
    ],
  },

  'arenda-robota-tron': {
    capabilitiesLead: "Робот tron раскрывается лучше всего, когда у робота есть понятная роль в программе: встреча, демонстрация, фото, промо или короткий шоу-выход. Ниже — возможности, которые можно безопасно заложить в сценарий аренды после проверки площадки.",
    capabilities: [
      { title: "Выход в заданный момент", text: "Робота tron выводится по согласованному таймингу: для приветствия, кульминации презентации, открытия стенда или короткого шоу-блока." },
      { title: "Интерактив с гостями", text: "Робот помогает собрать внимание гостей: приветствует, позирует, поддерживает короткий сценарий и становится понятной точкой притяжения на площадке." },
      { title: "Фото- и видеоконтент", text: "Движение, внешний вид и реакция гостей дают материал для фото, коротких роликов, backstage и постов после мероприятия без отдельной постановочной зоны." },
      { title: "Брендированный сценарий", text: "Сценарий можно адаптировать под продукт, стенд или тему события: приветствие, короткие реплики, выход к аудитории и роль в программе согласуются заранее." },
      { title: "Операторское сопровождение", text: "Оператор помогает подготовить робота, проверить зону движения, объяснить команде площадки ограничения и быстро скорректировать демонстрацию по ситуации." },
      { title: "Безопасная зона", text: "Перед мероприятием важно определить ровную площадку, дистанцию до гостей, точку выхода и сценарий, чтобы робот выглядел уверенно и не мешал движению людей." },
    ],
    scenariosLead: "Сценарии для робота Tron строятся вокруг внимания гостей, тайминга события и безопасной зоны работы. Команда заранее уточняет площадку, плотность людей, точку выхода и роль оператора, чтобы робот стал частью программы, а не случайным техническим объектом.",
    scenarios: [
      { title: "Выставочный стенд", text: "На стенде робота Tron помогает остановить поток посетителей, начать разговор о бренде и показать технологичность экспозиции без агрессивного промо." },
      { title: "Презентация продукта", text: "Во время презентации робот появляется в нужный момент, усиливает запуск продукта и помогает аудитории запомнить главный технологичный акцент события." },
      { title: "Открытие площадки", text: "На открытии робот встречает гостей, поддерживает первое впечатление от пространства и создаёт живой повод для фото у входной или демонстрационной зоны." },
      { title: "Корпоративное событие", text: "На корпоративе робот работает как аккуратный вау-элемент: появляется в перерывах, участвует в фото и поддерживает атмосферу современного события." },
      { title: "Интерактивная фотозона", text: "В фотозоне робот становится главным объектом кадров: гости подходят ближе, снимают сторис и получают понятный повод поделиться событием в соцсетях." },
      { title: "Технологичное шоу", text: "В шоу-блоке робот подчёркивает тему технологий: сценарий, длительность выхода и дистанция до гостей согласуются заранее для безопасной демонстрации." },
    ],
  },

  'arenda-kettybot': {
    capabilitiesLead: 'KettyBot — робот-официант для залов, где важно совместить практичную доставку и вау-эффект. Здесь объясняем именно модель KettyBot: маршруты по залу, рекламный экран, подносы, помощь персоналу и операторский запуск на площадке.',
    capabilities: [
      { title: 'Доставка блюд и напитков', text: 'KettyBot перевозит блюда, напитки, дегустационные наборы или промо-материалы по заранее настроенному маршруту между кухней, залом и точками выдачи.' },
      { title: 'Работа по маршрутам', text: 'Перед запуском команда настраивает точки остановки и проверяет проходы, чтобы робот двигался предсказуемо и не мешал гостям или персоналу.' },
      { title: 'Рекламный экран', text: 'Экран можно использовать для приветствий, акций, меню, логотипа или коротких брендированных сообщений — полезно для HoReCa, выставок и промо-зон.' },
      { title: 'Сервисный вау-эффект', text: 'Гости замечают робота в зале, фотографируют подачу и охотнее обсуждают формат обслуживания — это работает как мягкий промо-инструмент.' },
      { title: 'Помощь персоналу', text: 'Робот не заменяет команду зала, а берёт на себя часть перемещений с подносами, чтобы официанты больше общались с гостями и контролировали сервис.' },
      { title: 'Сопровождение запуска', text: 'Оператор помогает настроить маршрут, объяснить персоналу сценарий работы, проверить покрытие и адаптировать робота под реальную расстановку столов.' },
    ],
    scenariosLead: 'KettyBot лучше всего раскрывается в живом сервисе: там, где есть маршруты, гости, подача и понятная задача для робота. Мы заранее проверяем зал, проходы, точки остановки и роль оператора, чтобы робот выглядел как часть сервиса, а не как препятствие на банкете.',
    scenarios: [
      { title: 'Ресторан и кафе', text: 'KettyBot помогает доставлять блюда и напитки между кухней, зоной выдачи и столами, пока официанты занимаются гостями и заказами.' },
      { title: 'Отель и гостиница', text: 'Робот подходит для завтраков, конференц-зон, welcome-сценариев и демонстрации технологичного сервиса для гостей отеля.' },
      { title: 'Банкет и фуршет', text: 'На банкете робот эффектно развозит закуски, напитки или промо-наборы между зонами и становится заметным поводом для фото.' },
      { title: 'Выставка HoReCa', text: 'На отраслевом стенде KettyBot показывает, как сервисная робототехника выглядит в реальном зале, а не только на презентационном баннере.' },
      { title: 'Открытие ресторана', text: 'Робот усиливает первое впечатление от заведения: встречает гостей, поддерживает подачу и помогает сделать открытие запоминающимся.' },
      { title: 'Промо-акция бренда', text: 'KettyBot можно использовать для брендированной подачи дегустаций, листовок или подарков, если заранее согласовать маршрут и загрузку.' },
    ],
  },

  'arenda-unitree-g1': {
    capabilitiesLead: 'Ключевые возможности Unitree G1 показывают, за что его берут на мероприятия: он двигается как гуманоид, поддерживает живое внимание гостей, помогает делать фото- и видеоконтент и остаётся управляемым элементом программы. Мы описываем только сценарные преимущества, которые команда может подготовить и сопровождать на площадке.',
    capabilities: [
      { title: 'Рост и вес', text: 'Рост и пластика гуманоидного корпуса помогают Unitree G1 выглядеть как живой герой стенда или сцены, а не как обычная техника для демонстрации.' },
      { title: 'Степени свободы', text: 'Множество степеней свободы позволяет роботу махать рукой, менять позы, двигаться в кадре и поддерживать короткие интерактивные моменты с гостями.' },
      { title: 'Автономность работы', text: 'Автономность работы помогает использовать Unitree G1 в шоу-блоках, промо-зонах и фотосессиях без постоянной паузы на ручную перенастройку.' },
      { title: 'Скорость передвижения', text: 'Скорость передвижения достаточно заметна для вау-эффекта, но сценарий подбирается с учётом безопасности, покрытия и плотности гостей.' },
      { title: 'Голосовое общение', text: 'Голосовое общение делает робота понятным участником программы: он может приветствовать гостей и поддерживать заданный промо-сценарий.' },
      { title: 'Компактность', text: 'Компактный корпус удобно перевозить и выводить на площадку: робот подходит для стендов, залов, шоурумов и событий с ограниченным пространством.' },
    ],
    scenariosLead: 'Сценарии использования помогают быстро понять, где Unitree G1 даст лучший эффект: на выставке, презентации, корпоративе, открытии площадки или в брендированной фотозоне. Для каждого события команда заранее проверяет маршрут робота, плотность гостей, длительность выхода и роль оператора, чтобы шоу выглядело уверенно и безопасно.',
    scenarios: [
      { title: 'Интерактивная фотозона', text: 'Интерактивная фотозона превращает Unitree G1 в героя кадров: гости подходят к роботу, здороваются, снимают короткие видео и получают заметный повод поделиться контентом после события.' },
      { title: 'Открытие бизнес-центра или шоурума', text: 'На открытии бизнес-центра или шоурума робот встречает посетителей, привлекает внимание к входной зоне, помогает показать технологичность пространства и создаёт понятный повод для фото гостей.' },
      { title: 'Презентация продукта или бренда', text: 'Во время презентации продукта или бренда Unitree G1 выходит в заданный момент, поддерживает демонстрацию, становится живым символом технологичности и усиливает запоминаемость запуска.' },
      { title: 'Корпоратив и деловое мероприятие', text: 'На корпоративе и деловом мероприятии робот работает как аккуратный вау-элемент: встречает гостей, появляется в перерывах, участвует в фото и сохраняет деловую атмосферу события без лишнего шума.' },
      { title: 'Технологическая выставка или конференция', text: 'На технологической выставке или конференции Unitree G1 помогает стенду выделиться в потоке посетителей: движение, позы и короткое общение быстро собирают внимание вокруг экспозиции.' },
      { title: 'Съёмка видео и создание контента для соцсетей', text: 'Для съёмки видео и создания контента для соцсетей робот даёт динамичный визуальный объект: его можно включить в ролик, backstage, промо-анонс или серию коротких клипов бренда после мероприятия.' },
    ],
  },
  'arenda-bellabot': {
    capabilitiesLead: "BellaBot лучше всего раскрывается в зале, где есть гости, маршруты и подача: ресторан, банкет, отель, HoReCa-стенд или промо-зона. Он не заменяет персонал, а добавляет сервису заметный технологичный акцент и помогает перевозить блюда или промо-материалы по заранее проверенному маршруту.",
    capabilities: [
      { title: "Подача блюд и напитков", text: "BellaBot перевозит блюда, напитки, дегустационные наборы или подарки по настроенным точкам, чтобы гости видели роботизированный сервис в реальном действии." },
      { title: "Кошачья эмоция на экране", text: "Мимика и дружелюбный образ робота помогают гостям быстрее подходить к нему, фотографироваться и воспринимать подачу как часть события." },
      { title: "Навигация по залу", text: "Перед запуском команда проверяет проходы, покрытие, повороты и точки остановки, чтобы робот двигался предсказуемо рядом с персоналом и гостями." },
      { title: "Работа вместе с персоналом", text: "Робот берёт на себя часть перемещений с подносами, пока официанты общаются с гостями, контролируют сервис и помогают в нестандартных ситуациях." },
      { title: "Промо-эффект для HoReCa", text: "BellaBot хорошо смотрится на открытиях, выставках и дегустациях: он делает сервис заметным и создаёт повод для фото и коротких видео." },
      { title: "Операторский запуск", text: "Оператор помогает настроить маршрут, объяснить сценарий персоналу, следить за безопасностью и корректировать работу по реальной расстановке зала." },
    ],
    scenariosLead: "Сценарии для BellaBot строятся вокруг живого сервиса: где робот едет, что везёт, кто встречает гостей и как он помогает персоналу. Перед мероприятием важно проверить проходы, точки остановки и плотность людей.",
    scenarios: [
      { title: "Ресторан и кафе", text: "В ресторане BellaBot эффектно доставляет блюда или напитки, помогает показать технологичность заведения и не мешает официантам при правильном маршруте." },
      { title: "Банкет и фуршет", text: "На банкете робот развозит закуски, десерты или промо-наборы между зонами и становится понятным поводом для фото гостей." },
      { title: "Отель и welcome-зона", text: "В отеле BellaBot можно использовать на завтраке, конференции, welcome-зоне или презентации сервиса для гостей и партнёров." },
      { title: "Выставка HoReCa", text: "На отраслевом стенде робот показывает сервисную робототехнику в действии, а не только на экране презентации." },
      { title: "Открытие заведения", text: "На открытии BellaBot помогает создать первое впечатление: встречает гостей, участвует в подаче и усиливает инфоповод." },
      { title: "Промо-акция бренда", text: "Робота можно использовать для дегустаций, подарков или брендированной подачи, если заранее согласовать нагрузку и маршрут." },
    ],
  },
  'arenda-unitree-go2': {
    capabilitiesLead: "Unitree Go2 нужен там, где гости должны увидеть движение, трюки и живой интерактив, а не просто статичный экспонат. Сценарий всегда подбирается под покрытие, плотность людей и безопасную дистанцию.",
    capabilities: [
      { title: "Движение и трюки", text: "Go2 может демонстрировать заметные движения, стойки и короткие трюки, если площадка подходит по покрытию и пространству." },
      { title: "Интерактив с гостями", text: "Робот-собака помогает собрать внимание: гости подходят ближе, снимают видео, задают вопросы и вовлекаются в сценарий." },
      { title: "Фото- и видеоконтент", text: "Динамика робопса хорошо работает для сторис, backstage, промороликов и контента после мероприятия." },
      { title: "Работа в помещении и на площадке", text: "Сценарий можно адаптировать под зал, стенд, фотозону или открытую площадку после проверки покрытия и маршрута." },
      { title: "Операторское управление", text: "Оператор управляет демонстрацией, следит за дистанцией до гостей и быстро меняет сценарий, если площадка становится плотнее." },
      { title: "Безопасная зона", text: "Перед запуском важно определить границы работы, убрать кабели и хрупкий декор, чтобы робот двигался эффектно и безопасно." },
    ],
    scenariosLead: "Сценарии для Unitree Go2 строятся вокруг вау-эффекта и короткого интерактива: робот выходит, двигается, позирует, делает трюк и возвращает внимание гостей к бренду или программе.",
    scenarios: [
      { title: "Фотозона", text: "Go2 становится живым объектом для фото: гости подходят, снимают видео и получают повод поделиться мероприятием." },
      { title: "Детский праздник", text: "На детском празднике робот-собака вызывает быстрый интерес, но работает только в управляемой зоне и под контролем оператора." },
      { title: "Выставочный стенд", text: "На стенде Go2 помогает остановить поток посетителей и показать технологичность бренда через движение, а не только через баннер." },
      { title: "Корпоратив и тимбилдинг", text: "На корпоративе робот работает как лёгкий интерактив в перерывах, welcome-зоне или финальном фото." },
      { title: "Открытие магазина", text: "На открытии Go2 привлекает внимание у входа, помогает гостям запомнить событие и создаёт контент для соцсетей." },
      { title: "Съёмка роликов", text: "Для промороликов робот даёт динамичный кадр: движение, трюки и реакции людей можно встроить в сценарий съёмки." },
    ],
  },
  'arenda-xiaomi-cyberdog-2': {
    capabilitiesLead: "Xiaomi CyberDog 2 подходит для технологичных событий, где важен образ робопса, движение и эффект будущего. Он должен выходить по понятному сценарию: показать трюк, пройти маршрут, поработать в фотозоне или стать частью промо.",
    capabilities: [
      { title: "Технологичный образ", text: "CyberDog 2 выглядит как робопёс из будущего и быстро считывается гостями как яркий технологичный объект." },
      { title: "Динамичная демонстрация", text: "Робот может показывать движение, позы и короткие трюки в безопасной зоне после проверки покрытия." },
      { title: "Промо и брендирование", text: "Сценарий можно связать с продуктом, запуском, стендом или IT-темой, чтобы робот работал на коммуникацию бренда." },
      { title: "Контент для соцсетей", text: "Необычный вид и движение робопса дают материал для коротких роликов, фото гостей и постов после мероприятия." },
      { title: "Операторское сопровождение", text: "Оператор помогает управлять демонстрацией, следит за дистанцией и адаптирует сценарий под реальный поток гостей." },
      { title: "Проверка площадки", text: "Перед показом нужно согласовать покрытие, кабели, декор, освещение и зону движения, чтобы робот выглядел уверенно." },
    ],
    scenariosLead: "CyberDog 2 лучше использовать как технологичный акцент: короткий выход, демонстрация движения, фотозона, промо-съёмка или интерактив рядом со стендом.",
    scenarios: [
      { title: "IT-конференция", text: "На IT-событии робот подчёркивает тему технологий и создаёт точку притяжения в зоне партнёра или демо." },
      { title: "Промо-акция", text: "CyberDog 2 можно связать с запуском продукта, брендом или интерактивной механикой, если заранее определить роль робота." },
      { title: "Фотозона", text: "В фотозоне робопёс помогает гостям сделать необычные кадры и быстро распространяет визуальный образ события." },
      { title: "Детский праздник", text: "Для детского формата робот работает как управляемый вау-персонаж с оператором и безопасной дистанцией." },
      { title: "Открытие шоурума", text: "На открытии робот встречает гостей, двигается в заданной зоне и подчёркивает технологичный характер пространства." },
      { title: "Съёмка контента", text: "Для съёмки CyberDog 2 даёт эффектный движущийся объект: проход, поза, реакция гостей и короткий ролик под бренд." },
    ],
  },
  'arenda-promobot-v4': {
    capabilitiesLead: "Promobot V4 — промо-робот для ситуаций, где нужно встречать гостей, вести короткий диалог, показывать информацию на экране и собирать внимание рядом со стендом. Его сценарий лучше готовить как роль персонажа, а не как список случайных фраз.",
    capabilities: [
      { title: "Общение с гостями", text: "Promobot V4 может приветствовать посетителей, отвечать по подготовленному сценарию и поддерживать простой интерактив." },
      { title: "Сенсорный экран", text: "Экран помогает показывать меню, бренд, промо-механику, расписание, анкету или короткую презентацию продукта." },
      { title: "Робот-хостес", text: "Робот подходит для welcome-зоны, регистрации, открытия стенда или точки, где нужно встретить поток людей." },
      { title: "Промо и лидогенерация", text: "Сценарий можно связать с акцией, QR-кодом, презентацией или сбором интереса без подключения живых интеграций на preview." },
      { title: "Фото с посетителями", text: "Promobot V4 хорошо работает как статичный и интерактивный объект для фото на выставке, форуме или в ТЦ." },
      { title: "Сопровождение оператора", text: "Оператор помогает контролировать сценарий, поток гостей, настройки экрана и реакцию робота на нестандартные вопросы." },
    ],
    scenariosLead: "Сценарии для Promobot V4 строятся вокруг общения и промо: где робот стоит, что говорит, что показывает на экране и как передаёт гостей менеджеру или команде стенда.",
    scenarios: [
      { title: "Выставочный стенд", text: "Робот встречает поток посетителей, объясняет механику стенда, фотографируется с гостями и помогает выделить бренд среди соседних экспозиций." },
      { title: "Открытие магазина или ТЦ", text: "На открытии Promobot V4 привлекает внимание у входа, приветствует гостей и поддерживает праздничный сценарий." },
      { title: "Форум и конференция", text: "На форуме робот может работать в welcome-зоне, у партнёрского стенда или в зоне навигации по программе." },
      { title: "Корпоративное событие", text: "На корпоративе робот добавляет технологичный интерактив, участвует в фото и поддерживает сценарий ведущего." },
      { title: "Промо-акция", text: "Promobot V4 помогает объяснить акцию, показать QR-код или короткое сообщение бренда на экране." },
      { title: "Детское мероприятие", text: "Для семейного формата робот работает как дружелюбный персонаж, но сценарий и вопросы нужно заранее ограничить." },
    ],
  },
  'arenda-robot-barmen': {
    capabilitiesLead: "Робобар нужен там, где бар должен работать как шоу: гость выбирает напиток, роботизированная станция готовит коктейль, а вокруг появляется понятная точка притяжения. Перед арендой важно согласовать меню, расходники, поток гостей и безопасную зону обслуживания.",
    capabilities: [
      { title: "Коктейли по меню", text: "Робобар готовит заранее согласованный набор напитков: так проще рассчитать ингредиенты, скорость выдачи и ожидание гостей." },
      { title: "Заказ через экран", text: "Гость выбирает позицию в понятном интерфейсе, а оператор помогает, если нужно объяснить механику или ограничить меню." },
      { title: "Шоу приготовления", text: "Движение роботизированной руки видно издалека и превращает бар в контентную точку для фото и видео." },
      { title: "Алко- и безалкогольные сценарии", text: "Меню можно собрать под правила площадки: mocktail-зона, фирменные напитки бренда или классический барный сет." },
      { title: "Брендинг стойки и напитков", text: "Экран, названия коктейлей, оформление зоны и подача могут поддерживать продукт, стенд или тему события." },
      { title: "Оператор и безопасность", text: "Оператор следит за запуском, расходниками, очередью и безопасной дистанцией вокруг рабочей зоны." }
    ],
    scenariosLead: "Робобар лучше ставить не “где осталось место”, а там, где гости естественно собираются за напитком и видят процесс приготовления.",
    scenarios: [
      { title: "Welcome-зона", text: "Гости получают напиток в начале события, а робот сразу задаёт технологичный тон мероприятия." },
      { title: "Выставочный стенд", text: "Робобар удерживает внимание у стенда дольше обычной раздачи кофе или воды и даёт повод для разговора с менеджером." },
      { title: "Корпоративная вечеринка", text: "Барная механика становится частью шоу-программы, особенно если меню названо под отделы, продукты или тему вечера." },
      { title: "Презентация продукта", text: "Фирменный коктейль можно связать с запуском продукта, демонстрацией или коротким сценарием ведущего." },
      { title: "Лаунж-зона", text: "Роботизированный бар поддерживает спокойный поток гостей без необходимости превращать всю площадку в шоу." },
      { title: "Закрытая клиентская встреча", text: "Робобар работает как статусная деталь сервиса и помогает сделать паузу между деловыми блоками запоминающейся." }
    ],
  },

  'arenda-robo-kofeyni': {
    capabilitiesLead: "Robo-Кофейня решает две задачи одновременно: даёт гостям кофе и показывает роботизированный сервис в действии. Чтобы зона не превратилась в очередь, заранее подбирают меню, место установки, поток гостей и роль оператора.",
    capabilities: [
      { title: "Кофе от роборуки", text: "Робот готовит напитки по согласованному меню, а сам процесс становится частью впечатления гостей." },
      { title: "Сервис без барной стойки", text: "Кофейную точку можно встроить в стенд или лаунж-зону, если заранее проверить габариты и подключение." },
      { title: "Понятный заказ", text: "Меню делают коротким и удобным, чтобы гости быстро выбирали напиток и не задерживали очередь." },
      { title: "Расходники под поток", text: "Команда заранее считает стаканы, зерно, молоко, воду и другие позиции под длительность мероприятия." },
      { title: "Брендинг кофейной зоны", text: "Стаканы, экран, меню и оформление стойки можно связать с брендом или темой события." },
      { title: "Операторский контроль", text: "Оператор помогает гостям, пополняет расходники и следит, чтобы робот стабильно работал весь слот." }
    ],
    scenariosLead: "Robo-Кофейня сильнее всего работает там, где кофе-пауза уже нужна по программе и её можно превратить в технологичный контакт с брендом.",
    scenarios: [
      { title: "Выставка или форум", text: "Гости подходят за кофе, задерживаются у стенда и видят роботизированный сервис вместо обычной кофемашины." },
      { title: "Бизнес-завтрак", text: "Кофейная зона встречает гостей до основной программы и помогает начать разговор без навязчивого промо." },
      { title: "Девелоперский офис", text: "Роборука подчёркивает технологичность проекта в шоуруме, офисе продаж или зоне переговоров." },
      { title: "Автосалон или запуск модели", text: "Кофе-пауза становится частью premium-сервиса и поддерживает образ технологичного бренда." },
      { title: "Корпоративное событие", text: "Robo-Кофейня работает как спокойная точка притяжения между выступлениями и активностями." },
      { title: "Pop-up бренд-зона", text: "Напиток с фирменной подачей помогает гостю унести не только впечатление, но и физический контакт с брендом." }
    ],
  },

  'arenda-mini-robo-kofeyni': {
    capabilitiesLead: "Мини Robo-Кофейня нужна, когда хочется роботизированную кофейную механику, но площадка не тянет полноразмерный модуль. Её проще вписать в стенд, офис или камерное событие, но меню и поток гостей всё равно нужно считать заранее.",
    capabilities: [
      { title: "Компактная установка", text: "Модуль легче встроить в небольшую зону, если заранее проверить проходы, питание и место для очереди." },
      { title: "Короткое кофейное меню", text: "Лучше выбрать несколько ходовых напитков, чтобы сохранить скорость и не перегрузить гостей выбором." },
      { title: "Роботизированная подача", text: "Гости видят работу роборуки и получают понятный технологичный повод подойти к зоне." },
      { title: "Формат для стенда", text: "Мини-кофейня может работать рядом с переговорной зоной, ресепшеном или продуктовой демонстрацией." },
      { title: "Брендинг стаканов и экрана", text: "Оформление помогает связать напиток с брендом без сложной застройки площадки." },
      { title: "Сопровождение оператора", text: "Оператор контролирует запуск, расходники, очередь и помогает гостям пользоваться интерфейсом." }
    ],
    scenariosLead: "Мини Robo-Кофейня хороша для точек, где важны компактность, аккуратный сервис и предсказуемый поток, а не максимальная производительность.",
    scenarios: [
      { title: "Небольшой выставочный стенд", text: "Роботизированный кофе привлекает гостей, не занимая площадь крупной кофейной зоны." },
      { title: "Офисное мероприятие", text: "Кофейная точка встречает сотрудников или клиентов и добавляет технологичную деталь в привычный формат." },
      { title: "Камерная презентация", text: "Гости получают напиток до или после демонстрации, а робот помогает сделать паузу запоминающейся." },
      { title: "VIP-переговорная зона", text: "Мини-формат работает как аккуратный premium-сервис без шума большой активности." },
      { title: "Pop-up в торговом центре", text: "Компактная зона помогает протестировать механику с напитками и роботизированной подачей." },
      { title: "Клиентский день", text: "Кофе становится поводом задержаться, задать вопрос менеджеру и сфотографировать технологичный сервис." }
    ],
  },

  'arenda-glambot': {
    capabilitiesLead: "GlamBot — это не “ещё одна фотозона”, а управляемая съёмка с движением камеры, светом и коротким роликом на выходе. Чтобы результат выглядел дорого, заранее продумывают траекторию, очередь, свет, фон и брендированный шаблон видео.",
    capabilities: [
      { title: "Slow-motion ролик", text: "Камера снимает эффектное движение гостя, а итоговый клип выглядит как материал с красной дорожки." },
      { title: "Управляемая траектория", text: "Оператор настраивает движение, дистанцию и повторяемость дублей, чтобы гости получали стабильный результат." },
      { title: "Свет и фон", text: "Формат требует продуманной зоны: фон, свет и безопасный радиус важнее случайного свободного угла." },
      { title: "Брендированный монтаж", text: "В ролик можно добавить логотип, заставку, музыку, цветовую рамку или финальный экран события." },
      { title: "Очередь без хаоса", text: "Сценарий помогает быстро объяснять гостям позу, движение и момент съёмки." },
      { title: "Выдача контента", text: "Формат выдачи видео согласуют заранее: QR, ссылка, отправка или другой безопасный способ для мероприятия." }
    ],
    scenariosLead: "GlamBot стоит ставить там, где гостям уместно остановиться, красиво пройти в кадр и получить ролик, а не просто быстро сфотографироваться на бегу.",
    scenarios: [
      { title: "Красная дорожка", text: "Гость проходит через точку съёмки, получает эффектный кадр и сразу понимает статус события." },
      { title: "Премия или церемония", text: "GlamBot усиливает момент выхода номинантов, артистов, партнёров или VIP-гостей." },
      { title: "Модный показ", text: "Камера подчёркивает образ, движение ткани, аксессуары и атмосферу backstage." },
      { title: "Запуск продукта", text: "Ролик можно связать с продуктом, слоганом, упаковкой или фирменной графикой." },
      { title: "Корпоративный вечер", text: "Гости получают личный контент, а бренд — живые публикации и очередь у фотозоны." },
      { title: "Выставочный стенд", text: "GlamBot работает как магнит внимания, если на стенде есть место для безопасной траектории и ожидания." }
    ],
  },

  'arenda-sketchbot': {
    capabilitiesLead: "Sketchbot превращает портрет гостя в роботизированный рисунок и делает сам процесс частью события. Важно заранее решить стиль, длительность одного портрета, очередь, брендинг листа и место выдачи готовых работ.",
    capabilities: [
      { title: "Портрет по фото", text: "Гость делает снимок, а робот переводит его в рисунок по выбранному стилю." },
      { title: "Видимый процесс рисования", text: "Люди остаются у зоны, потому что интересно смотреть, как робот постепенно собирает портрет." },
      { title: "Сувенир для гостя", text: "Готовый рисунок можно забрать с собой, вложить в брендированную папку или оформить как открытку." },
      { title: "Настраиваемый стиль", text: "До события выбирают формат линии, детализацию и скорость, чтобы не перегрузить очередь." },
      { title: "Брендинг листа", text: "На лист можно добавить логотип, рамку, дату события или фирменный элемент." },
      { title: "Оператор очереди", text: "Оператор помогает сделать фото, объяснить механику, контролировать расходники и выдачу портретов." }
    ],
    scenariosLead: "Sketchbot хорош там, где гости готовы подождать ради персонального результата, а организатору важен не только кадр, но и памятный сувенир.",
    scenarios: [
      { title: "Выставочный стенд", text: "Портрет помогает задержать гостя у стенда и даёт менеджеру время для разговора." },
      { title: "Корпоратив", text: "Сотрудники получают персональный сувенир, а зона становится спокойной альтернативой громким активностям." },
      { title: "Семейный день", text: "Робот-художник вовлекает детей и взрослых, если очередь и безопасность организованы заранее." },
      { title: "Презентация бренда", text: "Фирменная рамка на портрете связывает сувенир с продуктом или запуском." },
      { title: "Клиентское мероприятие", text: "Гость уходит с физическим напоминанием о встрече, а не только с фотографией в телефоне." },
      { title: "Творческая зона", text: "Sketchbot можно поставить рядом с мастер-классом, лаунжем или welcome-пространством." }
    ],
  },

  'arenda-robota-hudozhnika-a4': {
    capabilitiesLead: "Робот-художник A4 подходит для событий, где нужен более крупный и заметный бумажный портрет. Здесь важно не обещать мгновенную выдачу: качество, детализация и очередь зависят от выбранного режима рисования.",
    capabilities: [
      { title: "Портрет на листе A4", text: "Робот рисует бумажный портрет формата A4, который выглядит как самостоятельный сувенир." },
      { title: "Детализация по сценарию", text: "Перед мероприятием выбирают баланс: быстрее для большого потока или подробнее для камерного события." },
      { title: "Фотография как основа", text: "Качество исходного фото и освещение влияют на итоговый рисунок, поэтому оператор помогает гостям на старте." },
      { title: "Брендированный бланк", text: "Лист можно подготовить с логотипом, рамкой, названием события или датой." },
      { title: "Зона ожидания и выдачи", text: "Для A4 важно заранее продумать очередь, место просмотра процесса и аккуратную выдачу готовых работ." },
      { title: "Оператор и расходники", text: "Оператор следит за бумагой, настройками, безопасной зоной и темпом работы робота." }
    ],
    scenariosLead: "A4 лучше выбирать там, где портрет должен быть не быстрым фан-сувениром, а заметной вещью, которую приятно забрать после события.",
    scenarios: [
      { title: "Свадьба", text: "Гости получают персональные портреты, а зона работает как спокойный интерактив между основными блоками." },
      { title: "Премия или гала-ужин", text: "Портрет A4 поддерживает статус события и выглядит уместно в зоне ожидания или лаунже." },
      { title: "VIP-презентация", text: "Робот-художник добавляет персональный сервис без навязчивой промо-механики." },
      { title: "Корпоративное мероприятие", text: "Гости наблюдают за процессом, забирают портрет и получают повод обсудить технологичную зону." },
      { title: "Выставочный стенд", text: "A4-портрет помогает удержать посетителя дольше, но требует точного расчёта очереди." },
      { title: "Клиентский вечер", text: "Портрет можно оформить как подарок от бренда с аккуратной рамкой или упаковкой." }
    ],
  },



  'arenda-inchbot-l1-w-edu': {
    capabilitiesLead: "Inchbot L1-W EDU нужен там, где робот-собака должен быть понятным и безопасным демонстрационным героем: показать движение, собрать детей и взрослых вокруг STEM-сценария и не перегрузить площадку сложной механикой.",
    capabilities: [
      { title: "Движение робота-собаки", text: "Показывает ходьбу, повороты и короткие демонстрации на ровной площадке." },
      { title: "STEM-акцент", text: "Подходит для образовательного блока, где важно объяснить механику робота простым языком." },
      { title: "Фото и внимание гостей", text: "Робот-собака быстро собирает вокруг себя зрителей и даёт понятный фото-повод." },
      { title: "Сценарий для детей", text: "Формат можно сделать мягким: показ, вопросы, короткие подходы без толпы вокруг техники." },
      { title: "Операторский контроль", text: "Оператор держит безопасную дистанцию, заряд и темп демонстрации." },
      { title: "Компактная зона", text: "Не требует большой сцены, но нуждается в ровном пространстве и понятной границе." }
    ],
    scenariosLead: "Inchbot лучше ставить туда, где гости могут смотреть демонстрацию сбоку, а не окружать робота плотным кольцом. Тогда он работает как образовательный и промо-интерактив, а не как стресс-тест для оператора.",
    scenarios: [
      { title: "STEM-зона", text: "Короткий показ движения и объяснение, как устроен робот-собака." },
      { title: "Детское событие", text: "Робот становится технологичным героем программы при участии ведущего." },
      { title: "Выставочный стенд", text: "Помогает остановить проходящий поток и начать разговор с гостем." },
      { title: "Семейный день", text: "Подходит для мягкого интерактива без агрессивного шоу." },
      { title: "IT-презентация", text: "Подчёркивает технологичность продукта или бренда." },
      { title: "Фото-точка", text: "Гости подходят посмотреть на робота и снимают короткие ролики." }
    ],
  },
  'arenda-klipmeiker': {
    capabilitiesLead: "Клипмейкер работает как съёмочная точка: гость становится в кадр, роботизированная камера проходит по траектории, а бренд получает динамичный ролик вместо обычной фотографии.",
    capabilities: [
      { title: "Роботизированная траектория", text: "Камера движется по заранее согласованному маршруту, чтобы ролик выглядел постановочно." },
      { title: "Event-видео для гостей", text: "Формат помогает быстро получить короткий ролик для соцсетей или брендовой зоны." },
      { title: "Свет и фон", text: "Качество результата зависит от освещения, поэтому зону лучше проектировать заранее." },
      { title: "Брендинг ролика", text: "Можно обсудить рамку, заставку, логотип или визуальный стиль выдачи." },
      { title: "Очередь по таймингу", text: "Оператор помогает держать темп и не собирать хаос вокруг камеры." },
      { title: "Сценарий позирования", text: "Гостям заранее объясняют, где стоять и что делать во время прохода камеры." }
    ],
    scenariosLead: "Клипмейкеру нужна не просто розетка, а маленькая съёмочная площадка: фон, свет, место для траектории и понятный сценарий для гостя. Тогда ролики выглядят как часть события, а не как случайная запись.",
    scenarios: [
      { title: "Премия или церемония", text: "Гости снимают эффектные ролики перед входом или после фотоколла." },
      { title: "Запуск продукта", text: "Камера подчёркивает объект, бренд-зону или амбассадора." },
      { title: "Выставочный стенд", text: "Помогает собрать контент и удержать внимание вокруг стенда." },
      { title: "Корпоратив", text: "Даёт гостям персональный ролик без отдельной съёмочной группы на каждого." },
      { title: "Fashion или beauty", text: "Работает с образом, светом и движением в кадре." },
      { title: "VIP-зона", text: "Подходит для более спокойного темпа и аккуратной выдачи контента." }
    ],
  },
  'arenda-roboshashki': {
    capabilitiesLead: "Робошашки — это не “робот ради робота”, а понятная игровая зона: гость видит доску, делает ход, наблюдает за манипулятором и быстро понимает механику интерактива.",
    capabilities: [
      { title: "Игра в шашки", text: "Робот работает с доской и помогает провести короткую партию или демонстрацию." },
      { title: "Зрелищный манипулятор", text: "Движение руки видно зрителям и добавляет технологичный эффект обычной игре." },
      { title: "Формат турнира", text: "Можно подготовить сетку, очередь и короткие правила для гостей." },
      { title: "Интерактив для детей", text: "Подходит для семейных и образовательных событий при операторе и ведущем." },
      { title: "Настольная зона", text: "Нужен устойчивый стол, питание и место для игрока." },
      { title: "Контроль безопасности", text: "Оператор следит, чтобы гости не вмешивались в работу механики." }
    ],
    scenariosLead: "Робошашки лучше работают там, где ценят понятную игру и спокойное вовлечение. Это формат для разговора, турнира и наблюдения за роборукой, а не аттракцион с мгновенной выдачей сувенира.",
    scenarios: [
      { title: "Семейный день", text: "Гости играют короткие партии и смотрят на работу манипулятора." },
      { title: "Образовательная зона", text: "Можно объяснить алгоритмы, робототехнику и правила игры." },
      { title: "Выставочный стенд", text: "Шашки дают повод остановиться и задержаться у стенда." },
      { title: "Корпоратив", text: "Подходит как спокойный интеллектуальный интерактив." },
      { title: "Турнирная зона", text: "Можно организовать мини-соревнование с ведущим." },
      { title: "Зона ожидания", text: "Гости получают занятие, пока ждут основную программу." }
    ],
  },
  'arenda-senserobot': {
    capabilitiesLead: "SenseRobot строит интерактив вокруг шахмат: гость делает ход, робот распознаёт ситуацию и передвигает фигуры манипулятором. Важно заранее решить, это демонстрация, партия или мини-турнир.",
    capabilities: [
      { title: "Шахматная партия", text: "Робот помогает провести игру с гостем в выбранном режиме." },
      { title: "Распознавание доски", text: "Система работает с шахматной позицией и движением фигур." },
      { title: "Манипулятор для ходов", text: "Роборука физически передвигает фигуры, поэтому процесс виден зрителям." },
      { title: "Интеллектуальный интерактив", text: "Формат хорошо смотрится на образовательных и технологичных площадках." },
      { title: "Регламент очереди", text: "Для потока гостей заранее задают длительность партии и правила завершения." },
      { title: "Оператор на зоне", text: "Оператор следит за настройками, фигурками, очередью и безопасностью." }
    ],
    scenariosLead: "SenseRobot требует спокойной зоны: стол, свет, место для игрока и понятные правила. Тогда шахматы не превращаются в длинное ожидание, а работают как интеллектуальная демонстрация.",
    scenarios: [
      { title: "Шахматный клуб", text: "Робот становится центральным объектом показательной партии." },
      { title: "Образовательное событие", text: "Можно связать игру с темой ИИ, алгоритмов и робототехники." },
      { title: "Выставка технологий", text: "Манипулятор и доска дают понятный визуальный интерактив." },
      { title: "Корпоратив", text: "Подходит для спокойной зоны общения и мини-турнира." },
      { title: "Семейный день", text: "Гости разных возрастов могут наблюдать или играть короткими партиями." },
      { title: "Зона ожидания", text: "Шахматы удерживают внимание без громкого шоу." }
    ],
  },
  'arenda-uv-box': {
    capabilitiesLead: "UV-BOX — это интерактивная витрина для продукта, а не робот-персонаж. Её задача — показать товар, экранный сценарий и эффект “парения” так, чтобы гость сам подошёл и начал взаимодействовать.",
    capabilities: [
      { title: "3D-эффект витрины", text: "Помогает визуально выделить товар и сделать демонстрацию заметной." },
      { title: "Сенсорное управление", text: "Гость может взаимодействовать с экраном и изучать подготовленный контент." },
      { title: "Продуктовый сценарий", text: "Материалы нужно подготовить заранее: изображения, характеристики, видео или промо-механика." },
      { title: "Retail и выставки", text: "Формат подходит для стендов, шоурумов, pop-up и презентаций." },
      { title: "Брендинг интерфейса", text: "Экранный сценарий можно адаптировать под бренд и продуктовую линейку." },
      { title: "Оператор и монтаж", text: "Нужны установка, питание, проверка контента и сопровождение на площадке." }
    ],
    scenariosLead: "UV-BOX лучше раскрывается, когда есть сильный продукт и готовый контент. Без сценария витрина превращается просто в экран, поэтому до события важно подготовить материалы и путь гостя.",
    scenarios: [
      { title: "Презентация продукта", text: "Витрина помогает показать ключевые свойства товара через экранный сценарий." },
      { title: "Выставочный стенд", text: "Останавливает поток за счёт визуального эффекта и интерактива." },
      { title: "Шоурум", text: "Подходит для аккуратной демонстрации премиального товара." },
      { title: "Retail pop-up", text: "Можно встроить в промо-зону торгового центра или бренда." },
      { title: "Запуск новой линейки", text: "Контент объясняет отличия продукта и собирает внимание." },
      { title: "VIP-презентация", text: "Работает как спокойная технологичная демонстрация без шумного шоу." }
    ],
  },
};

const ownerGoshaQuoteBySlug: Record<string, string> = {
  'arenda-kettybot': '— KettyBot — официант, который не забывает, куда несёт поднос, если гости не устроили перестановку века. Он хорош там, где сервису нужен маршрут, экран и немного роботического шарма.\n\nНапишите менеджеру: проверим план зала, проходы, точки остановки и сценарий подачи, чтобы KettyBot помогал персоналу, а не играл в лабиринт между столами.',
  'arenda-agibot-x2': "— Agibot X2 выглядит так, будто вышел из лаборатории и сразу спросил: «Где тут ваш самый технологичный стенд?» Он умеет быть главным магнитом внимания без лишнего шума — главное заранее дать ему сцену, пространство и понятный момент выхода.\n\nНапишите менеджеру: команда КИБЕР ПОРТАЛ проверит площадку, тайминг, безопасную зону и соберёт сценарий, чтобы Agibot X2 не просто стоял рядом, а работал на вау-эффект мероприятия.",
  'arenda-noetix-bumi': "— Я бы сказал, что Noetix Bumi — это не «человек в костюме», а костюм будущего, который сам пришёл знакомиться с гостями. Маленький рост тут не минус: к нему подходят ближе, улыбаются быстрее и фотографируют охотнее.\n\nНапишите менеджеру: команда КИБЕР ПОРТАЛ проверит дату, сценарий, тайминг, логистику и рассчитает стоимость без роботических сюрпризов.",
  'arenda-unitree-r1': "— Unitree R1 — тот самый робот, который может спокойно стоять рядом с баннером, а потом движением объяснить гостям, что стенд тут явно не скучный. Главное — не просить его импровизировать между кофейной стойкой и толпой без плана.\n\nНапишите менеджеру: мы проверим покрытие, дистанции, плотность гостей и подберём безопасный демонстрационный сценарий для вашей площадки.",
  'arenda-unitree-h2': "— Unitree H2 выглядит как гость из будущего, который пришёл не забрать микрофон, а сделать момент выхода запоминающимся. Его лучше выпускать не «где-нибудь», а в точке, где все точно увидят движение, рост и характер робота.\n\nНапишите менеджеру: команда КИБЕР ПОРТАЛ согласует сценарий, место показа, тайминг и сопровождение, чтобы H2 выглядел уверенно, а не искал дорогу через банкетные стулья.",
  'arenda-robota-sofiya': "— София умеет создавать ощущение большого технологичного события: вокруг неё обычно появляются камеры, вопросы и люди, которые вдруг вспоминают, что хотели снять сторис. Это не просто декорация, а узнаваемый персонаж для сцены и презентации.\n\nНапишите менеджеру: мы поможем подготовить вопросы, формат появления, зону общения и расчёт аренды без обещаний, которые роботам потом неловко выполнять.",
  'arenda-robota-ardi': "— Арди — робот для момента, когда обычный ведущий уже сказал «добро пожаловать», а хочется, чтобы гости всё-таки достали телефоны. Он хорошо работает там, где нужна улыбка, сцена, фото и немного аккуратного робо-театра.\n\nНапишите менеджеру: команда КИБЕР ПОРТАЛ проверит сценарий, площадку, свет, звук и сопровождение, чтобы Арди вышел вовремя и не превратил программу в технический квест.",
  'arenda-robota-tron': "— Tron — это робот, который будто собрался на мероприятие сразу в нескольких режимах: сегодня колёса, завтра препятствия, послезавтра шоу инженерной мысли. Его важно показывать так, чтобы гости поняли модульность, а не просто увидели ещё одну железную штуку.\n\nНапишите менеджеру: мы уточним площадку, сценарий демонстрации, безопасную дистанцию и формат показа, чтобы Tron выглядел как технология, а не как чемодан с амбициями.",
  'arenda-unitree-g1': "— Unitree G1 — тот случай, когда стенд внезапно получает не просто технику, а персонажа с походкой, жестами и характером. Главное — заранее объяснить ему, где сцена, где гости, а где стол с кофе, куда ходить не надо.\n\nНапишите менеджеру: проверим площадку, тайминг, безопасную зону и соберём сценарий, чтобы G1 выглядел как герой события, а не как случайный посетитель из будущего.",
  'arenda-bellabot': "— BellaBot выглядит так, будто ресторан нанял кота, который наконец-то согласился работать официантом. Он милый, заметный и умеет везти подносы — но маршрут всё равно лучше настроить до прихода гостей.\n\nНапишите менеджеру: проверим зал, проходы, точки остановки и сценарий подачи, чтобы BellaBot добавил сервису вау-эффект, а не устроил кошачью навигацию между столами.",
  'arenda-unitree-go2': "— Unitree Go2 — робот-собака, которую гости сначала снимают на видео, а потом спрашивают, можно ли с ней ещё круг. Она отлично работает там, где нужен живой интерактив, но поводок здесь заменяет оператор и сценарий.\n\nНапишите менеджеру: уточним покрытие, плотность гостей, трюки и безопасную зону, чтобы Go2 радовал площадку, а не проверял на прочность кабели и декор.",
  'arenda-xiaomi-cyberdog-2': "— Xiaomi CyberDog 2 выглядит как робопёс, который пришёл на мероприятие из трейлера про будущее и сразу нашёл камеру. Он хорош для промо, фотозон и технологичных демонстраций — особенно когда у него есть понятная роль.\n\nНапишите менеджеру: проверим сценарий, покрытие, дистанцию до гостей и формат показа, чтобы CyberDog 2 был эффектным участником, а не просто быстрой железной собакой.",
  'arenda-promobot-v4': "— Promobot V4 — робот, который может встретить гостей, поговорить, показать экран и спокойно стать главным поводом для фото у стенда. Только не надо давать ему роль «делай всё сразу»: роботам тоже нужен бриф.\n\nНапишите менеджеру: согласуем реплики, место работы, поток гостей и сопровождение, чтобы Promobot V4 помогал промо-зоне, а не превращал мероприятие в тест на терпение очереди.",
  'arenda-robot-barmen': "— Робобар не спорит с барменом за звание души вечеринки: он честно берёт на себя механику, зрелищность и стабильный повтор напитков. Главное — заранее решить меню, поток гостей и где будет очередь, иначе даже роботизированный бар начнёт мечтать о регламенте.\n\nНапишите менеджеру: проверим площадку, меню, расходники и соберём барный сценарий без пробок у стойки.",

  'arenda-robo-kofeyni': "— Robo-Кофейня хороша тем, что кофе-пауза перестаёт быть просто паузой. Гость получает напиток, видит работу роборуки и уходит с мыслью: “ладно, этот стенд я запомнил”.\n\nНапишите менеджеру: посчитаем поток гостей, меню, расходники и место установки, чтобы робот варил кофе, а не собирал очередь до выхода.",

  'arenda-mini-robo-kofeyni': "— Мини Robo-Кофейня — это когда роботу не нужен целый павильон, чтобы произвести впечатление. Компактная зона, понятное меню, немного движения роборуки — и обычная кофе-точка уже выглядит как технологичный сервис.\n\nНапишите менеджеру: проверим габариты, питание, меню и поток гостей для вашей площадки.",

  'arenda-glambot': "— GlamBot не делает “ещё одно фото у баннера”. Он ловит тот самый момент, когда гость на секунду становится героем красной дорожки — если свет, фон и очередь не оставили на потом.\n\nНапишите менеджеру: проверим зону съёмки, траекторию, свет, брендинг ролика и способ выдачи видео.",

  'arenda-sketchbot': "— Sketchbot — робот для тех случаев, когда гостю хочется унести не буклет, а собственный портрет. Я, конечно, тоже рисую схемы в голове, но он делает это на бумаге и намного фотогеничнее.\n\nНапишите менеджеру: согласуем стиль, скорость портрета, брендинг листа и организацию очереди.",

  'arenda-robota-hudozhnika-a4': "— Робот-художник A4 не обещает портрет “за три секунды и с душой академика”. Зато он честно превращает ожидание в процесс: гости смотрят, как робот выводит линии, и забирают с собой настоящий лист, а не только сторис.\n\nНапишите менеджеру: подберём режим детализации, расходники, брендинг листа и расчёт очереди под ваше событие.",



  'arenda-inchbot-l1-w-edu': "— Inchbot L1-W EDU — робот-собака, который лучше показывает технологии, чем объясняет их скучной лекцией. Но ему всё равно нужна ровная площадка и оператор: лапы умные, толпа вокруг — не очень.\n\nНапишите менеджеру: проверим возраст гостей, безопасную зону, тайминг демонстраций и сделаем сценарий без гонки за роботом по залу.",
  'arenda-klipmeiker': "— Клипмейкер не просит “сделайте вид, что вам весело” — он просто ставит камеру на красивую траекторию. Остальное решают свет, фон и гости, которым заранее объяснили, куда смотреть.\n\nНапишите менеджеру: проверим площадку, свет, фон, очередь и формат выдачи роликов.",
  'arenda-roboshashki': "— Робошашки — редкий случай, когда фраза “робот сделал ход” звучит буквально. Главное — не устраивать вокруг доски чемпионат без регламента: даже роботу нужен порядок.\n\nНапишите менеджеру: согласуем формат партии, очередь, ведущего и безопасную зону вокруг манипулятора.",
  'arenda-senserobot': "— SenseRobot играет в шахматы спокойнее многих людей после блица. Но если дать каждому гостю “ещё один ход”, очередь быстро станет длиннее дебюта.\n\nНапишите менеджеру: подберём режим партии, длительность, уровень сложности и сценарий мини-турнира.",
  'arenda-uv-box': "— UV-BOX не танцует и не машет рукой — зато умеет сделать товар главным героем витрины. Если контент подготовлен, гости подходят сами; если нет — даже 3D-эффекту приходится импровизировать.\n\nНапишите менеджеру: проверим продукт, материалы, свет, место установки и сценарий взаимодействия.",
};

export function toRobotCardTemplateData(robot: RobotPageRecord): RobotCardTemplateData {
  const priceStatus = robot.pricing.mode === 'calculated' ? 'request' : 'needs_review';
  const pilot = pilotCopyBySlug[robot.slug];
  const ownerCopy = pilot?.blocks ?? ownerRobotCardCopyBySlug[robot.slug];
  const ownerSeo = pilot ? { ...ownerSeoBySlug[robot.slug], title: pilot.seo.title, description: pilot.seo.description, primaryKeyword: pilot.seo.primaryKeyword, secondaryKeywords: pilot.seo.secondaryKeywords } : ownerSeoBySlug[robot.slug];
  const ownerSeoIntent = pilot ? { ...ownerSeoIntentBySlug[robot.slug], ...pilot.seoIntent, pageType: 'robot_card' as const, isCrawlerOnlyText: false as const } : ownerSeoIntentBySlug[robot.slug];
  const ownerFaq = pilot?.blocks.faq ?? ownerFaqBySlug[robot.slug];
  const scenarioBlocks = robot.service.scenarios.map((scenario, index) => ({
    id: `scenario-${index + 1}`,
    title: scenario,
    text: scenario,
    items: [],
    sourceStatus: 'page_content' as const,
  }));
  const capabilityBlocks = robot.facts.map((fact, index) => ({
    id: `capability-${index + 1}`,
    title: fact,
    text: fact,
    items: [],
    sourceStatus: 'page_content' as const,
  }));
  const ownerCapabilityBlocks = ownerCopy?.capabilities.map((capability, index) => ({
    id: `capability-${index + 1}`,
    title: capability.title,
    text: capability.text,
    items: [],
    sourceStatus: 'page_content' as const,
  }));
  const ownerScenarioBlocks = ownerCopy?.scenarios.map((scenario, index) => ({
    id: `scenario-${index + 1}`,
    title: scenario.title,
    text: scenario.text,
    items: [],
    sourceStatus: 'page_content' as const,
  }));
  const limitationBlocks = robot.service.limitations.map((limitation, index) => ({
    id: `limitation-${index + 1}`,
    title: index === 0 ? 'Ограничения и подтверждение' : undefined,
    text: limitation,
    items: [],
    sourceStatus: 'page_content' as const,
  }));
  const preparedGallery = batch1ReviewGalleryBySlug[robot.slug]
    ?? (robot.slug === 'arenda-kettybot'
      ? kettybotReviewGallery
      : [robot.media.hero, ...robot.media.gallery].filter(Boolean).map((image) => {
        const previewSrc = toPreviewAsset(image.src);
        return previewSrc ? { src: previewSrc, alt: image.alt, sourceStatus: 'page_content' as const } : undefined;
      }).filter((image): image is { src: string; alt: string; sourceStatus: 'page_content' } => Boolean(image)).slice(0, 8));
  const preparedGoshaQuote = pilot?.blocks.goshaQuote ?? ownerGoshaQuoteBySlug[robot.slug] ?? fallbackGoshaQuoteForUnpreparedRobot(robot);
  assertCuratedRobotCardData(robot, preparedGallery, preparedGoshaQuote);

  return {
    pageType: 'robot_card',
    status: 'draft_for_owner_review',
    seo: {
      title: ownerSeo?.title ?? robot.seo.title,
      description: ownerSeo?.description ?? robot.seo.description,
      canonical: robot.route,
      h1: ownerSeo?.h1 ?? `Аренда ${robot.identity.name}`,
      primaryKeyword: ownerSeo?.primaryKeyword ?? `аренда ${robot.identity.name}`,
      secondaryKeywords: ownerSeo?.secondaryKeywords ?? [`прокат ${robot.identity.name}`, `${robot.identity.name} на мероприятие`],
    },
    seoIntent: ownerSeoIntent,
    aiSummary: pilot?.blocks.aiSummary ?? ownerAiSummaryBySlug[robot.slug] ?? `${robot.identity.name} — робот из каталога КИБЕР ПОРТАЛ для мероприятий. Preview-шаблон показывает реальные данные карточки: описание услуги, сценарии, медиа, цену в утверждённом статусе и заявку без публикации на production.`,
    goshaQuote: preparedGoshaQuote,
    hero: {
      id: 'hero',
      title: `Аренда ${robot.identity.name}`,
      text: robot.seo.description,
      items: [],
      sourceStatus: 'page_content',
    },
    bodyBlocks: [
      ...(ownerCopy ? [
        {
          id: 'capabilitiesLead',
          text: ownerCopy.capabilitiesLead,
          items: [],
          sourceStatus: 'page_content' as const,
        },
        {
          id: 'scenariosLead',
          text: ownerCopy.scenariosLead,
          items: [],
          sourceStatus: 'page_content' as const,
        },
      ] : []),
      ...limitationBlocks,
    ],
    cta: {
      label: 'Обсудить сценарий с менеджером',
      href: `/lead/request/?robot=${robot.slug}&source=kiber94-preview`,
      note: 'Финальная программа, площадка, доступность и стоимость подтверждаются менеджером КИБЕР ПОРТАЛ.',
    },
    faq: (ownerFaq ?? robot.faq).map((item) => ({ ...item, sourceStatus: 'page_content' as const })),
    reviewOnly: {
      publicRender: false,
      blocks: ['priceSourceReconciliation', 'claimSourceStatus', 'wordstatAnalysis', 'serpAnalysis', 'sourceNotes'],
      notes: [
        'Preview route only: data is mapped from src/content/robots.generated.json.',
        'Public replacement of /robots/[slug]/ requires separate visual/content approval.',
      ],
    },
    robot: {
      name: robot.slug === 'arenda-robota-tron' ? 'Tron' : robot.slug === 'arenda-robota-sofiya' ? 'София' : robot.slug === 'arenda-robota-ardi' ? 'Робот Арди' : robot.identity.name,
      manufacturer: robot.slug === 'arenda-robota-tron' ? undefined : robot.slug === 'arenda-robota-sofiya' ? 'Hanson Robotics' : robot.identity.manufacturer,
      model: robot.slug === 'arenda-robota-tron' ? 'Tron' : robot.slug === 'arenda-robota-sofiya' ? 'Sophia' : robot.identity.model,
      category: robot.category,
      priceStatus,
      priceDisplay: robot.pricing.display,
      capabilities: ownerCapabilityBlocks ?? capabilityBlocks,
      scenarios: ownerScenarioBlocks ?? scenarioBlocks,
      gallery: preparedGallery,
    },
  };
}
