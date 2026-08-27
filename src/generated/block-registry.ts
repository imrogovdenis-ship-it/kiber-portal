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
              "url": "/robots/unitree-g1/"
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
              "url": "/robots/unitree-g1/"
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
              "url": "/robots/unitree-g1/"
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
