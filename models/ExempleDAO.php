<?php
require_once(PATH_MODELS . 'DAO.php');

class ExempleDAO extends DAO{
	public function test(){
		$result = $this->queryAll("SELECT * FROM test");
        return $result;
	}
}