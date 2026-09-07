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
};

const ownerFaqBySlug: Record<string, OwnerFaqOverride> = {
  'arenda-agibot-x2': [
    { question: "Для каких мероприятий подходит Agibot X2?", answer: "Agibot x2 используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда Agibot X2?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },
  ],
  'arenda-noetix-bumi': [
    { question: "Для каких мероприятий подходит Noetix Bumi?", answer: "Noetix bumi используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда Noetix Bumi?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },
  ],
  'arenda-unitree-r1': [
    { question: "Для каких мероприятий подходит Unitree R1?", answer: "Unitree r1 используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда Unitree R1?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },
  ],
  'arenda-unitree-h2': [
    { question: "Для каких мероприятий подходит Unitree H2?", answer: "Unitree h2 используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда Unitree H2?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },
  ],
  'arenda-robota-sofiya': [
    { question: "Для каких мероприятий подходит робота София?", answer: "Робота софия используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда робота София?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },
  ],
  'arenda-robota-ardi': [
    { question: "Для каких мероприятий подходит робота Арди?", answer: "Робота арди используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда робота Арди?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },
  ],
  'arenda-robota-tron': [
    { question: "Для каких мероприятий подходит робота Tron?", answer: "Робота tron используют для выставок, презентаций, открытий, корпоративных событий и интерактивных зон, где нужен заметный технологичный герой и управляемый сценарий общения с гостями." },
    { question: "Сколько стоит аренда робота Tron?", answer: "Стоимость зависит от даты, города, длительности, сценария, требований площадки и состава сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит задачу и подготовит расчёт под формат события." },
    { question: "Нужен ли оператор на площадке?", answer: "Да, для таких роботов нужен оператор: он готовит выход, следит за безопасной зоной, помогает команде площадки и адаптирует сценарий под реальную ситуацию." },
    { question: "Какие требования к площадке?", answer: "Нужны ровная безопасная зона, достаточное пространство для демонстрации, понятная точка выхода и возможность заранее согласовать маршрут или место взаимодействия с гостями." },
    { question: "Можно ли адаптировать сценарий под бренд?", answer: "Да, сценарий можно привязать к продукту, стенду, презентации или welcome-зоне. Тексты, тайминг и роль робота лучше согласовать заранее, чтобы он работал на цель мероприятия." },
  ],
  'arenda-kettybot': [
    { question: 'Для каких мероприятий подходит KettyBot?', answer: 'KettyBot подходит для ресторанов, кафе, отелей, банкетов, фуршетов и выставочных зон HoReCa. Робот помогает доставлять блюда, напитки или промо-материалы по заранее настроенному маршруту и одновременно создаёт заметный технологичный сервис.' },
    { question: 'Сколько стоит аренда KettyBot?', answer: 'Стоимость зависит от даты, города, длительности аренды, маршрутов, брендирования экрана и необходимости операторского сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит план зала, задачу робота и подготовит расчёт под ваш формат.' },
    { question: 'Нужен ли оператор для робота-официанта?', answer: 'Для мероприятия мы рекомендуем сопровождение: оператор помогает настроить маршрут, проверить проходы, объяснить персоналу загрузку подносов и быстро решить вопросы на площадке.' },
    { question: 'Какие требования к площадке?', answer: 'Нужен ровный сухой пол, достаточная ширина проходов, понятные точки остановки и стабильная зона движения без высоких порогов. Перед запуском команда проверяет маршрут и расстановку мебели.' },
    { question: 'Можно ли использовать KettyBot как рекламный экран?', answer: 'Да, экран робота можно использовать для приветствий, акций, меню, логотипа или коротких брендированных сообщений. Материалы и сценарий показа лучше согласовать заранее, чтобы реклама не мешала сервисной задаче.' },
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
  'arenda-xiaomi-cyberdog-2': "Xiaomi CyberDog 2 — технологичная робособака для промо, IT-событий, фотозон и съёмок. Карточка объясняет, где он уместен, какие сценарии можно подготовить и почему нужен оператор.",
  'arenda-promobot-v4': "Promobot V4 — промо-робот для выставок, торговых центров, форумов и открытий. Его используют как интерактивного персонажа с экраном, речевым сценарием и операторским сопровождением.",
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
};

export function toRobotCardTemplateData(robot: RobotPageRecord): RobotCardTemplateData {
  const priceStatus = robot.pricing.mode === 'calculated' ? 'request' : 'needs_review';
  const ownerCopy = ownerRobotCardCopyBySlug[robot.slug];
  const ownerSeo = ownerSeoBySlug[robot.slug];
  const ownerSeoIntent = ownerSeoIntentBySlug[robot.slug];
  const ownerFaq = ownerFaqBySlug[robot.slug];
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
  const preparedGoshaQuote = ownerGoshaQuoteBySlug[robot.slug] ?? fallbackGoshaQuoteForUnpreparedRobot(robot);
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
    aiSummary: ownerAiSummaryBySlug[robot.slug] ?? `${robot.identity.name} — робот из каталога КИБЕР ПОРТАЛ для мероприятий. Preview-шаблон показывает реальные данные карточки: описание услуги, сценарии, медиа, цену в утверждённом статусе и заявку без публикации на production.`,
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
      name: robot.identity.name,
      manufacturer: robot.identity.manufacturer,
      model: robot.identity.model,
      category: robot.category,
      priceStatus,
      priceDisplay: robot.pricing.display,
      capabilities: ownerCapabilityBlocks ?? capabilityBlocks,
      scenarios: ownerScenarioBlocks ?? scenarioBlocks,
      gallery: preparedGallery,
    },
  };
}
