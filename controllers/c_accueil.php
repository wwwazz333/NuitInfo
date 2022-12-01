<?php
require_once(PATH_MODELS . 'ExempleDAO.php');

$DAO = new ExempleDAO(DEBUG);
$test = $DAO->test();
print_r($test);


require_once(PATH_VIEWS . $page . '.php');

