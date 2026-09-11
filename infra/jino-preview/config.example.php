<?php
// Place outside document roots at ACCOUNT_HOME/.kiber-jino-prep/config.php, mode 600.
return [
 'prefix' => '',
 'origin' => 'https://jino-preview.kiber-portal.ru',
 'url' => 'https://UPSTREAM_HOST/PROTECTED_ROUTE',
 'resolve' => 'UPSTREAM_HOST:443:UPSTREAM_IP',
 'auth' => 'REPLACE_WITH_PRIVATE_SERVICE_CREDENTIAL',
];
