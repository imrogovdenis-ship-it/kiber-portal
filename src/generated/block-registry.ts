// GENERATED FILE — DO NOT EDIT. Source: design-system/blocks and fixtures
export const blockRegistry = [
  {
    spec: {
      "schema_version": 1,
      "id": "robot-card",
      "review_id": "05",
      "name": "Robot Card",
      "status": "pilot",
      "component": "src/components/blocks/RobotCard.astro",
      "used_in": [
        "catalog",
        "related",
        "collection",
        "design-review"
      ],
      "variants": [
        "default",
        "compact"
      ],
      "tokens": {
        "surface": "{robot-card.surface}",
        "image_radius": "{robot-card.image.radius}",
        "image_object_position": "{robot-card.image.object-position}",
        "image_hover_scale": "{robot-card.image.hover-scale}",
        "content_gap": "{robot-card.content.gap}",
        "content_padding_block_start": "{robot-card.content.padding-block-start}",
        "content_padding_inline": "{robot-card.content.padding-inline}",
        "title_color": "{robot-card.title.color}",
        "title_typography": "{typography.title-s.family}",
        "price_color": "{robot-card.price.color}",
        "description_color": "{robot-card.description.color}",
        "category_color": "{robot-card.category.color}",
        "badge_background": "{robot-card.badge.background}",
        "badge_inset": "{robot-card.badge.inset}",
        "focus_color": "{robot-card.focus.color}"
      },
      "content_contract": {
        "required": [
          "slug",
          "href",
          "title",
          "category",
          "price",
          "price_disclaimer",
          "description",
          "analytics"
        ],
        "optional": [
          "image",
          "badge"
        ],
        "rules": [
          "image alt describes visible content without price or SEO keywords",
          "price disclaimer is rendered next to every published price",
          "missing image renders a neutral technical placeholder"
        ]
      },
      "responsive": {
        "sm": {
          "columns": 2,
          "variant": "default"
        },
        "md": {
          "columns": 2,
          "variant": "default"
        },
        "lg": {
          "columns": 3,
          "variant": "default"
        },
        "xl": {
          "columns": 4,
          "variant": "default"
        }
      },
      "accessibility": {
        "landmark": "article",
        "image_alt_required": true,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "robot_card_click"
        ]
      },
      "fixtures": [
        "default",
        "long-content",
        "minimal",
        "missing-optional",
        "mobile"
      ],
      "traceability": [
        {
          "source": "docs/source/reference-desktop-v9.html",
          "locator": "data-rv=\"05 · ROBOT CARD (каталог)\"; .robot-card"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"05\"; .robot-card"
        },
        {
          "source": "docs/source/BLOCK-SPEC-SOURCE.csv",
          "locator": "row-05"
        },
        {
          "source": "docs/source/BLOCK-HANDOFF.md",
          "locator": "block-05"
        },
        {
          "source": "DESIGN-SYSTEM-TZ.md",
          "locator": "section-8"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "robot-card-default",
        "block_id": "robot-card",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "data": {
          "slug": "unitree-g1",
          "href": "/robots/unitree-g1/",
          "title": "Unitree G1",
          "category": "Робот-гуманоид",
          "price": "от 150 000 ₽",
          "price_disclaimer": "Не является публичной офертой",
          "description": "Для выставок, презентаций и корпоративных мероприятий.",
          "image": null,
          "badge": "ХИТ",
          "analytics": {
            "event": "robot_card_click",
            "placement": "design_review",
            "position": 1
          }
        },
        "source": "design-system/fixtures/robot-card/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "robot-card-long-content",
        "block_id": "robot-card",
        "variant": "default",
        "viewport": "xl",
        "mode": "long-content",
        "data": {
          "slug": "humanoid-long-name",
          "href": "/robots/humanoid-long-name/",
          "title": "Робот-гуманоид с длинным названием для проверки переноса строк",
          "category": "Интерактивный гуманоид для мероприятий",
          "price": "Цена рассчитывается индивидуально",
          "price_disclaimer": "Не является публичной офертой",
          "description": "Длинное описание проверяет устойчивость карточки при нескольких строках текста, разных сценариях использования и отсутствии короткой рекламной формулировки.",
          "image": null,
          "badge": "НОВИНКА",
          "analytics": {
            "event": "robot_card_click",
            "placement": "design_review",
            "position": 2
          }
        },
        "source": "design-system/fixtures/robot-card/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "robot-card-minimal",
        "block_id": "robot-card",
        "variant": "compact",
        "viewport": "md",
        "mode": "minimal",
        "data": {
          "slug": "compact-robot",
          "href": "/robots/compact-robot/",
          "title": "Компактный робот",
          "category": "Робот",
          "price": "По запросу",
          "price_disclaimer": "Не является публичной офертой",
          "description": "Для мероприятий.",
          "analytics": {
            "event": "robot_card_click",
            "placement": "design_review"
          }
        },
        "source": "design-system/fixtures/robot-card/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "robot-card-missing-optional",
        "block_id": "robot-card",
        "variant": "default",
        "viewport": "lg",
        "mode": "missing-optional",
        "data": {
          "slug": "robot-without-media",
          "href": "/robots/robot-without-media/",
          "title": "Робот без готового изображения",
          "category": "Сервисный робот",
          "price": "По запросу",
          "price_disclaimer": "Не является публичной офертой",
          "description": "Техническое состояние до загрузки утверждённого ассета.",
          "analytics": {
            "event": "robot_card_click",
            "placement": "design_review"
          }
        },
        "source": "design-system/fixtures/robot-card/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "robot-card-mobile",
        "block_id": "robot-card",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "data": {
          "slug": "mobile-robot",
          "href": "/robots/mobile-robot/",
          "title": "Робот для мобильного стенда",
          "category": "Робот-гуманоид",
          "price": "от 150 000 ₽",
          "price_disclaimer": "Не является публичной офертой",
          "description": "Проверка двухколоночной мобильной сетки и уменьшенной типографики.",
          "image": null,
          "badge": "ХИТ",
          "analytics": {
            "event": "robot_card_click",
            "placement": "design_review",
            "position": 1
          }
        },
        "source": "design-system/fixtures/robot-card/mobile.yaml"
      }
    ],
    load: () => import("../components/blocks/RobotCard.astro"),
  }
] as const;

export type RegisteredBlockId = (typeof blockRegistry)[number]['spec']['id'];
