<?php
include_once "config.php" ;

if (!get_magic_quotes_gpc()) {
    $id = addslashes($_GET['id']);
} else {
    $id = $_GET['id'];
}

echo "success " . $id;
$xml = simplexml_load_file($xmlfilename);

$toDelete = $xml->xpath("/images/image[@id='" . $id . "']");
foreach ($toDelete as $i => $el){
    unlink($uploaddir . $el->file);
    $domEl = dom_import_simplexml($el);
    $domEl->parentNode->removeChild($domEl);
}
//print_r($toDelete);

$xml->asXML($xmlfilename); 
?>