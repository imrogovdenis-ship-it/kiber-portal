<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
function stopWith(int $status,string $error): never {http_response_code($status);echo json_encode(['ok'=>false,'error'=>$error]);exit;}
try {
 $config=dirname(__DIR__,2).'/.kiber-jino-prep/production.php';
 if(!is_file($config))stopWith(503,'service unavailable');
 $c=require $config;
 $upstreamOrigin=$c['origin'];
 $c['origin']='https://jino-preview.kiber-portal.ru';
 if(strtolower($_SERVER['HTTP_HOST']??'')!=='jino-preview.kiber-portal.ru')stopWith(403,'host not allowed');
 $checkDir=dirname(__DIR__,2).'/.kiber-jino-manual-check';
 $control=json_decode(@file_get_contents($checkDir.'/control.json')?:'',true);
 if(!is_array($control)||($control['enabled']??false)!==true||time()>=(int)($control['expiresAt']??0))stopWith(410,'manual check closed');
 $attempt=fopen($checkDir.'/attempt','c+');
 if(!$attempt||!flock($attempt,LOCK_EX))stopWith(503,'check unavailable');
 if(stream_get_contents($attempt)!=='')stopWith(410,'manual check already attempted');
 $path=parse_url($_SERVER['REQUEST_URI']??'',PHP_URL_PATH);
 $statusPath=$path==='/manual-lead-check.php'&&($_GET['status']??'')==='1';
 $postPath=$path==='/manual-lead-check.php'&&!isset($_GET['status']);
 if(!$statusPath&&!$postPath)stopWith(404,'not found');
 $method=$_SERVER['REQUEST_METHOD']??'';
 if(($statusPath&&$method!=='GET')||($postPath&&$method!=='POST'))stopWith(405,'method not allowed');
 $h=curl_init($c['url'].($statusPath?'/api/leads/status':'/api/leads'));
 curl_setopt_array($h,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_TIMEOUT=>($postPath?40:15),CURLOPT_FOLLOWLOCATION=>false,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_RESOLVE=>[$c['resolve']],CURLOPT_HTTPAUTH=>CURLAUTH_BASIC,CURLOPT_USERPWD=>$c['auth'],CURLOPT_HTTPHEADER=>['Accept: application/json']]);
 if($postPath){
 if(($_SERVER['HTTP_ORIGIN']??'')!==$c['origin'])stopWith(403,'origin not allowed');
 if(($_POST['manual_check']??'')!=='1')stopWith(400,'manual check required');
 unset($_POST['manual_check']);
 if(!is_string($_POST['source_page']??''))stopWith(400,'invalid source');
 $_POST['source_page']=$c['origin'].'/'.ltrim($_POST['source_page']??'','/');
 $ct=$_SERVER['CONTENT_TYPE']??'';
 if(preg_match('/[\r\n]/',$ct)||!preg_match('~^multipart/form-data(;|$)~i',$ct))stopWith(415,'unsupported media type');
 if(($_SERVER['HTTP_CONTENT_ENCODING']??'identity')!=='identity')stopWith(415,'unsupported content encoding');
 $origin=$_SERVER['HTTP_ORIGIN']??$c['origin'];if($origin!==$c['origin'])stopWith(403,'origin not allowed');
 if((int)($_SERVER['CONTENT_LENGTH']??0)>65536)stopWith(413,'payload too large');

  if(!empty($_FILES))stopWith(400,'files not supported');
  foreach($_POST as $value){if(!is_string($value))stopWith(400,'invalid form fields');}
  $requestBody=http_build_query($_POST,'','&',PHP_QUERY_RFC3986);$ct='application/x-www-form-urlencoded';

 if(strlen($requestBody)>65536)stopWith(413,'payload too large');
curl_setopt_array($h,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>$requestBody,CURLOPT_HTTPHEADER=>['Accept: application/json','Content-Type: '.$ct,'Origin: '.$upstreamOrigin,'X-Kiber-Client-IP: '.(filter_var($_SERVER['REMOTE_ADDR']??'',FILTER_VALIDATE_IP)?$_SERVER['REMOTE_ADDR']:'')]]);}
 if($postPath){
  $marker=json_encode(['attemptedAt'=>time()]);
  if(fwrite($attempt,$marker)!==strlen($marker)||!fflush($attempt))stopWith(503,'cannot reserve check');
 }
 $body=curl_exec($h);$status=curl_getinfo($h,CURLINFO_RESPONSE_CODE);$err=curl_errno($h);curl_close($h);
 if($err||$status<200||$status>=500)stopWith(503,'upstream unavailable');
 $data=json_decode($body,true);if(!is_array($data))stopWith(503,'invalid upstream response');
 if($status<300&&(($data['mode']??'')!==($c['expected_mode']??'dry-run')||($data['ok']??false)!==true))stopWith(503,'unexpected upstream mode');
 if($status<300)header('X-Kiber-Bridge-Mode: '.$data['mode']);
 if(isset($data['redirectTo'])){$data['redirectTo']=$c['prefix'].'/lead/thanks/';}
 if($postPath&&$status<300&&isset($data['redirectTo'])&&str_contains($_SERVER['HTTP_ACCEPT']??'','text/html')){header('Location: '.$data['redirectTo'],true,303);exit;}
 http_response_code($status);echo json_encode($data);
} catch(Throwable $e){stopWith(503,'service unavailable');}
