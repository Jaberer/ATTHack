<?php

if ($mongo  = new MongoClient("mongodb://user:password@ds047581.mongolab.com:47581")) {
	$db = $mongo->Weelz;
   	$pins = $db->pins;
} else {
	printf("no db\n");
	exit;
}

?>