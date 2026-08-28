// GENERATED FILE — DO NOT EDIT. Source: design-system/blocks and fixtures
export const blockRegistry = [
  {
    spec: {
      "schema_version": 1,
      "id": "site-header",
      "review_id": "01",
      "name": "Site Header",
      "status": "pilot",
      "component": "src/components/layout/Header.astro",
      "used_in": [
        "all-public-pages",
        "design-review"
      ],
      "variants": [
        "default"
      ],
      "tokens": {
        "surface": "{color.surface}",
        "foreground": "{color.ink.heading}",
        "muted": "{color.text.muted}",
        "action": "{color.action.rest}",
        "focus": "{color.badge}"
      },
      "content_contract": {
        "required": [
          "logo_label",
          "nav",
          "phone",
          "cta"
        ],
        "optional": [],
        "rules": [
          "navigation contains no more than seven primary destinations",
          "phone remains a real tel link and CTA remains a real link without JavaScript dependency"
        ]
      },
      "responsive": {
        "sm": {
          "navigation": "disclosure",
          "sticky": true
        },
        "md": {
          "navigation": "disclosure",
          "sticky": true
        },
        "lg": {
          "navigation": "inline",
          "sticky": true
        },
        "xl": {
          "navigation": "inline",
          "sticky": true
        }
      },
      "accessibility": {
        "landmark": "banner",
        "image_alt_required": false,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "phone_click",
          "contact_click"
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
          "locator": "data-rv=\"01 · HEADER\"; .site-header"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"01\"; .site-header"
        },
        {
          "source": "docs/DESIGN-SYSTEM-TZ.md",
          "locator": "Header/Footer/Breadcrumbs"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "site-header-default",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "site-header",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "nav": [
            {
              "href": "/#catalog",
              "label": "Каталог"
            },
            {
              "href": "/compilations",
              "label": "Подборки"
            },
            {
              "href": "/articles",
              "label": "Блог"
            },
            {
              "href": "/news",
              "label": "Новости"
            },
            {
              "href": "/contacts",
              "label": "Контакты"
            }
          ],
          "phone": "+7 000 000-00-00",
          "cta": {
            "href": "/contacts",
            "label": "Написать нам"
          }
        },
        "source": "design-system/fixtures/site-header/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "site-header-long-content",
        "variant": "default",
        "viewport": "lg",
        "mode": "long-content",
        "block_id": "site-header",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "nav": [
            {
              "href": "/#catalog",
              "label": "Полный каталог роботов"
            },
            {
              "href": "/compilations",
              "label": "Тематические подборки"
            },
            {
              "href": "/articles",
              "label": "Статьи и руководства"
            },
            {
              "href": "/news",
              "label": "Новости робототехники"
            },
            {
              "href": "/contacts",
              "label": "Контакты и реквизиты"
            }
          ],
          "phone": "+7 000 000-00-00",
          "cta": {
            "href": "/contacts",
            "label": "Обсудить мероприятие"
          }
        },
        "source": "design-system/fixtures/site-header/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "site-header-minimal",
        "variant": "default",
        "viewport": "md",
        "mode": "minimal",
        "block_id": "site-header",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "nav": [
            {
              "href": "/#catalog",
              "label": "Каталог"
            }
          ],
          "phone": "+7 000 000-00-00",
          "cta": {
            "href": "/contacts",
            "label": "Контакты"
          }
        },
        "source": "design-system/fixtures/site-header/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "site-header-missing-optional",
        "variant": "default",
        "viewport": "xl",
        "mode": "missing-optional",
        "block_id": "site-header",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "nav": [
            {
              "href": "/#catalog",
              "label": "Каталог"
            },
            {
              "href": "/contacts",
              "label": "Контакты"
            }
          ],
          "phone": "+7 000 000-00-00",
          "cta": {
            "href": "/contacts",
            "label": "Написать нам"
          }
        },
        "source": "design-system/fixtures/site-header/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "site-header-mobile",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "site-header",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "nav": [
            {
              "href": "/#catalog",
              "label": "Каталог"
            },
            {
              "href": "/compilations",
              "label": "Подборки"
            },
            {
              "href": "/articles",
              "label": "Блог"
            },
            {
              "href": "/news",
              "label": "Новости"
            },
            {
              "href": "/contacts",
              "label": "Контакты"
            }
          ],
          "phone": "+7 000 000-00-00",
          "cta": {
            "href": "/contacts",
            "label": "Написать нам"
          }
        },
        "source": "design-system/fixtures/site-header/mobile.yaml"
      }
    ],
    load: () => import("../components/layout/Header.astro"),
  },
  {
    spec: {
      "schema_version": 1,
      "id": "home-hero",
      "review_id": "02",
      "name": "Home Hero",
      "status": "pilot",
      "component": "src/components/blocks/HomeHero.astro",
      "used_in": [
        "home",
        "robot",
        "collection",
        "design-review"
      ],
      "variants": [
        "default"
      ],
      "tokens": {
        "surface": "{color.surface}",
        "canvas": "{color.canvas}",
        "action": "{color.action.rest}",
        "border": "{color.border}",
        "heading": "{typography.heading.family}",
        "spacing": "{layout.content.padding}"
      },
      "content_contract": {
        "required": [
          "eyebrow",
          "title",
          "lead",
          "primary",
          "stats",
          "analytics"
        ],
        "optional": [
          "secondary"
        ],
        "rules": [
          "public copy stays factual and does not promise unavailable lead destinations",
          "focus-visible state remains available for every interactive element",
          "mobile and desktop fixtures are reviewed before reuse in production pages"
        ]
      },
      "responsive": {
        "sm": {
          "columns": 1,
          "stacked": true,
          "media_aspect_ratio": "16:9",
          "media_fit": "contain"
        },
        "md": {
          "columns": 1,
          "stacked": true,
          "media_aspect_ratio": "16:9",
          "media_fit": "contain"
        },
        "lg": {
          "columns": 2,
          "stacked": false,
          "media_aspect_ratio": "freeform",
          "media_fit": "cover"
        },
        "xl": {
          "columns": 2,
          "stacked": false,
          "media_aspect_ratio": "freeform",
          "media_fit": "cover"
        }
      },
      "accessibility": {
        "landmark": "section",
        "image_alt_required": false,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "contact_click"
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
          "locator": "data-rv=\"02 · HOME HERO\"; .home-hero"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"02\"; .home-hero"
        },
        {
          "source": "DESIGN-SYSTEM-TZ.md",
          "locator": "KIBER-32-commercial-components-mvp"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "home-hero-default",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "home-hero",
        "data": {
          "eyebrow": "Роботы для мероприятий",
          "title": "Аренда роботов, которые встречают гостей и держат внимание",
          "lead": "Подберём формат под площадку, тайминг и сценарий. Робот работает как часть программы, а менеджер помогает собрать безопасный план.",
          "primary": {
            "href": "/contacts/",
            "label": "Обсудить мероприятие"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Смотреть каталог"
          },
          "stats": [
            {
              "value": "24",
              "label": "модели в каталоге"
            },
            {
              "value": "1 день",
              "label": "типовой минимум для шоу-форматов"
            }
          ],
          "analytics": {
            "event": "contact_click",
            "block_id": "home-hero"
          }
        },
        "source": "design-system/fixtures/home-hero/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "home-hero-long-content",
        "variant": "default",
        "viewport": "xl",
        "mode": "long-content",
        "block_id": "home-hero",
        "data": {
          "eyebrow": "Роботы для мероприятий",
          "title": "Аренда роботов, которые встречают гостей и держат внимание — длинная проверка переносов",
          "lead": "Подберём формат под площадку, тайминг и сценарий. Робот работает как часть программы, а менеджер помогает собрать безопасный план.",
          "primary": {
            "href": "/contacts/",
            "label": "Обсудить мероприятие"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Смотреть каталог"
          },
          "stats": [
            {
              "value": "24",
              "label": "модели в каталоге"
            },
            {
              "value": "1 день",
              "label": "типовой минимум для шоу-форматов"
            }
          ],
          "analytics": {
            "event": "contact_click",
            "block_id": "home-hero"
          }
        },
        "source": "design-system/fixtures/home-hero/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "home-hero-minimal",
        "variant": "default",
        "viewport": "md",
        "mode": "minimal",
        "block_id": "home-hero",
        "data": {
          "eyebrow": "Роботы для мероприятий",
          "title": "Аренда роботов, которые встречают гостей и держат внимание",
          "lead": "Подберём формат под площадку, тайминг и сценарий. Робот работает как часть программы, а менеджер помогает собрать безопасный план.",
          "primary": {
            "href": "/contacts/",
            "label": "Обсудить мероприятие"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Смотреть каталог"
          },
          "stats": [
            {
              "value": "24",
              "label": "модели в каталоге"
            },
            {
              "value": "1 день",
              "label": "типовой минимум для шоу-форматов"
            }
          ],
          "analytics": {
            "event": "contact_click",
            "block_id": "home-hero"
          }
        },
        "source": "design-system/fixtures/home-hero/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "home-hero-missing-optional",
        "variant": "default",
        "viewport": "lg",
        "mode": "missing-optional",
        "block_id": "home-hero",
        "data": {
          "eyebrow": "Роботы для мероприятий",
          "title": "Аренда роботов, которые встречают гостей и держат внимание",
          "lead": "Подберём формат под площадку, тайминг и сценарий. Робот работает как часть программы, а менеджер помогает собрать безопасный план.",
          "primary": {
            "href": "/contacts/",
            "label": "Обсудить мероприятие"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Смотреть каталог"
          },
          "stats": [
            {
              "value": "24",
              "label": "модели в каталоге"
            },
            {
              "value": "1 день",
              "label": "типовой минимум для шоу-форматов"
            }
          ],
          "analytics": {
            "event": "contact_click",
            "block_id": "home-hero"
          }
        },
        "source": "design-system/fixtures/home-hero/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "home-hero-mobile",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "home-hero",
        "data": {
          "eyebrow": "Роботы для мероприятий",
          "title": "Аренда роботов, которые встречают гостей и держат внимание",
          "lead": "Подберём формат под площадку, тайминг и сценарий. Робот работает как часть программы, а менеджер помогает собрать безопасный план.",
          "primary": {
            "href": "/contacts/",
            "label": "Обсудить мероприятие"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Смотреть каталог"
          },
          "stats": [
            {
              "value": "24",
              "label": "модели в каталоге"
            },
            {
              "value": "1 день",
              "label": "типовой минимум для шоу-форматов"
            }
          ],
          "analytics": {
            "event": "contact_click",
            "block_id": "home-hero"
          }
        },
        "source": "design-system/fixtures/home-hero/mobile.yaml"
      }
    ],
    load: () => import("../components/blocks/HomeHero.astro"),
  },
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
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "robot-card",
        "data": {
          "slug": "arenda-unitree-g1",
          "href": "/robots/arenda-unitree-g1/",
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
        "variant": "default",
        "viewport": "xl",
        "mode": "long-content",
        "block_id": "robot-card",
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
        "variant": "compact",
        "viewport": "md",
        "mode": "minimal",
        "block_id": "robot-card",
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
        "variant": "default",
        "viewport": "lg",
        "mode": "missing-optional",
        "block_id": "robot-card",
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
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "robot-card",
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
  },
  {
    spec: {
      "schema_version": 1,
      "id": "faq",
      "review_id": "07",
      "name": "FAQ",
      "status": "pilot",
      "component": "src/components/blocks/Faq.astro",
      "used_in": [
        "home",
        "robot",
        "collection",
        "design-review"
      ],
      "variants": [
        "default"
      ],
      "tokens": {
        "surface": "{color.surface}",
        "canvas": "{color.canvas}",
        "action": "{color.action.rest}",
        "border": "{color.border}",
        "heading": "{typography.heading.family}",
        "spacing": "{layout.content.padding}"
      },
      "content_contract": {
        "required": [
          "title",
          "items"
        ],
        "optional": [],
        "rules": [
          "public copy stays factual and does not promise unavailable lead destinations",
          "focus-visible state remains available for every interactive element",
          "mobile and desktop fixtures are reviewed before reuse in production pages"
        ]
      },
      "responsive": {
        "sm": {
          "columns": 1,
          "stacked": true
        },
        "md": {
          "columns": 1,
          "stacked": true
        },
        "lg": {
          "columns": 2,
          "stacked": false
        },
        "xl": {
          "columns": 2,
          "stacked": false
        }
      },
      "accessibility": {
        "landmark": "section",
        "image_alt_required": false,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "contact_click"
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
          "locator": "data-rv=\"07 · FAQ\"; .faq"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"07\"; .faq"
        },
        {
          "source": "DESIGN-SYSTEM-TZ.md",
          "locator": "KIBER-32-commercial-components-mvp"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "faq-default",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "faq",
        "data": {
          "title": "Частые вопросы",
          "items": [
            {
              "question": "Можно ли поставить робота на улице?",
              "answer": "Зависит от модели, покрытия, погоды и сценария. Перед подтверждением менеджер проверяет условия площадки."
            },
            {
              "question": "Цена фиксированная?",
              "answer": "Базовые тарифы есть в source-of-truth, но финальная смета зависит от города, времени, операторов и логистики."
            }
          ]
        },
        "source": "design-system/fixtures/faq/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "faq-long-content",
        "variant": "default",
        "viewport": "xl",
        "mode": "long-content",
        "block_id": "faq",
        "data": {
          "title": "Частые вопросы — длинная проверка переносов",
          "items": [
            {
              "question": "Можно ли поставить робота на улице?",
              "answer": "Зависит от модели, покрытия, погоды и сценария. Перед подтверждением менеджер проверяет условия площадки."
            },
            {
              "question": "Цена фиксированная?",
              "answer": "Базовые тарифы есть в source-of-truth, но финальная смета зависит от города, времени, операторов и логистики."
            }
          ]
        },
        "source": "design-system/fixtures/faq/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "faq-minimal",
        "variant": "default",
        "viewport": "md",
        "mode": "minimal",
        "block_id": "faq",
        "data": {
          "title": "Частые вопросы",
          "items": [
            {
              "question": "Можно ли поставить робота на улице?",
              "answer": "Зависит от модели, покрытия, погоды и сценария. Перед подтверждением менеджер проверяет условия площадки."
            },
            {
              "question": "Цена фиксированная?",
              "answer": "Базовые тарифы есть в source-of-truth, но финальная смета зависит от города, времени, операторов и логистики."
            }
          ]
        },
        "source": "design-system/fixtures/faq/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "faq-missing-optional",
        "variant": "default",
        "viewport": "lg",
        "mode": "missing-optional",
        "block_id": "faq",
        "data": {
          "title": "Частые вопросы",
          "items": [
            {
              "question": "Можно ли поставить робота на улице?",
              "answer": "Зависит от модели, покрытия, погоды и сценария. Перед подтверждением менеджер проверяет условия площадки."
            },
            {
              "question": "Цена фиксированная?",
              "answer": "Базовые тарифы есть в source-of-truth, но финальная смета зависит от города, времени, операторов и логистики."
            }
          ]
        },
        "source": "design-system/fixtures/faq/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "faq-mobile",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "faq",
        "data": {
          "title": "Частые вопросы",
          "items": [
            {
              "question": "Можно ли поставить робота на улице?",
              "answer": "Зависит от модели, покрытия, погоды и сценария. Перед подтверждением менеджер проверяет условия площадки."
            },
            {
              "question": "Цена фиксированная?",
              "answer": "Базовые тарифы есть в source-of-truth, но финальная смета зависит от города, времени, операторов и логистики."
            }
          ]
        },
        "source": "design-system/fixtures/faq/mobile.yaml"
      }
    ],
    load: () => import("../components/blocks/Faq.astro"),
  },
  {
    spec: {
      "schema_version": 1,
      "id": "cta-strip",
      "review_id": "09",
      "name": "CTA Strip",
      "status": "pilot",
      "component": "src/components/blocks/CtaStrip.astro",
      "used_in": [
        "home",
        "robot",
        "collection",
        "design-review"
      ],
      "variants": [
        "default"
      ],
      "tokens": {
        "surface": "{color.surface}",
        "canvas": "{color.canvas}",
        "action": "{color.action.rest}",
        "border": "{color.border}",
        "heading": "{typography.heading.family}",
        "spacing": "{layout.content.padding}"
      },
      "content_contract": {
        "required": [
          "title",
          "text",
          "primary",
          "analytics"
        ],
        "optional": [
          "secondary"
        ],
        "rules": [
          "public copy stays factual and does not promise unavailable lead destinations",
          "focus-visible state remains available for every interactive element",
          "mobile and desktop fixtures are reviewed before reuse in production pages"
        ]
      },
      "responsive": {
        "sm": {
          "columns": 1,
          "stacked": true
        },
        "md": {
          "columns": 1,
          "stacked": true
        },
        "lg": {
          "columns": 2,
          "stacked": false
        },
        "xl": {
          "columns": 2,
          "stacked": false
        }
      },
      "accessibility": {
        "landmark": "section",
        "image_alt_required": false,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "contact_click"
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
          "locator": "data-rv=\"09 · CTA STRIP\"; .cta-strip"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"09\"; .cta-strip"
        },
        {
          "source": "DESIGN-SYSTEM-TZ.md",
          "locator": "KIBER-32-commercial-components-mvp"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "cta-strip-default",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "cta-strip",
        "data": {
          "title": "Нужен робот под конкретную площадку?",
          "text": "Опишите дату, город, формат и ожидаемое количество гостей — вернёмся с подходящими моделями.",
          "primary": {
            "href": "/contacts/",
            "label": "Написать менеджеру"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Открыть каталог"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "cta-strip"
          }
        },
        "source": "design-system/fixtures/cta-strip/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "cta-strip-long-content",
        "variant": "default",
        "viewport": "xl",
        "mode": "long-content",
        "block_id": "cta-strip",
        "data": {
          "title": "Нужен робот под конкретную площадку? — длинная проверка переносов",
          "text": "Опишите дату, город, формат и ожидаемое количество гостей — вернёмся с подходящими моделями.",
          "primary": {
            "href": "/contacts/",
            "label": "Написать менеджеру"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Открыть каталог"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "cta-strip"
          }
        },
        "source": "design-system/fixtures/cta-strip/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "cta-strip-minimal",
        "variant": "default",
        "viewport": "md",
        "mode": "minimal",
        "block_id": "cta-strip",
        "data": {
          "title": "Нужен робот под конкретную площадку?",
          "text": "Опишите дату, город, формат и ожидаемое количество гостей — вернёмся с подходящими моделями.",
          "primary": {
            "href": "/contacts/",
            "label": "Написать менеджеру"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Открыть каталог"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "cta-strip"
          }
        },
        "source": "design-system/fixtures/cta-strip/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "cta-strip-missing-optional",
        "variant": "default",
        "viewport": "lg",
        "mode": "missing-optional",
        "block_id": "cta-strip",
        "data": {
          "title": "Нужен робот под конкретную площадку?",
          "text": "Опишите дату, город, формат и ожидаемое количество гостей — вернёмся с подходящими моделями.",
          "primary": {
            "href": "/contacts/",
            "label": "Написать менеджеру"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Открыть каталог"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "cta-strip"
          }
        },
        "source": "design-system/fixtures/cta-strip/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "cta-strip-mobile",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "cta-strip",
        "data": {
          "title": "Нужен робот под конкретную площадку?",
          "text": "Опишите дату, город, формат и ожидаемое количество гостей — вернёмся с подходящими моделями.",
          "primary": {
            "href": "/contacts/",
            "label": "Написать менеджеру"
          },
          "secondary": {
            "href": "/robots/",
            "label": "Открыть каталог"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "cta-strip"
          }
        },
        "source": "design-system/fixtures/cta-strip/mobile.yaml"
      }
    ],
    load: () => import("../components/blocks/CtaStrip.astro"),
  },
  {
    spec: {
      "schema_version": 1,
      "id": "breadcrumbs",
      "review_id": "10",
      "name": "Breadcrumbs",
      "status": "pilot",
      "component": "src/components/layout/Breadcrumbs.astro",
      "used_in": [
        "detail-pages",
        "design-review"
      ],
      "variants": [
        "default"
      ],
      "tokens": {
        "surface": "{color.canvas}",
        "link": "{color.text.muted}",
        "current": "{color.ink.heading}",
        "focus": "{color.badge}"
      },
      "content_contract": {
        "required": [
          "items"
        ],
        "optional": [],
        "rules": [
          "items match the visible hierarchy and generated BreadcrumbList JSON-LD",
          "final item is current and is not a link"
        ]
      },
      "responsive": {
        "sm": {
          "wrap": true
        },
        "md": {
          "wrap": true
        },
        "lg": {
          "wrap": true
        },
        "xl": {
          "wrap": true
        }
      },
      "accessibility": {
        "landmark": "navigation",
        "image_alt_required": false,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "breadcrumb_click"
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
          "locator": "data-rv=\"10 · BREADCRUMBS\"; .breadcrumbs"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"10\"; .breadcrumbs"
        },
        {
          "source": "docs/DESIGN-SYSTEM-TZ.md",
          "locator": "BreadcrumbList"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "breadcrumbs-default",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "breadcrumbs",
        "data": {
          "items": [
            {
              "name": "Главная",
              "url": "/"
            },
            {
              "name": "Каталог",
              "url": "/#catalog"
            },
            {
              "name": "Unitree G1",
              "url": "/robots/arenda-unitree-g1/"
            }
          ]
        },
        "source": "design-system/fixtures/breadcrumbs/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "breadcrumbs-long-content",
        "variant": "default",
        "viewport": "lg",
        "mode": "long-content",
        "block_id": "breadcrumbs",
        "data": {
          "items": [
            {
              "name": "Главная",
              "url": "/"
            },
            {
              "name": "Каталог роботов для мероприятий",
              "url": "/#catalog"
            },
            {
              "name": "Роботы-гуманоиды для выставок и конференций",
              "url": "/roboty-gumanoidy"
            },
            {
              "name": "Unitree G1",
              "url": "/robots/arenda-unitree-g1/"
            }
          ]
        },
        "source": "design-system/fixtures/breadcrumbs/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "breadcrumbs-minimal",
        "variant": "default",
        "viewport": "md",
        "mode": "minimal",
        "block_id": "breadcrumbs",
        "data": {
          "items": [
            {
              "name": "Главная",
              "url": "/"
            },
            {
              "name": "Контакты",
              "url": "/contacts"
            }
          ]
        },
        "source": "design-system/fixtures/breadcrumbs/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "breadcrumbs-missing-optional",
        "variant": "default",
        "viewport": "xl",
        "mode": "missing-optional",
        "block_id": "breadcrumbs",
        "data": {
          "items": [
            {
              "name": "Главная",
              "url": "/"
            },
            {
              "name": "Новости",
              "url": "/news"
            }
          ]
        },
        "source": "design-system/fixtures/breadcrumbs/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "breadcrumbs-mobile",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "breadcrumbs",
        "data": {
          "items": [
            {
              "name": "Главная",
              "url": "/"
            },
            {
              "name": "Каталог",
              "url": "/#catalog"
            },
            {
              "name": "Unitree G1",
              "url": "/robots/arenda-unitree-g1/"
            }
          ]
        },
        "source": "design-system/fixtures/breadcrumbs/mobile.yaml"
      }
    ],
    load: () => import("../components/layout/Breadcrumbs.astro"),
  },
  {
    spec: {
      "schema_version": 1,
      "id": "robot-hero",
      "review_id": "11",
      "name": "Robot Detail Hero",
      "status": "pilot",
      "component": "src/components/blocks/RobotPageHero.astro",
      "used_in": [
        "robot"
      ],
      "variants": [
        "default"
      ],
      "tokens": {
        "surface": "{color.surface}",
        "canvas": "{color.canvas}",
        "action": "{color.action.rest}",
        "border": "{color.border}",
        "heading": "{typography.heading.family}",
        "spacing": "{layout.content.padding}"
      },
      "content_contract": {
        "required": [
          "breadcrumbs",
          "taxonomy",
          "title",
          "excerpt",
          "price",
          "primary",
          "media"
        ],
        "optional": [
          "secondary",
          "next_steps"
        ],
        "rules": [
          "robot detail media card remains square 1:1 on mobile and tablet viewports",
          "robot image uses contained fitting in mobile/tablet square media card to avoid destructive crop",
          "desktop and landscape layouts may place media beside copy while preserving the card geometry",
          "public copy stays factual and does not promise unavailable lead destinations",
          "lead destination remains static-safe until routing/legal approvals exist"
        ]
      },
      "responsive": {
        "sm": {
          "columns": 1,
          "stacked": true,
          "media_aspect_ratio": "1:1",
          "media_fit": "contain"
        },
        "md": {
          "columns": 1,
          "stacked": true,
          "media_aspect_ratio": "1:1",
          "media_fit": "contain"
        },
        "lg": {
          "columns": 2,
          "stacked": false,
          "media_aspect_ratio": "1:1",
          "media_fit": "cover"
        },
        "xl": {
          "columns": 2,
          "stacked": false,
          "media_aspect_ratio": "1:1",
          "media_fit": "cover"
        }
      },
      "accessibility": {
        "landmark": "section",
        "image_alt_required": true,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "contact_click"
        ]
      },
      "fixtures": [
        "default"
      ],
      "traceability": [
        {
          "source": "docs/source/reference-desktop-v9.html",
          "locator": "data-rv=\"11 · ROBOT HERO\"; .robot-hero"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"11\"; .robot-hero"
        },
        {
          "source": "docs/review/kiber-88/reference-visual-layer-evidence.md",
          "locator": "Second feedback pass: Robot page mobile 375 and tablet 768 image card returned to square 1:1"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "robot-hero-default",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "robot-hero",
        "data": {
          "manufacturer": "Unitree",
          "model": "G1",
          "title": "Unitree G1 для мероприятий",
          "description": "Гуманоид Unitree G1 на прокат с оператором для шоу, форума или промо. Рассчитываем стоимость за час.",
          "price": "от 12 500 ₽ / час",
          "primary": {
            "href": "/lead/request/?robot=arenda-unitree-g1",
            "label": "Оставить заявку"
          },
          "secondary": {
            "href": "/",
            "label": "Вернуться на главную"
          },
          "image": {
            "src": "/images/kiber-45/arenda-unitree-g1.webp",
            "alt": "Робот-гуманоид Unitree G1 для мероприятия",
            "mobile_aspect_ratio": "1:1",
            "mobile_fit": "contain"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "robot-hero"
          }
        },
        "source": "design-system/fixtures/robot-hero/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "robot-hero-long-content",
        "variant": "default",
        "viewport": "xl",
        "mode": "long-content",
        "block_id": "robot-hero",
        "data": {
          "manufacturer": "Unitree",
          "model": "G1",
          "title": "Unitree G1 для мероприятий",
          "description": "Гуманоид Unitree G1 на прокат с оператором для деловой программы, форума, промо-зоны или развлекательного сценария. Менеджер уточнит площадку, тайминг, логистику и ограничения перед финальной сметой.",
          "price": "от 12 500 ₽ / час",
          "primary": {
            "href": "/lead/request/?robot=arenda-unitree-g1",
            "label": "Оставить заявку"
          },
          "secondary": {
            "href": "/",
            "label": "Вернуться на главную"
          },
          "image": {
            "src": "/images/kiber-45/arenda-unitree-g1.webp",
            "alt": "Робот-гуманоид Unitree G1 для мероприятия",
            "mobile_aspect_ratio": "1:1",
            "mobile_fit": "contain"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "robot-hero"
          }
        },
        "source": "design-system/fixtures/robot-hero/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "robot-hero-minimal",
        "variant": "default",
        "viewport": "lg",
        "mode": "minimal",
        "block_id": "robot-hero",
        "data": {
          "manufacturer": "Unitree",
          "model": "G1",
          "title": "Unitree G1 для мероприятий",
          "description": "Гуманоид Unitree G1 для мероприятия с оператором.",
          "price": "от 12 500 ₽ / час",
          "primary": {
            "href": "/lead/request/?robot=arenda-unitree-g1",
            "label": "Оставить заявку"
          },
          "secondary": {
            "href": "/",
            "label": "Вернуться на главную"
          },
          "image": {
            "src": "/images/kiber-45/arenda-unitree-g1.webp",
            "alt": "Робот-гуманоид Unitree G1 для мероприятия",
            "mobile_aspect_ratio": "1:1",
            "mobile_fit": "contain"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "robot-hero"
          }
        },
        "source": "design-system/fixtures/robot-hero/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "robot-hero-missing-optional",
        "variant": "default",
        "viewport": "md",
        "mode": "missing-optional",
        "block_id": "robot-hero",
        "data": {
          "manufacturer": "Unitree",
          "model": "G1",
          "title": "Unitree G1 для мероприятий",
          "description": "Гуманоид Unitree G1 на прокат с оператором для шоу, форума или промо. Рассчитываем стоимость за час.",
          "price": "от 12 500 ₽ / час",
          "primary": {
            "href": "/lead/request/?robot=arenda-unitree-g1",
            "label": "Оставить заявку"
          },
          "secondary": {
            "href": "/",
            "label": "Вернуться на главную"
          },
          "image": {
            "src": "/images/kiber-45/arenda-unitree-g1.webp",
            "alt": "Робот-гуманоид Unitree G1 для мероприятия",
            "mobile_aspect_ratio": "1:1",
            "mobile_fit": "contain"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "robot-hero"
          }
        },
        "source": "design-system/fixtures/robot-hero/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "robot-hero-mobile",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "robot-hero",
        "data": {
          "manufacturer": "Unitree",
          "model": "G1",
          "title": "Unitree G1 для мероприятий",
          "description": "Гуманоид Unitree G1 на прокат с оператором для шоу, форума или промо. Рассчитываем стоимость за час.",
          "price": "от 12 500 ₽ / час",
          "primary": {
            "href": "/lead/request/?robot=arenda-unitree-g1",
            "label": "Оставить заявку"
          },
          "secondary": {
            "href": "/",
            "label": "Вернуться на главную"
          },
          "image": {
            "src": "/images/kiber-45/arenda-unitree-g1.webp",
            "alt": "Робот-гуманоид Unitree G1 для мероприятия",
            "mobile_aspect_ratio": "1:1",
            "mobile_fit": "contain"
          },
          "analytics": {
            "event": "contact_click",
            "block_id": "robot-hero"
          }
        },
        "source": "design-system/fixtures/robot-hero/mobile.yaml"
      }
    ],
    load: () => import("../components/blocks/RobotPageHero.astro"),
  },
  {
    spec: {
      "schema_version": 1,
      "id": "pricing",
      "review_id": "15",
      "name": "Pricing",
      "status": "pilot",
      "component": "src/components/blocks/Pricing.astro",
      "used_in": [
        "home",
        "robot",
        "collection",
        "design-review"
      ],
      "variants": [
        "default"
      ],
      "tokens": {
        "surface": "{color.surface}",
        "canvas": "{color.canvas}",
        "action": "{color.action.rest}",
        "border": "{color.border}",
        "heading": "{typography.heading.family}",
        "spacing": "{layout.content.padding}"
      },
      "content_contract": {
        "required": [
          "title",
          "disclaimer",
          "items"
        ],
        "optional": [],
        "rules": [
          "public copy stays factual and does not promise unavailable lead destinations",
          "legal disclaimer remains programmatically attached to every tariff card",
          "focus-visible state remains available for every interactive element",
          "mobile and desktop fixtures are reviewed before reuse in production pages"
        ]
      },
      "responsive": {
        "sm": {
          "columns": 1,
          "stacked": true
        },
        "md": {
          "columns": 1,
          "stacked": true
        },
        "lg": {
          "columns": 2,
          "stacked": false
        },
        "xl": {
          "columns": 2,
          "stacked": false
        }
      },
      "accessibility": {
        "landmark": "section",
        "image_alt_required": false,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "contact_click"
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
          "locator": "data-rv=\"15 · PRICING\"; .robot-pricing"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"15\"; .robot-pricing"
        },
        {
          "source": "DESIGN-SYSTEM-TZ.md",
          "locator": "KIBER-32-commercial-components-mvp"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "pricing-default",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "pricing",
        "data": {
          "title": "Тарифы для согласования",
          "disclaimer": "Не является публичной офертой",
          "items": [
            {
              "label": "Unitree G1",
              "price": "от 15 000 ₽ / час",
              "note": "минимум 1 час, итог зависит от сценария"
            },
            {
              "label": "Робот София",
              "price": "цена по запросу",
              "note": "рассчитывается после брифа и проверки доступности"
            }
          ]
        },
        "source": "design-system/fixtures/pricing/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "pricing-long-content",
        "variant": "default",
        "viewport": "xl",
        "mode": "long-content",
        "block_id": "pricing",
        "data": {
          "title": "Тарифы для согласования — длинная проверка переносов",
          "disclaimer": "Не является публичной офертой",
          "items": [
            {
              "label": "Unitree G1",
              "price": "от 15 000 ₽ / час",
              "note": "минимум 1 час, итог зависит от сценария"
            },
            {
              "label": "Робот София",
              "price": "цена по запросу",
              "note": "рассчитывается после брифа и проверки доступности"
            }
          ]
        },
        "source": "design-system/fixtures/pricing/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "pricing-minimal",
        "variant": "default",
        "viewport": "md",
        "mode": "minimal",
        "block_id": "pricing",
        "data": {
          "title": "Тарифы для согласования",
          "disclaimer": "Не является публичной офертой",
          "items": [
            {
              "label": "Unitree G1",
              "price": "от 15 000 ₽ / час",
              "note": "минимум 1 час, итог зависит от сценария"
            },
            {
              "label": "Робот София",
              "price": "цена по запросу",
              "note": "рассчитывается после брифа и проверки доступности"
            }
          ]
        },
        "source": "design-system/fixtures/pricing/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "pricing-missing-optional",
        "variant": "default",
        "viewport": "lg",
        "mode": "missing-optional",
        "block_id": "pricing",
        "data": {
          "title": "Тарифы для согласования",
          "disclaimer": "Не является публичной офертой",
          "items": [
            {
              "label": "Unitree G1",
              "price": "от 15 000 ₽ / час",
              "note": "минимум 1 час, итог зависит от сценария"
            },
            {
              "label": "Робот София",
              "price": "цена по запросу",
              "note": "рассчитывается после брифа и проверки доступности"
            }
          ]
        },
        "source": "design-system/fixtures/pricing/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "pricing-mobile",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "pricing",
        "data": {
          "title": "Тарифы для согласования",
          "disclaimer": "Не является публичной офертой",
          "items": [
            {
              "label": "Unitree G1",
              "price": "от 15 000 ₽ / час",
              "note": "минимум 1 час, итог зависит от сценария"
            },
            {
              "label": "Робот София",
              "price": "цена по запросу",
              "note": "рассчитывается после брифа и проверки доступности"
            }
          ]
        },
        "source": "design-system/fixtures/pricing/mobile.yaml"
      }
    ],
    load: () => import("../components/blocks/Pricing.astro"),
  },
  {
    spec: {
      "schema_version": 1,
      "id": "lead-form",
      "review_id": "31",
      "name": "Lead Form",
      "status": "pilot",
      "component": "src/components/blocks/LeadForm.astro",
      "used_in": [
        "home",
        "robot",
        "collection",
        "design-review"
      ],
      "variants": [
        "default"
      ],
      "tokens": {
        "surface": "{color.surface}",
        "canvas": "{color.canvas}",
        "action": "{color.action.rest}",
        "border": "{color.border}",
        "heading": "{typography.heading.family}",
        "spacing": "{layout.content.padding}"
      },
      "content_contract": {
        "required": [
          "title",
          "text",
          "fields",
          "submit",
          "disabled_reason",
          "analytics"
        ],
        "optional": [],
        "rules": [
          "public copy stays factual and does not promise unavailable lead destinations",
          "focus-visible state remains available for every interactive element",
          "mobile and desktop fixtures are reviewed before reuse in production pages"
        ]
      },
      "responsive": {
        "sm": {
          "columns": 1,
          "stacked": true
        },
        "md": {
          "columns": 1,
          "stacked": true
        },
        "lg": {
          "columns": 2,
          "stacked": false
        },
        "xl": {
          "columns": 2,
          "stacked": false
        }
      },
      "accessibility": {
        "landmark": "section",
        "image_alt_required": false,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "contact_click"
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
          "locator": "data-rv=\"31 · LEAD FORM\"; .lead-form"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"31\"; .lead-form"
        },
        {
          "source": "DESIGN-SYSTEM-TZ.md",
          "locator": "KIBER-32-commercial-components-mvp"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "lead-form-default",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "lead-form",
        "data": {
          "title": "Заявка на подбор робота",
          "text": "Форма показывает будущий production UX. До утверждения каналов отправки кнопка отключена.",
          "fields": [
            {
              "name": "name",
              "label": "Имя",
              "required": true
            },
            {
              "name": "phone",
              "label": "Телефон",
              "required": true
            },
            {
              "name": "event",
              "label": "Что за мероприятие",
              "required": false
            }
          ],
          "submit": "Отправить заявку",
          "disabled_reason": "Отправка будет включена после утверждения lead destination и legal/consent policy.",
          "analytics": {
            "event": "contact_click",
            "block_id": "lead-form"
          }
        },
        "source": "design-system/fixtures/lead-form/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "lead-form-long-content",
        "variant": "default",
        "viewport": "xl",
        "mode": "long-content",
        "block_id": "lead-form",
        "data": {
          "title": "Заявка на подбор робота — длинная проверка переносов",
          "text": "Форма показывает будущий production UX. До утверждения каналов отправки кнопка отключена.",
          "fields": [
            {
              "name": "name",
              "label": "Имя",
              "required": true
            },
            {
              "name": "phone",
              "label": "Телефон",
              "required": true
            },
            {
              "name": "event",
              "label": "Что за мероприятие",
              "required": false
            }
          ],
          "submit": "Отправить заявку",
          "disabled_reason": "Отправка будет включена после утверждения lead destination и legal/consent policy.",
          "analytics": {
            "event": "contact_click",
            "block_id": "lead-form"
          }
        },
        "source": "design-system/fixtures/lead-form/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "lead-form-minimal",
        "variant": "default",
        "viewport": "md",
        "mode": "minimal",
        "block_id": "lead-form",
        "data": {
          "title": "Заявка на подбор робота",
          "text": "Форма показывает будущий production UX. До утверждения каналов отправки кнопка отключена.",
          "fields": [
            {
              "name": "name",
              "label": "Имя",
              "required": true
            },
            {
              "name": "phone",
              "label": "Телефон",
              "required": true
            },
            {
              "name": "event",
              "label": "Что за мероприятие",
              "required": false
            }
          ],
          "submit": "Отправить заявку",
          "disabled_reason": "Отправка будет включена после утверждения lead destination и legal/consent policy.",
          "analytics": {
            "event": "contact_click",
            "block_id": "lead-form"
          }
        },
        "source": "design-system/fixtures/lead-form/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "lead-form-missing-optional",
        "variant": "default",
        "viewport": "lg",
        "mode": "missing-optional",
        "block_id": "lead-form",
        "data": {
          "title": "Заявка на подбор робота",
          "text": "Форма показывает будущий production UX. До утверждения каналов отправки кнопка отключена.",
          "fields": [
            {
              "name": "name",
              "label": "Имя",
              "required": true
            },
            {
              "name": "phone",
              "label": "Телефон",
              "required": true
            },
            {
              "name": "event",
              "label": "Что за мероприятие",
              "required": false
            }
          ],
          "submit": "Отправить заявку",
          "disabled_reason": "Отправка будет включена после утверждения lead destination и legal/consent policy.",
          "analytics": {
            "event": "contact_click",
            "block_id": "lead-form"
          }
        },
        "source": "design-system/fixtures/lead-form/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "lead-form-mobile",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "lead-form",
        "data": {
          "title": "Заявка на подбор робота",
          "text": "Форма показывает будущий production UX. До утверждения каналов отправки кнопка отключена.",
          "fields": [
            {
              "name": "name",
              "label": "Имя",
              "required": true
            },
            {
              "name": "phone",
              "label": "Телефон",
              "required": true
            },
            {
              "name": "event",
              "label": "Что за мероприятие",
              "required": false
            }
          ],
          "submit": "Отправить заявку",
          "disabled_reason": "Отправка будет включена после утверждения lead destination и legal/consent policy.",
          "analytics": {
            "event": "contact_click",
            "block_id": "lead-form"
          }
        },
        "source": "design-system/fixtures/lead-form/mobile.yaml"
      }
    ],
    load: () => import("../components/blocks/LeadForm.astro"),
  },
  {
    spec: {
      "schema_version": 1,
      "id": "site-footer",
      "review_id": "33",
      "name": "Site Footer",
      "status": "pilot",
      "component": "src/components/layout/Footer.astro",
      "used_in": [
        "all-public-pages",
        "design-review"
      ],
      "variants": [
        "default"
      ],
      "tokens": {
        "surface": "{color.ink.dark}",
        "foreground": "{color.ink.inverse}",
        "muted": "{color.text.subtle}",
        "action": "{color.action.rest}"
      },
      "content_contract": {
        "required": [
          "logo_label",
          "description",
          "sections",
          "phone",
          "email",
          "messengers",
          "legal_notice",
          "legal_links"
        ],
        "optional": [],
        "rules": [
          "contacts and legal links remain usable without JavaScript",
          "published contacts are sourced from validated public config"
        ]
      },
      "responsive": {
        "sm": {
          "columns": 1
        },
        "md": {
          "columns": 2
        },
        "lg": {
          "columns": 4
        },
        "xl": {
          "columns": 4
        }
      },
      "accessibility": {
        "landmark": "contentinfo",
        "image_alt_required": false,
        "full_card_link": false,
        "focus_visible": true
      },
      "analytics": {
        "events": [
          "phone_click",
          "contact_click"
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
          "locator": "data-rv=\"33 · FOOTER\"; .site-footer"
        },
        {
          "source": "docs/source/reference-mobile-v3.html",
          "locator": "data-rv=\"33\"; .site-footer"
        },
        {
          "source": "docs/DESIGN-SYSTEM-TZ.md",
          "locator": "Header/Footer/Breadcrumbs"
        }
      ]
    },
    fixtures: [
      {
        "schema_version": 1,
        "id": "site-footer-default",
        "variant": "default",
        "viewport": "xl",
        "mode": "reference",
        "block_id": "site-footer",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "description": "Аренда роботов для мероприятий в Москве и по всей России.",
          "sections": [
            {
              "title": "Каталог",
              "links": [
                {
                  "href": "/#catalog",
                  "label": "Все роботы"
                },
                {
                  "href": "/roboty-gumanoidy",
                  "label": "Гуманоиды"
                }
              ]
            },
            {
              "title": "Контент",
              "links": [
                {
                  "href": "/articles",
                  "label": "Блог"
                },
                {
                  "href": "/news",
                  "label": "Новости"
                }
              ]
            }
          ],
          "phone": "+7 000 000-00-00",
          "email": "hello@kiber-portal.ru",
          "messengers": [
            {
              "href": "https://t.me/kiber_portal",
              "label": "Telegram"
            }
          ],
          "legal_notice": "Не является публичной офертой",
          "legal_links": [
            {
              "href": "/privacy-policy",
              "label": "Политика конфиденциальности"
            }
          ]
        },
        "source": "design-system/fixtures/site-footer/default.yaml"
      },
      {
        "schema_version": 1,
        "id": "site-footer-long-content",
        "variant": "default",
        "viewport": "lg",
        "mode": "long-content",
        "block_id": "site-footer",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "description": "Аренда роботов-гуманоидов, роботов-собак и интерактивных решений для мероприятий в Москве и по всей России.",
          "sections": [
            {
              "title": "Каталог роботов",
              "links": [
                {
                  "href": "/#catalog",
                  "label": "Все роботы и интерактивные решения"
                }
              ]
            },
            {
              "title": "Полезные материалы",
              "links": [
                {
                  "href": "/articles",
                  "label": "Статьи и руководства по роботам"
                }
              ]
            }
          ],
          "phone": "+7 000 000-00-00",
          "email": "hello@kiber-portal.ru",
          "messengers": [
            {
              "href": "https://t.me/kiber_portal",
              "label": "Telegram"
            },
            {
              "href": "https://wa.me/70000000000",
              "label": "WhatsApp"
            }
          ],
          "legal_notice": "Информация на сайте не является публичной офертой.",
          "legal_links": [
            {
              "href": "/privacy-policy",
              "label": "Политика обработки персональных данных"
            },
            {
              "href": "/cookie-policy",
              "label": "Политика использования cookie"
            }
          ]
        },
        "source": "design-system/fixtures/site-footer/long-content.yaml"
      },
      {
        "schema_version": 1,
        "id": "site-footer-minimal",
        "variant": "default",
        "viewport": "md",
        "mode": "minimal",
        "block_id": "site-footer",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "description": "Роботы для мероприятий.",
          "sections": [
            {
              "title": "Сайт",
              "links": [
                {
                  "href": "/contacts",
                  "label": "Контакты"
                }
              ]
            }
          ],
          "phone": "+7 000 000-00-00",
          "email": "hello@kiber-portal.ru",
          "messengers": [],
          "legal_notice": "Не является публичной офертой",
          "legal_links": [
            {
              "href": "/privacy-policy",
              "label": "Конфиденциальность"
            }
          ]
        },
        "source": "design-system/fixtures/site-footer/minimal.yaml"
      },
      {
        "schema_version": 1,
        "id": "site-footer-missing-optional",
        "variant": "default",
        "viewport": "xl",
        "mode": "missing-optional",
        "block_id": "site-footer",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "description": "Роботы для мероприятий.",
          "sections": [
            {
              "title": "Каталог",
              "links": [
                {
                  "href": "/#catalog",
                  "label": "Все роботы"
                }
              ]
            }
          ],
          "phone": "+7 000 000-00-00",
          "email": "hello@kiber-portal.ru",
          "messengers": [],
          "legal_notice": "Не является публичной офертой",
          "legal_links": [
            {
              "href": "/privacy-policy",
              "label": "Политика конфиденциальности"
            }
          ]
        },
        "source": "design-system/fixtures/site-footer/missing-optional.yaml"
      },
      {
        "schema_version": 1,
        "id": "site-footer-mobile",
        "variant": "default",
        "viewport": "sm",
        "mode": "mobile",
        "block_id": "site-footer",
        "data": {
          "logo_label": "КИБЕР ПОРТАЛ",
          "description": "Аренда роботов для мероприятий в Москве и по всей России.",
          "sections": [
            {
              "title": "Каталог",
              "links": [
                {
                  "href": "/#catalog",
                  "label": "Все роботы"
                }
              ]
            },
            {
              "title": "Контент",
              "links": [
                {
                  "href": "/articles",
                  "label": "Блог"
                }
              ]
            }
          ],
          "phone": "+7 000 000-00-00",
          "email": "hello@kiber-portal.ru",
          "messengers": [
            {
              "href": "https://t.me/kiber_portal",
              "label": "Telegram"
            }
          ],
          "legal_notice": "Не является публичной офертой",
          "legal_links": [
            {
              "href": "/privacy-policy",
              "label": "Политика конфиденциальности"
            }
          ]
        },
        "source": "design-system/fixtures/site-footer/mobile.yaml"
      }
    ],
    load: () => import("../components/layout/Footer.astro"),
  }
] as const;

export type RegisteredBlockId = (typeof blockRegistry)[number]['spec']['id'];
