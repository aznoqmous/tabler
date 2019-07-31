<?php
$datas = $_POST['data'];
if(!$datas) return false;
$filename = array_key_exists('filename', $_POST) ? $_POST['filename'] : 'tabler-export.csv';
$file = "tmp/$filename";

file_put_contents('../'.$file, $datas);

echo json_encode($file);
