<?php
require __DIR__ . '/../replay.pokemonshowdown.com/replay-access.lib.php';
require __DIR__ . '/../lib/login-throttle.lib.php';
require __DIR__ . '/../pokemonshowdown.com/news/format.lib.php';
function verify($condition, $message) { if (!$condition) throw new Exception($message); }
foreach (['../secret', '../../config/news', 'bad/name', 'bad\\name', ['array'], str_repeat('x',257)] as $invalid) verify(!validReplayName($invalid), 'Reject invalid replay IDs');
foreach (['gen9ou-1234','oldserver-battle-abc-123-secretpw'] as $valid) verify(!!validReplayName($valid), 'Retain valid IDs');
verify(replayIsDeleted(['private'=>'3']), 'Database string deletion marker');
verify(!replayIsDeleted(['private'=>1]), 'Ordinary private replay retained');
verify(replayCachePath('../../config/news')===false,'No traversal cache include');
$now=200000;
verify(currentLoginThrottle(['time'=>$now-86400,'count'=>501],$now)['count']===0,'Expired block reset at boundary');
verify(currentLoginThrottle(['time'=>$now-86399,'count'=>501],$now)['count']===501,'Active block retained');
verify(formatNewsText("[i]Italic[/i]\n[b]Bold[/b]\n\n[url=\"https://example.com\"]Link[/url]")==='<p><em>Italic</em><br /><strong>Bold</strong></p><p><a href="https://example.com" target="_blank">Link</a></p>','Shared news formatting');
verify(formatNewsText('[url=https://example.com]Link[/url]')===formatNewsText('[url="https://example.com"]Link[/url]'),'Quoted URL consistency');
// Exercise the real password verification method without production configuration or DB access.
$source=file_get_contents(__DIR__.'/../lib/ntbb-session.lib.php');
$start=strpos($source,'private function passwordVerifyInner');
$end=strpos($source,"\n\tfunction login(",$start);
$method=substr($source,$start,$end-$start);
eval('class TestSession { public function getIp(){return "127.0.0.1";} public function passwordNeedsRehash($hash){return false;} '.str_replace('private function','public function',$method).'}');
class ThrottleDB {
 public $prefix=''; public $row; public $writes=[];
 function query($sql,$args){if(str_starts_with($sql,'SELECT'))return true;$this->writes[]=$args;return true;}
 function fetch_assoc($result){return $this->row;}
}
$psdb=new ThrottleDB();$psconfig=[];$session=new TestSession();
$user=['passwordhash'=>password_hash('correct',PASSWORD_BCRYPT),'email'=>''];
$psdb->row=['time'=>time()-90000,'count'=>900];
verify($session->passwordVerifyInner('player','correct',$user),'Correct password accepted after expired exhausted window');
$psdb->row=['time'=>time()-100,'count'=>501];
verify(!$session->passwordVerifyInner('player','correct',$user),'Active exhausted window rejects login');
verify(!$psdb->writes,'Blocked attempt must not extend window');
$psdb->row=['time'=>time()-100,'count'=>1];
verify(!$session->passwordVerifyInner('player','wrong',$user),'Bad password rejected');
verify($psdb->writes[0][2]===$psdb->row['time'],'Failed attempt retains fixed window start');
$replaySource=file_get_contents(__DIR__.'/../replay.pokemonshowdown.com/replays.lib.php');
$classStart=strpos($replaySource,'class Replays {');
$classEnd=strpos($replaySource,"\n\$GLOBALS['Replays']",$classStart);
eval(substr($replaySource,$classStart,$classEnd-$classStart));
class ReplayStatement {
 public $row;
 function __construct($row){$this->row=$row;}
 function execute($values){return true;}
 function fetch(){return $this->row;}
}
class ReplayDB {
 public $row=['private'=>'3','players'=>'A,B','formatid'=>'gen9ou'];
 public $queries=[];
 function prepare($sql){$this->queries[]=$sql;return new ReplayStatement($this->row);}
}
$replays=(new ReflectionClass('Replays'))->newInstanceWithoutConstructor();$replays->db=new ReplayDB();
verify($replays->get('gen9ou-1')===false,'Deleted replay cannot be fetched publicly');
verify(is_array($replays->get('gen9ou-1',false,true)),'Authorized management can fetch deleted replay');
$replays->db->row['private']=1;
verify(is_array($replays->get('gen9ou-1')),'Private replay remains available for password check');
foreach ([0,1,2,3] as $privacy) $replays->edit(['id'=>'gen9ou-1','private'=>$privacy,'password'=>null]);
$updates=array_values(array_filter($replays->db->queries,fn($sql)=>str_starts_with($sql,'UPDATE')));
verify(count($updates)===6,'Exercise view increments and each privacy update');
foreach ($updates as $sql) {
 verify(!str_contains($sql,'LIMIT'),'Updates use PostgreSQL-compatible syntax');
 verify(str_ends_with($sql,'WHERE id = ?'),'Updates remain bounded by the unique replay ID');
}
// The cache-hit management path must initialize the service before mutation.
// Run its actual authorized branch with a fixture bootstrap and the real class.
$manageSource=file_get_contents(__DIR__.'/../replay.pokemonshowdown.com/replay-manage.php');
$mutationStart=strpos($manageSource,'if ($manage) {');
$mutationEnd=strpos($manageSource,'?>',$mutationStart);
$mutation=substr($manageSource,$mutationStart,$mutationEnd-$mutationStart).'}';
$fixture=sys_get_temp_dir().'/replay-review-'.bin2hex(random_bytes(8));
mkdir($fixture);
file_put_contents($fixture.'/replays.lib.php','<?php $Replays=(new ReflectionClass("Replays"))->newInstanceWithoutConstructor(); $Replays->db=new ReplayDB();');
$cacheRoot=__DIR__.'/../replay.pokemonshowdown.com/caches';
$createdCacheDirectory=!is_dir($cacheRoot);
if ($createdCacheDirectory) mkdir($cacheRoot);
$id='review-cache-'.bin2hex(random_bytes(8));
$cacheFile=$cacheRoot.'/'.$id.'.inc.php';
file_put_contents($cacheFile,'<?php $replay = [];');
try {
 unset($Replays);
 $cached=true;$manage=true;$csrfOk=true;$_POST=['private'=>'3'];
 $replay=['id'=>$id,'private'=>0,'password'=>null];
 ob_start();
 try { eval(str_replace('__DIR__',var_export($fixture,true),$mutation)); }
 finally { ob_end_clean(); }
 verify(isset($Replays),'Cached management initializes the replay service');
 verify(!file_exists($cacheFile),'Cached privacy mutation invalidates the public cache');
 verify(count(array_filter($Replays->db->queries,fn($sql)=>str_contains($sql,'SET private = 3')))===1,'Authorized cached deletion updates the database');
} finally {
 if (is_file($cacheFile)) unlink($cacheFile);
 unlink($fixture.'/replays.lib.php');rmdir($fixture);
 if ($createdCacheDirectory) rmdir($cacheRoot);
}
echo "PHP review regressions passed\n";
