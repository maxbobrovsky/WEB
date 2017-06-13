<?php
include_once "config.php";

/*****************/
function getExtension($filename) {
    return end(explode(".", $filename));
}
/*****************/
//$extension = "." . strtolower( getExtension(basename($_FILES['userfile']['name'])) );
$pinfo = pathinfo($_FILES['userfile']['name']);
$extension = "." . strtolower( $pinfo['extension'] );
if (!in_array($extension, $allowedExtensions)) {
    die("Allowed only " . implode(" ", $allowedExtensions) . " " . $_FILES['userfile']['name']);
}                                          

$file = date("d-m-y") . "-" . rand() . $extension;
$file_path = $uploaddir . $file;
if (move_uploaded_file($_FILES['userfile']['tmp_name'], $file_path)) {
    list($day, $month, $year) = explode('-', date("d-m-y"));

    $xml = simplexml_load_file($xmlfilename);
    $image = $xml->addChild("image");
    $image->addAttribute("id", "img-" . date("d-m-y") . "-" . rand());
        if ($_POST['title']) {
                $image->addChild("title", $_POST['title']);
        } else {
                $image->addChild("title", $pinfo['filename']);
        }
        $image->addChild("description", $_POST['descr']);
        $date = $image->addChild("date");  
            $date->addChild("day", $day);
            $date->addChild("month", $month);
            $date->addChild("year", $year);
        $image->addChild("file", $file);


    //$dom_sxe = dom_import_simplexml($xml);
    //$dom = new DOMDocument('1.0');
    //$dom_sxe = $dom->importNode($dom_sxe, true);
    //$dom_sxe = $dom->appendChild($dom_sxe);
    //$dom->save($xmlfilename);

    $xml->asXML($xmlfilename);
    echo "success"; 
} else {
    echo "error";
 }
?>